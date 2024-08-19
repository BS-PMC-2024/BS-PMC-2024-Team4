<<<<<<< Updated upstream
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
=======
import { initializeApp, firebase } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
>>>>>>> Stashed changes
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: `${process.env.EXPO_PUBLIC_FIRE_API_KEY}`,
    authDomain: `${process.env.EXPO_PUBLIC_FIRE_AUTH_KEY}`,
    projectId: `${process.env.EXPO_PUBLIC_FIRE_PROJECT_ID}`,
    storageBucket: `${process.env.EXPO_PUBLIC_FIRE_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.EXPO_PUBLIC_FIRE_MSG_SENDER_ID}`,
    appId: `${process.env.EXPO_PUBLIC_FIRE_APP_ID}`,
    measurementId: `${process.env.EXPO_PUBLIC_FIRE_MEASURE_ID}`
};

<<<<<<< Updated upstream
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

=======
const firebaseConfig = {
    apiKey: "AIzaSyB_1pOPoNsQBnlKyTFGba14ueBr0Nh2-1E",
    authDomain: "dogworry-37217.firebaseapp.com",
    projectId: "dogworry-37217",
    storageBucket: "dogworry-37217.appspot.com",
    messagingSenderId: "299204859408",
    appId: "1:299204859408:web:973262899c4750a3835c95",
    measurementId: "G-9ZT6DYQJE6"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

>>>>>>> Stashed changes
export default auth;