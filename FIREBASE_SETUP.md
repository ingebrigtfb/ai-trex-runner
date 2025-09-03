# Firebase Setup Guide for DINO DASH

## 🔥 **Firebase Project Setup**

### 1. **Enable Firestore Database**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `dino-dash-bdb69`
3. In the left sidebar, click **"Firestore Database"**
4. Click **"Create Database"**
5. Choose **"Start in test mode"** (for development)
6. Select a location (choose the closest to your users)
7. Click **"Done"**

### 2. **Update Firestore Rules**
Go to **Firestore Database** → **Rules** and set these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users under any document
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Note:** These rules allow anyone to read/write. For production, you should implement proper authentication.

### 3. **Verify Project Configuration**
Your current config looks correct:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCkrJf5TVZ8jkkVZ-l18EXrfHgE6aQIjLs",
  authDomain: "dino-dash-bdb69.firebaseapp.com",
  projectId: "dino-dash-bdb69",
  storageBucket: "dino-dash-bdb69.firebasestorage.app",
  messagingSenderId: "1028422359542",
  appId: "1:1028422359542:web:9009c63b3e450622f6cfd7",
  measurementId: "G-4ZY4CG733X"
};
```

### 4. **Test Connection**
After enabling Firestore, the leaderboard should work properly. If you still see errors:

1. **Check Network Tab**: Look for 400/403 errors
2. **Check Console**: Look for Firebase-specific error messages
3. **Verify Project ID**: Make sure it matches exactly

## 🚀 **Alternative: Local-Only Mode**

If Firebase continues to have issues, you can temporarily disable it by commenting out the Firebase import in `src/components/UserSystem.tsx`:

```typescript
// import FirebaseLeaderboard from './FirebaseLeaderboard'
```

This will make the leaderboard button show a "Coming Soon" message instead of trying to connect to Firebase.

## 🔧 **Troubleshooting Common Issues**

### **Error 400: Bad Request**
- Firestore database not enabled
- Incorrect project configuration
- Network connectivity issues

### **Error 403: Forbidden**
- Firestore rules too restrictive
- Authentication required but not implemented

### **Connection Timeout**
- Check internet connection
- Verify Firebase project is active
- Check if your IP is blocked

## 📱 **Testing the Leaderboard**

1. **Start the game**: `npm run dev`
2. **Open browser**: Navigate to `http://localhost:3000`
3. **Enter username**: Type any name and click "Start Playing"
4. **Click Leaderboard**: Should open the Firebase-powered leaderboard
5. **Check console**: Look for any Firebase errors

## 🆘 **Still Having Issues?**

If Firebase continues to fail:

1. **Check Firebase Console** for any error messages
2. **Verify billing** (Firebase has a free tier)
3. **Check project status** in Firebase Console
4. **Try creating a new Firebase project** with a different name

---

**Need Help?** Check the [Firebase Documentation](https://firebase.google.com/docs) or [Firebase Support](https://firebase.google.com/support)
