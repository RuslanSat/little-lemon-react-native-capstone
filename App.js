import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {menu, validProfile, filterMenu} from './menu.cjs';

const Stack = createNativeStackNavigator();
const STORAGE = 'little-lemon-profile-v1';
const emptyProfile = {firstName:'',lastName:'',email:'',phone:''};
const palette = {green:'#495e57',yellow:'#f4ce14',cream:'#f8f7f2',ink:'#243d34',muted:'#617069'};

function Button({children,onPress,disabled=false,secondary=false}) {
  return <Pressable accessibilityRole="button" accessibilityState={{disabled}} disabled={disabled} onPress={onPress} style={[s.button,secondary&&s.secondary,disabled&&s.disabled]}><Text style={s.buttonText}>{children}</Text></Pressable>;
}
function Field({label,value,onChangeText,type='default'}) {
  return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} keyboardType={type} autoCapitalize={type==='email-address'?'none':'words'} style={s.input}/></View>;
}
function Brand(){return <Text accessibilityRole="header" style={s.brand}>🍋 LITTLE LEMON</Text>;}

function Onboarding({saveProfile}) {
  const [details,setDetails]=useState(emptyProfile);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  async function next(){setBusy(true);setError('');try{await saveProfile(details);}catch{setError('Unable to save your details. Please try again.');}finally{setBusy(false);}}
  return <SafeAreaView style={s.page}><ScrollView contentContainerStyle={s.onboarding}><Brand/><View style={s.welcome}><Text style={s.eyebrow}>WELCOME TO OUR TABLE</Text><Text accessibilityRole="header" style={s.title}>Good food.{"\n"}Great company.</Text><Text style={s.intro}>Create your Little Lemon profile to explore our Mediterranean menu.</Text></View><Text style={s.sectionTitle}>Let’s get to know you</Text><Field label="First name" value={details.firstName} onChangeText={firstName=>setDetails({...details,firstName})}/><Field label="Email" type="email-address" value={details.email} onChangeText={email=>setDetails({...details,email})}/><Text style={s.hint}>Enter your first name and a valid email to continue.</Text>{error?<Text accessibilityRole="alert" style={s.error}>{error}</Text>:null}<Button disabled={!validProfile(details)||busy} onPress={next}>{busy?'Saving…':'Next'}</Button><Text style={s.footer}>Fresh ingredients. Family recipes. Chicago.</Text></ScrollView></SafeAreaView>;
}

function Home({navigation,profile}) {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState([]);
  const data=filterMenu(menu,query,category);
  const top=<><View style={s.header}><Brand/><Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={()=>navigation.navigate('Profile')} style={s.avatar}><Text style={s.avatarText}>{profile.firstName.slice(0,1).toUpperCase()}</Text></Pressable></View><View style={s.hero}><Text accessibilityRole="header" style={s.restaurant}>Little Lemon</Text><Text style={s.city}>Chicago</Text><Text style={s.description}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text><TextInput accessibilityLabel="Search menu" placeholder="Search dishes…" placeholderTextColor="#617069" value={query} onChangeText={setQuery} style={s.search}/></View><View style={s.breakdown}><Text accessibilityRole="header" style={s.sectionTitle}>ORDER FOR DELIVERY!</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categories}>{['All','Starters','Mains','Desserts','Drinks'].map(c=><Pressable key={c} accessibilityRole="button" accessibilityState={{selected:(c==='All'?category.length===0:category.includes(c))}} onPress={()=>setCategory(c==='All'?[]:category.includes(c)?category.filter(value=>value!==c):[...category,c])} style={[s.chip,(c==='All'?category.length===0:category.includes(c))&&s.selectedChip]}><Text style={[s.chipText,(c==='All'?category.length===0:category.includes(c))&&s.selectedChipText]}>{c}</Text></Pressable>)}</ScrollView><Text style={s.hint}>{data.length} delicious {data.length===1?'dish':'dishes'}</Text></View></>;
  return <SafeAreaView style={s.page}><FlatList data={data} keyExtractor={item=>item.id} ListHeaderComponent={top} ListEmptyComponent={<Text style={s.empty}>No dishes found. Try another search or category.</Text>} renderItem={({item})=><View style={s.dish}><View style={s.dishCopy}><Text style={s.dishName}>{item.name}</Text><Text numberOfLines={2} style={s.dishDescription}>{item.description}</Text><Text style={s.price}>${item.price.toFixed(2)}</Text></View><Image accessibilityLabel={item.name} source={{uri:item.image}} style={s.foodImage}/></View>}/></SafeAreaView>;
}

