# Expo Group Chat

A full-featured mobile application built with React Native and Expo, showcasing user authentication, profile management, real-time group chat, and Firebase integration.

[![React Native](https://img.shields.io/badge/React%20Native-0.72.6-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2049-000020.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.0-orange.svg)](https://firebase.google.com/)

## Features

### 🔐 Authentication
- Secure email/password authentication with Firebase
- User registration with password validation
- Password strength requirements (minimum 6 characters + number)
- Input validation and error handling
- Secure text entry for passwords

### 👤 Profile Management
- Create and edit user profiles
- Profile picture upload to Firebase Storage
- Real-time profile synchronization
- User-linked profiles (profiles tied to authenticated users)
- Phone number validation

### 💬 Real-time Group Chat
- Live group messaging with Firebase Realtime Database
- Message timestamps and sender identification
- Auto-scroll to latest messages
- Message character limit (500 characters)
- Elegant chat UI with message bubbles

### 📋 User Directory
- View all registered user profiles
- Real-time profile updates
- Pull-to-refresh functionality
- Profile pictures with fallback defaults
- Clean card-based UI

## Screenshots

Run the Expo app locally to explore authentication, profiles and group messaging.

## Tech Stack

- **Framework**: React Native 0.72.6
- **Build Tool**: Expo SDK 49
- **Backend**: Firebase
  - Authentication
  - Realtime Database
  - Cloud Storage
- **Navigation**: React Navigation v6
  - Native Stack Navigator
  - Material Bottom Tabs
- **UI Components**: React Native Paper
- **Image Handling**: Expo Image Picker

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Mac only) or Android Emulator
- A [Firebase](https://firebase.google.com/) account

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/FirstReactNativeProject.git
cd FirstReactNativeProject
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - **Authentication** (Email/Password)
   - **Realtime Database**
   - **Cloud Storage**

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Add your Firebase configuration to `.env`:
   ```env
   FIREBASE_API_KEY=your_api_key_here
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789012
   FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

### 4. Start the development server

```bash
npm start
# or
expo start
```

### 5. Run on your device/emulator

- **iOS**: Press `i` in the terminal or scan the QR code with the Expo Go app
- **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
- **Web**: Press `w` in the terminal

## Project Structure

```
FirstReactNativeProject/
├── App.js                          # Main app entry with navigation
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── babel.config.js                 # Babel configuration
├── .env                            # Environment variables (not committed)
├── .env.example                    # Environment variables template
├── config/
│   └── index.js                    # Firebase configuration
├── screens/
│   ├── Auth.js                     # Sign-in screen
│   ├── NewUser.js                  # User registration screen
│   ├── Home.js                     # Main app with bottom tabs
│   └── HomeScreens/
│       ├── ListProfils.js          # Display all profiles
│       ├── Groupe.js               # Group chat screen
│       └── MyAccount.js            # Profile management
├── assets/                         # Images and static resources
├── FIREBASE_SETUP.md               # Detailed Firebase setup guide
├── CLAUDE.md                       # Technical documentation
└── README.md                       # This file
```

## Usage

### Creating an Account

1. Launch the app
2. Tap "Create new account"
3. Enter your email and password (min 6 characters with at least one number)
4. Confirm your password
5. Tap "Create Account"

### Creating Your Profile

1. Sign in to your account
2. Navigate to the "My Account" tab
3. Tap on the profile picture to upload a photo (optional)
4. Enter your first name, last name, and phone number
5. Tap "Save Profile"

### Using Group Chat

1. Navigate to the "Groupe" tab
2. Type your message in the input field
3. Tap "Send"
4. Messages appear in real-time for all users

### Viewing Profiles

1. Navigate to the "Liste Profiles" tab
2. Pull down to refresh the list
3. View all registered user profiles with their information

### Signing Out

1. Go to the "My Account" tab
2. Tap the "Sign Out" button at the bottom

## Firebase Database Structure

```
your-project/
├── profiles/
│   └── {userId}/
│       ├── nom: "LastName"
│       ├── prenom: "FirstName"
│       ├── numero: "PhoneNumber"
│       ├── userId: "user_uid"
│       ├── userEmail: "user@example.com"
│       ├── profileImage: "https://..."
│       └── updatedAt: "2025-11-12T..."
└── chats/
    └── groupChat/
        └── {messageId}/
            ├── text: "Message content"
            ├── userId: "user_uid"
            ├── userEmail: "user@example.com"
            ├── timestamp: 1234567890
            └── createdAt: "2025-11-12T..."
```

## Security

This app implements several security best practices:

- ✅ Environment variables for Firebase credentials
- ✅ `.env` file excluded from version control
- ✅ Password validation and strength requirements
- ✅ Secure text entry for passwords
- ✅ Input validation for all forms
- ✅ User authentication required for all features
- ✅ Profiles linked to authenticated users
- ✅ Firebase Security Rules (see FIREBASE_SETUP.md)

## Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Start on Android emulator/device
npm run ios        # Start on iOS simulator/device
npm run web        # Start web version
```

## Future Enhancements

- [ ] One-on-one private messaging
- [ ] Push notifications for new messages
- [ ] User online/offline status
- [ ] Typing indicators
- [ ] Message read receipts
- [ ] Delete and edit messages
- [ ] Image/file sharing in chat
- [ ] User search functionality
- [ ] Profile editing
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Unit and integration tests

## Troubleshooting

### Environment variables not loading

```bash
# Clear cache and restart
expo start -c
```

### Firebase initialization errors

1. Verify all credentials in `.env` are correct
2. Ensure Firebase services are enabled in the console
3. Check that your Firebase project is on the Blaze (pay-as-you-go) plan if using Storage

### Build errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/FirstReactNativeProject](https://github.com/yourusername/FirstReactNativeProject)

## Acknowledgments

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

---

**Built with ❤️ using React Native and Firebase**
