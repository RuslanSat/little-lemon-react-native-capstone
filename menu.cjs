const menu = [
  {id:'1',name:'Greek Salad',price:12.99,category:'Starters',description:'Crisp lettuce, peppers, olives and feta, dressed with lemon and olive oil.',image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=240&auto=format&fit=crop'},
  {id:'2',name:'Bruschetta',price:7.99,category:'Starters',description:'Grilled sourdough with ripe tomatoes, fresh basil and extra virgin olive oil.',image:'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=240&auto=format&fit=crop'},
  {id:'3',name:'Grilled Fish',price:21.99,category:'Mains',description:'Tender grilled fish with seasonal vegetables and a bright lemon sauce.',image:'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=240&auto=format&fit=crop'},
  {id:'4',name:'Pasta Primavera',price:17.99,category:'Mains',description:'Pasta tossed with seasonal vegetables, herbs and parmesan.',image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=240&auto=format&fit=crop'},
  {id:'5',name:'Lemon Dessert',price:6.99,category:'Desserts',description:'Our house lemon cake, light, zesty and made fresh every morning.',image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=240&auto=format&fit=crop'},
  {id:'6',name:'Mint Lemonade',price:4.99,category:'Drinks',description:'Fresh lemons, mint leaves and sparkling water over ice.',image:'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?w=240&auto=format&fit=crop'}
];
const validProfile = p => Boolean(p.firstName.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()));
const filterMenu = (items, query, category) => items.filter(item => (category === 'All' || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()));
module.exports = {menu, validProfile, filterMenu};