function Profile({profile,saveProfile,logout,navigation}) {
  const [details,setDetails]=useState({...profile});
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  async function save(){setBusy(true);try{await saveProfile(details);setStatus('Your changes have been saved.');}catch{setStatus('Unable to save changes. Please try again.');}finally{setBusy(false);}}
  async function exit(){setBusy(true);try{await logout();}catch{setStatus('Unable to log out. Please try again.');setBusy(false);}}
  return <SafeAreaView style={s.page}><ScrollView contentContainerStyle={s.profile}><Brand/><Text accessibilityRole="header" style={s.sectionTitle}>Personal information</Text><View style={[s.avatar,s.largeAvatar]}><Text style={s.largeAvatarText}>{details.firstName.slice(0,1).toUpperCase()}{details.lastName.slice(0,1).toUpperCase()}</Text></View>{[['firstName','First name','default'],['lastName','Last name','default'],['email','Email','email-address'],['phone','Phone number','phone-pad']].map(([key,label,type])=><Field key={key} label={label} type={type} value={details[key]} onChangeText={value=>{setDetails({...details,[key]:value});setStatus('');}}/>)}{status?<Text accessibilityRole="alert" style={s.status}>{status}</Text>:null}<Button disabled={!validProfile(details)||busy} onPress={save}>Save changes</Button><Button secondary onPress={()=>{setDetails({...profile});setStatus('Changes discarded.');}} disabled={busy}>Discard changes</Button><Button secondary onPress={exit} disabled={busy}>Log out</Button><Text style={s.hint}>Log out removes your saved profile from this device and returns you to onboarding.</Text></ScrollView></SafeAreaView>;
}

export default function App(){
  const [profile,setProfile]=useState(null);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState('');
  useEffect(()=>{AsyncStorage.getItem(STORAGE).then(raw=>{if(raw){const saved={...emptyProfile,...JSON.parse(raw)};if(validProfile(saved))setProfile(saved);}}).catch(()=>setLoadError('Your saved profile could not be loaded. You can enter your details again.')).finally(()=>setLoading(false));},[]);
  async function saveProfile(details){const clean={...details,firstName:details.firstName.trim(),email:details.email.trim()};if(!validProfile(clean))throw new Error('Invalid profile');await AsyncStorage.setItem(STORAGE,JSON.stringify(clean));setProfile(clean);}
  async function logout(){await AsyncStorage.removeItem(STORAGE);setProfile(null);}
  if(loading)return <SafeAreaView style={s.loading}><ActivityIndicator size="large" color={palette.green}/><Text>Loading Little Lemon…</Text></SafeAreaView>;
  return <NavigationContainer><Stack.Navigator screenOptions={{headerTintColor:palette.green,headerStyle:{backgroundColor:palette.cream},contentStyle:{backgroundColor:palette.cream}}}>{profile?<><Stack.Screen name="Home" options={{headerShown:false}}>{props=><Home {...props} profile={profile}/>}</Stack.Screen><Stack.Screen name="Profile" options={{title:'Your profile',headerBackTitle:'Back'}}>{props=><Profile {...props} profile={profile} saveProfile={saveProfile} logout={logout}/>}</Stack.Screen></>:<Stack.Screen name="Onboarding" options={{headerShown:false}}>{()=> <><Onboarding saveProfile={saveProfile}/>{loadError?<Text style={s.error}>{loadError}</Text>:null}</>}</Stack.Screen>}</Stack.Navigator></NavigationContainer>;
}

