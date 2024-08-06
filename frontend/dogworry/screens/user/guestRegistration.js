import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert,Image } from 'react-native';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import auth from '../../fbauth'
import api_url from '../../config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirm] = useState('');
    
    const handleRegister = async () => {
      try {
        if(confirmPassword === password)
        {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          uid = userCredential.user.uid;
          await AsyncStorage.setItem('userUid',uid);
          // Send UID to the backend
          await axios.post(`${api_url}/user/saveUserDetails`, {'user_id': uid, 'email': email});
          Alert.alert('Registered successfully!');
          navigation.reset(({
            index: 0,
            routes: [{name: "Main"}]
          }));
        }
        else
        {
          Alert.alert("Passwords do not match");
        }
        
      } catch (err) {
        Alert.alert(err.message);
      }
    };

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



