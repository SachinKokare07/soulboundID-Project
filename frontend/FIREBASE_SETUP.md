# Firebase Setup Instructions (localStorage for Photos)

## Overview
This app uses:
- **Firestore Database**: Stores student info (name, college, department, wallet address) - **FREE Spark Plan**
- **Browser localStorage**: Stores photos as base64 - **No Firebase Storage needed!**

This means you can use the completely **FREE Spark plan** - no billing required! 🎉

## Steps to Configure Firebase

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Firestore Database (FREE)**
   - Go to Firestore Database in the left menu
   - Click "Create database"
   - Choose **Test mode** or **Production mode**
   - Select your region and click Enable

3. **Get Your Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Web" icon (</>) to add a web app
   - Copy the `firebaseConfig` object

4. **Update Configuration File**
   - Open `src/firebase/config.js`
   - Replace the placeholder values with your actual Firebase config
   - The imports are already uncommented and ready to use!

5. **Set Firestore Security Rules**
   - In Firebase Console, go to **Firestore Database** in the left sidebar
   - Click on the **Rules** tab at the top
   - Replace the existing rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /students/{document=**} {
         allow read, write: if true; // For testing - update with proper auth later
       }
     }
   }
   ```
   - Click **Publish** button

6. **Install Firebase**
   ```bash
   npm install firebase
   ```

7. **Test Your App**
   - Run `npm run dev`
   - Connect wallet → Fill student form → Submit
   - Data saved to localStorage (photos) and Firestore (text data)
   
## How Data is Stored

### Browser localStorage
- Stores **all student data** including photos as base64
- Accessible via browser DevTools → Application → Local Storage
- Persists even after closing browser
- No billing or Firebase plan upgrade needed!

### Firestore Database (optional backup)
- Also stores **text data + photo base64**
- Provides cloud backup and multi-device access
- Free Spark plan includes 1GB storage
- Completely optional - app works with localStorage only

## Data Structure

### localStorage Key: `students`
Array of student objects:
```javascript
[
  {
    name: "Student Name",
    college: "College Name",
    department: "Department",
    photo: "data:image/jpeg;base64,...",
    idPhoto: "data:image/jpeg;base64,...",
    walletAddress: "ALGORAND_ADDRESS",
    timestamp: "2026-02-11T..."
  }
]
```

### Firestore Collection: `students` (if configured)
Each document contains:
- `name`: Student's full name
- `college`: College/University name  
- `department`: Department name
- `photoBase64`: Student photo as base64 string
- `idPhotoBase64`: ID card photo as base64 string
- `walletAddress`: Connected Algorand wallet address
- `createdAt`: Firebase server timestamp