const s=StyleSheet.create({
  page:{flex:1,backgroundColor:palette.cream},loading:{flex:1,alignItems:'center',justifyContent:'center',gap:20},onboarding:{padding:24,paddingTop:36,maxWidth:640,width:'100%',alignSelf:'center'},brand:{fontSize:21,fontWeight:'800',color:palette.green,letterSpacing:1.3},welcome:{backgroundColor:palette.green,borderRadius:18,padding:24,marginVertical:30},eyebrow:{color:palette.yellow,fontSize:11,letterSpacing:2,fontWeight:'700'},title:{fontSize:43,lineHeight:49,color:palette.yellow,fontWeight:'700',marginVertical:14},intro:{color:'white',fontSize:16,lineHeight:24},sectionTitle:{fontSize:21,fontWeight:'800',color:palette.ink,marginBottom:16},field:{marginBottom:18},label:{color:palette.green,fontSize:14,fontWeight:'600',marginBottom:8},input:{borderWidth:1,borderColor:'#b3c0b9',backgroundColor:'white',borderRadius:9,padding:13,fontSize:16,color:palette.ink},button:{padding:16,backgroundColor:palette.yellow,borderRadius:10,alignItems:'center',marginTop:12},buttonText:{fontSize:16,fontWeight:'800',color:palette.ink},secondary:{backgroundColor:'#e5eae6',borderWidth:1,borderColor:'#b3c0b9'},disabled:{opacity:0.4},hint:{fontSize:13,lineHeight:20,color:palette.muted,marginBottom:10},footer:{textAlign:'center',color:palette.muted,marginTop:28,fontSize:12},header:{paddingHorizontal:22,paddingVertical:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},avatar:{width:44,height:44,borderRadius:22,backgroundColor:'#d6e3d3',alignItems:'center',justifyContent:'center'},avatarText:{fontSize:20,fontWeight:'700',color:palette.green},hero:{backgroundColor:palette.green,padding:23},restaurant:{fontSize:42,color:palette.yellow,fontWeight:'600'},city:{fontSize:25,color:'white',marginBottom:14},description:{fontSize:16,lineHeight:24,color:'white',maxWidth:530},search:{backgroundColor:'#fff',borderRadius:12,padding:14,fontSize:16,marginTop:22,color:palette.ink},breakdown:{padding:22,paddingBottom:12},categories:{gap:9,paddingBottom:13},chip:{paddingHorizontal:17,paddingVertical:10,borderRadius:20,backgroundColor:'#e5eae6'},selectedChip:{backgroundColor:palette.green},chipText:{fontWeight:'700',color:palette.green},selectedChipText:{color:'white'},dish:{flexDirection:'row',borderTopWidth:1,borderColor:'#d9ded9',marginHorizontal:22,paddingVertical:19,gap:18},dishCopy:{flex:1},dishName:{fontSize:19,fontWeight:'700',color:palette.ink,marginBottom:7},dishDescription:{fontSize:14,lineHeight:21,color:palette.muted},price:{fontSize:16,fontWeight:'700',color:palette.green,marginTop:9},foodImage:{width:90,height:90,borderRadius:13,backgroundColor:'#d6e3d3'},empty:{padding:25,color:palette.muted},profile:{padding:24,maxWidth:640,width:'100%',alignSelf:'center',gap:8},largeAvatar:{width:80,height:80,borderRadius:40,marginBottom:10},largeAvatarText:{fontSize:28,fontWeight:'700',color:palette.green},status:{fontSize:14,color:palette.green,paddingVertical:5},error:{color:'#a32a2a',fontSize:14,paddingVertical:8}
});

