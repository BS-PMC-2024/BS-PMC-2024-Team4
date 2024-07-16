import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


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
const auth = initializeAuth(app, {
persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default auth;