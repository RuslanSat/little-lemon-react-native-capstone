# Little Lemon • React Native Capstone

An original Expo / React Native application prepared for the Meta Capstone (React App) assignment. Implementation was created with AI assistance for this submission.

## Run

Install Node.js 20.19+ and run:

```sh
npm install
npm start
```

Open the QR code in Expo Go (SDK 54), or select Android / iOS in a configured development environment. For the browser: `npm run web`. `npm test` checks validation and menu filtering. `npm run build:web` produces a static web preview.

## Reviewer walkthrough

1. Start with cleared app data: Onboarding asks for first name and email. **Next** stays disabled until both are valid.
2. Enter `Reviewer` and `reviewer@example.com`. Press **Next**.
3. Home contains the Little Lemon header, restaurant hero and search, selectable menu categories, and summarized food rows with description, image and price.
4. Search `lemon`. Select **Desserts**. Only the lemon dessert remains. Select **All** and clear search to reset.
   Categories support multiple selection: choose **Mains** and **Desserts** together to show Grilled Fish, Pasta and Lemon Dessert. Press an active category again to deselect it.
5. Press the avatar to open Profile. The onboarding name and email are already filled in. Edit a name or phone and press **Save changes**.
6. Restart / reload. Home remains accessible, and Profile retains the saved changes through AsyncStorage.
7. Use the navigation **Back** button to return from Profile to Home.
8. Press **Log out** in Profile. Saved profile storage is removed and Onboarding returns with blank fields.

`wireframe.jpg` documents the three screen layouts. Navigation uses React Navigation's native stack. Local menu data keeps the demonstration usable without a menu API; food photos require an internet connection. The capstone rubric does not require checkout or payment processing.

## Project files

- `App.js`: onboarding, home, profile and persistent session.
- `menu.cjs`: six sample dishes, validation and filter helpers.
- `checks.cjs`: runnable behavior checks.
- `wireframe.jpg`: original wireframe diagram.

## Design

Little Lemon green (#495E57), yellow (#F4CE14), warm neutral backgrounds, clear text labels, disabled invalid submission, selected category states and accessible control names. All menu entries are sample content.
