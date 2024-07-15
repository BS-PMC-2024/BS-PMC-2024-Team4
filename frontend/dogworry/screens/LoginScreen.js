import React, { useState } from 'react'
import { Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
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


export default function LoginForm({navigation}) {
    console.log(navigation);
    const [click,setClick] = useState(false);
    const {email,setEmail}=  useState("");
    const {password,setPassword}=  useState("");
    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    const handleLogin = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // Navigate to home screen or show success message
                Alert.alert("Login Successful", `Welcome ${user.email}`);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // Handle errors here, such as displaying a notification to the user
                Alert.alert("Login Failed", errorMessage);
            });
    };
    //$$$$$$$$$$$$$$$$$$$$
  return (
    <SafeAreaView style={styles.container}>
        
        
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='EMAIL' value={email} onChangeText={setEmail} autoCorrect={false}
        autoCapitalize='none' />
            <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
        </View>
        <View style={styles.rememberView}>
            <View style={styles.switch}>
                <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
                <Text style={styles.rememberText}>Remember Me</Text>
            </View>
            <View>
                <Pressable onPress={() => Alert.alert("Forget Password!")}>
                    <Text style={styles.forgetText}>Forgot Password?</Text>
                </Pressable>
            </View>
        </View>

        <View style={styles.buttonView}>
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </Pressable>
            <Text style={styles.optionsText}>OR LOGIN WITH</Text>
        </View>
        
        <View style={styles.mediaIcons}>
                <Image source='./Images/google.png' style={styles.icons}   />
                
        </View>

        <Text style={styles.footerText}>Don't Have Account?<Text style={styles.signup} > Sign Up </Text></Text>

        
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container : {
    alignItems : "center",
    paddingTop: 70,
  },
  image : {
    height : 160,
    width : 170
  },
  title : {
    fontSize : 30,
    fontWeight : "bold",
    textTransform : "uppercase",
    textAlign: "center",
    paddingVertical : 40,
    color : "#769FCD"
  },
  inputView : {
    gap : 15,
    width : "100%",
    paddingHorizontal : 40,
    marginBottom  :5
  },
  input : {
    height : 50,
    paddingHorizontal : 20,
    borderColor : "#D6E6F2",
    borderWidth : 1,
    borderRadius: 7
  },
  rememberView : {
    width : "100%",
    paddingHorizontal : 50,
    justifyContent: "space-between",
    alignItems : "center",
    flexDirection : "row",
    marginBottom : 8
  },
  switch :{
    flexDirection : "row",
    gap : 1,
    justifyContent : "center",
    alignItems : "center"
    
  },
  rememberText : {
    fontSize: 13
  },
  forgetText : {
    fontSize : 11,
    color : "#769FCD"
  },
  button : {
    backgroundColor : "#769FCD",
    height : 45,
    borderColor : "gray",
    borderWidth  : 1,
    borderRadius : 5,
    alignItems : "center",
    justifyContent : "center"
  },
  buttonText : {
    color : "white"  ,
    fontSize: 18,
    fontWeight : "bold"
  }, 
  buttonView :{
    width :"100%",
    paddingHorizontal : 50
  },
  optionsText : {
    textAlign : "center",
    paddingVertical : 10,
    color : "gray",
    fontSize : 13,
    marginBottom : 6
  },
  mediaIcons : {
    flexDirection : "row",
    gap : 15,
    alignItems: "center",
    justifyContent : "center",
    marginBottom : 23
  },
  icons : {
    width : 40,
    height: 40,
  },
  footerText : {
    textAlign: "center",
    color : "gray",
  },
  signup : {
    color : "#769FCD",
    fontSize : 13
  }
})