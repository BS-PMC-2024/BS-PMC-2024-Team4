import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert,Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
//import * as Google from 'expo-auth-session/providers/google';
//import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
//import * as WebBrowser from 'expo-web-browser';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import auth from '../../fbauth'
import {api_url} from '../../config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirm] = useState('');
/*
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
      clientId: '721153684567-lsnpf6236ju6tvain1omub6st8gpefcg.apps.googleusercontent.com',
      redirectUri: makeRedirectUri({
        native: 'dogworry://redirect',
        useProxy: true,
      }),
      responseType: ResponseType.IdToken,
    });
    useEffect(() => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
  
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then((userCredential) => {
            const user = userCredential.user;
            Alert.alert('Successfully signed in as:', user.displayName);
          })
          .catch((error) => {
            console.error(error);
            Alert.alert('Failed to sign in:', error.message);
          });
      }
    }, [response]);
    
    const googleSignIn = async () => {
       try {
        console.log(response)
        if (response?.type === 'success') {
          const { id_token } = response.params;
    
          const credential = GoogleAuthProvider.credential(id_token);
          signInWithCredential(auth, credential)
            .then((userCredential) => {
              const user = userCredential.user;
              Alert.alert('Successfully signed in as:', user.displayName);
            })
            .catch((error) => {
              console.error(error);
              Alert.alert('Failed to sign in:', error.message);
            });
        }
        } catch (error) {
            console.error(error);
            Alert.alert('Failed to sign in:', error.message);
        }
    };*/
    
    const handleRegister = async () => {
      try {
        if(confirmPassword === password)
        {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          uid = await userCredential.user.uid;
          await AsyncStorage.setItem('userUid',uid);
          // Send UID to the backend
          await axios.post(`${api_url}user/saveUserDetails`, {'user_id': uid, 'email': email});
          Alert.alert('Successfully signed in');
        }
        else
        {
          Alert.alert("password has not confirmed");
        }
        
      } catch (err) {
        Alert.alert(err.message);
      }
    };
    //<Button title="Sign in with Google" onPress={googleSignIn} />

    return (
      
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Image
              source= {require("../../Images/dogs.jpg")}
              style={{ width: 100, height: 100, marginBottom: 20 }}
            />
            <Text style={styles.welcomeText}>welcome! register here</Text>
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
                autoCapitalize='none'
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                autoCapitalize='none'
                onChangeText={setConfirm}
                secureTextEntry
            />
            <Button title ="Sign in with e-mail and password" onPress={handleRegister} color={'blue'}/>
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
  welcomeText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'blue',
    fontSize: 20,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default RegisterScreen;



