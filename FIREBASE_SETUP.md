# Firebase Setup Guide

This guide will walk you through setting up Firebase for this React Native application.

## Table of Contents
1. [Create Firebase Project](#create-firebase-project)
2. [Enable Firebase Services](#enable-firebase-services)
3. [Get Firebase Configuration](#get-firebase-configuration)
4. [Configure Environment Variables](#configure-environment-variables)
5. [Set Up Firebase Security Rules](#set-up-firebase-security-rules)

---

## Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "FirstReactNativeProject")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

---

## Enable Firebase Services

### 1. Enable Authentication

1. In Firebase Console, navigate to **Build** > **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### 2. Create Realtime Database

1. Navigate to **Build** > **Realtime Database**
2. Click **"Create Database"**
3. Select a location (e.g., **europe-west1** for Europe)
4. Choose **"Start in test mode"** (we'll set proper rules later)
5. Click **"Enable"**

### 3. Enable Cloud Storage

1. Navigate to **Build** > **Storage**
2. Click **"Get started"**
3. Keep default security rules
4. Select the same location as your database
5. Click **"Done"**

---

## Get Firebase Configuration

1. In Firebase Console, go to **Project settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click the **Web icon (<//>)** to add a web app
4. Register your app:
   - App nickname: "FirstReactNativeProject" (or any name)
   - (Optional) Set up Firebase Hosting - skip for now
5. Click **"Register app"**
6. Copy the Firebase configuration object

You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.region.firebasedatabase.app",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## Configure Environment Variables

### Step 1: Install Dependencies

If not already installed, add environment variable support:

```bash
npm install react-native-dotenv
# or
yarn add react-native-dotenv
```

### Step 2: Create `.env` File

Create a `.env` file in the project root:

```bash
# .env file - DO NOT COMMIT THIS FILE

# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Create `.env.example` File

Create a template file that CAN be committed:

```bash
# .env.example - Template for environment variables

# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 4: Update `.gitignore`

Ensure `.env` is in `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
```

### Step 5: Configure Babel

Update `babel.config.js` to support environment variables:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ]
  };
};
```

### Step 6: Use Environment Variables in Code

Update `config/index.js`:

```javascript
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};
```

---

## Set Up Firebase Security Rules

### Realtime Database Rules

1. Go to **Realtime Database** > **Rules** tab
2. Replace the default rules with:

```json
{
  "rules": {
    "profiles": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "chats": {
      "$chatId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

**Explanation:**
- Only authenticated users can read/write data
- Users can only write to their own profile
- All authenticated users can read/write to chats

### Storage Rules

1. Go to **Storage** > **Rules** tab
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profileImages/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Explanation:**
- Only authenticated users can read images
- Users can only upload to their own folder

3. Click **"Publish"**

---

## Testing Your Setup

1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials in `.env`
3. Restart the development server:
   ```bash
   npm start
   # or
   expo start
   ```
4. Clear cache if needed:
   ```bash
   expo start -c
   ```

---

## Troubleshooting

### Issue: Environment variables not loading

**Solution:**
1. Clear Metro bundler cache: `expo start -c`
2. Restart the development server
3. Check that `babel.config.js` is configured correctly
4. Verify `.env` file is in the project root

### Issue: Firebase initialization errors

**Solution:**
1. Double-check all credentials in `.env`
2. Ensure no extra spaces or quotes in `.env` values
3. Verify Firebase services are enabled in console

### Issue: Permission denied errors

**Solution:**
1. Check Firebase Security Rules
2. Ensure user is authenticated before database operations
3. Verify user has permission for the operation

---

## Security Best Practices

1. **Never commit `.env` file** - Always keep it in `.gitignore`
2. **Use different Firebase projects** for development and production
3. **Set up proper security rules** - Never use test mode in production
4. **Rotate API keys** if accidentally exposed
5. **Enable App Check** for additional security
6. **Monitor usage** in Firebase Console to detect abuse

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [React Native Firebase](https://rnfirebase.io/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

---

## Need Help?

If you encounter issues:
1. Check the [Firebase Console](https://console.firebase.google.com/) for error messages
2. Review the [Firebase Status Dashboard](https://status.firebase.google.com/)
3. Consult [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase) with the `firebase` tag

---

*Last Updated: 2025-11-12*
