import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { View, TextInput, Button, StyleSheet, Text, Alert,Image , TouchableOpacity} from 'react-native';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import auth from '../../fbauth'
import api_url from '../../config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
=======
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import auth from '../../fbauth'
import api_url from '../../config'
>>>>>>> Stashed changes

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
<<<<<<< Updated upstream
    const [confirmPassword, setConfirm] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const navigation = useNavigation();
=======

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
    };
>>>>>>> Stashed changes
    
    const handleRegister = async () => {
      try {
<<<<<<< Updated upstream
        if(confirmPassword === password)
        {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          uid = userCredential.user.uid;
          await AsyncStorage.setItem('userUid',uid);
          // Send UID to the backend
          await axios.post(`${api_url}/user/saveUserDetails`, {'user_id': uid, 'email': email});
          Alert.alert('Registered successfully!');
          navigation.navigate("Main");
        }
        else
        {
          Alert.alert("Passwords do not match");
        }
        
=======
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = await userCredential.user.uid;

        // Send UID to the backend
        await axios.post(`${api_url}user/saveUserDetails`, {'user_id': uid, 'email': email});
>>>>>>> Stashed changes
      } catch (err) {
        Alert.alert(err.message);
      }
    };

    const toggleTooltip = () => {
      setShowTooltip(prevState => !prevState);
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
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    autoCapitalize='none'
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    onPress={toggleTooltip}
                    style={styles.questionMarkContainer}
                >
                    <Text style={styles.questionMark}>?</Text>
                </TouchableOpacity>
            </View>
            {showTooltip && (
            <View style={styles.tooltipContainer}>
                 <View style={styles.tooltipBubble}>
                     <Text style={styles.tooltipText}>
                         Password must be at least 6 characters.
                     </Text>
                 </View>
                 <View style={styles.tooltipArrow} />
             </View>
            )}
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
      alignItems: 'center',
      padding: 16,
  },
  input: {
      height: 40,
      width: 250,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
  },
  inputWrapper: {
      position: 'relative',
      width: 250, // Ensures the password input and question mark are within the same container width
  },
  questionMarkContainer: {
      position: 'absolute',
      right: 10,
      top: 10,
  },
  questionMark: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'blue',
  },
  tooltipContainer: {
      position: 'absolute',
      bottom: 60, // Position the tooltip above the input field
      left: 0,
      right: 0,
      alignItems: 'center',
  },
  tooltipBubble: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      borderColor: 'gray',
      borderWidth: 1,
      elevation: 5, // Adds shadow for Android
      shadowColor: '#000', // Shadow properties for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      width: 250, // Ensure the tooltip matches the width of the input fields
  },
  tooltipText: {
      color: 'gray',
      textAlign: 'center',
  },
  tooltipArrow: {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'white',
      alignSelf: 'center',
      marginTop: -1,
  },
  welcomeText: {
      textTransform: 'uppercase',
      fontWeight: 'bold',
      color: 'blue',
      fontSize: 20,
      marginBottom: 20,
  },
});

<<<<<<< Updated upstream

export default RegisterScreen;



=======
export default RegisterScreen;
>>>>>>> Stashed changes
