import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default auth;