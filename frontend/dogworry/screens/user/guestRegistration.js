import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text ,ALert} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
//import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { initializeApp, firebase } from "firebase/app";
import { getAuth , GoogleAuthProvider ,signInWithPopup } from "firebase/auth";
import {auth} from '../../fbauth';



const RegisterScreen = () => {
   const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const googleSignIn = async () => {
       try {
            /*
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    console.log(user);
                    alert('Successfully signed in as: ' + user.displayName);
                    window.googleSignIn = googleSignIn;
                })
                .catch((error) => {
                    console.error(error);
                    alert('Failed to sign in: ' + error.message);
                });*/
            
            const provider = new GoogleAuthProvider(app);
            console.log(provider)
            const response = await signInWithPopup(auth, provider);
            console.log(response)
            const user = auth.currentUser;
            console.log(user);
            Alert.alert('Successfully signed in as:', user.displayName);
        } catch (error) {
            console.error(error);
            Alert.alert('Failed to sign in:', error.message);
        }
    };
    
    const handleLogin = async () => {
      try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const idToken = await userCredential.user.getIdToken();
        // Send ID token to the backend
       //await axios.post('/app/user/routes', {'user_id'});
      } catch (err) {
        setError(err.message);
      }
    };
    

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Sign in with Google" onPress={googleSignIn} />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title ="Sign in with e-mail and password" onPress={handleLogin}/>
        </View>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default RegisterScreen;



