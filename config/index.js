// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4yyMf21Mdm7FzIXCySC73lwgd8FhYLCs",
  authDomain: "reactnativeproject-6a009.firebaseapp.com",
  databaseURL: "https://reactnativeproject-6a009-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "reactnativeproject-6a009",
  storageBucket: "reactnativeproject-6a009.appspot.com",
  messagingSenderId: "718707030818",
  appId: "1:718707030818:web:1006eebe6339f3582b037b",
  measurementId: "G-ZB3TEZ3RVK"
};
// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export default firebase;
