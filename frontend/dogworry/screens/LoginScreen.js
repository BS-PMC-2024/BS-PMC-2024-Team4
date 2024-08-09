import React, { useState } from 'react'
import { Modal,Alert, Button, Image, Pressable, SafeAreaView, styles_infoheet, Switch, Text, TextInput, View , TouchableOpacity } from 'react-native'
import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";
import auth from '../fbauth';
import api_url from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles_info from '../styles/Login_styles';


export default  function LoginForm({ navigation, setAvatar, setName }) {
    const [click,setClick] = useState(false);
    const [email,setEmail]=  useState("");
    const [password,setPassword]=  useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState(""); 
    const [showTooltip, setShowTooltip] = useState(false);
    const handleLogin = async() => {
        const auth = getAuth();
        
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                try {
                  await AsyncStorage.setItem('userUid', user.uid);
                  const response = await axios.post(`${api_url}user/getUserDetails`, {'uid': user.uid});
                  if(response.status === 200){
                    setAvatar(response.data['avatar']);
                    if(response.data['first_name'])
                      setName(response.data['first_name'])
                  }
                  Alert.alert("Login Successful", `Welcome ${user.email}`);
                  navigation.navigate('Main'); 
                } catch (error) {
                  Alert.alert("Storage Error", "Failed to save UID to local storage.");
                }
                
            })
            .catch((error) => {
                const errorMessage = error.message;
                Alert.alert("Login Failed", errorMessage);
            });
    };

    const handlePasswordReset = () => {
      if (!resetEmail) {
        Alert.alert("Reset Password", "Please enter your email address.");
        return;
      }
  
      sendPasswordResetEmail(auth, resetEmail)
        .then(() => {
          Alert.alert("Reset Password", "A password reset email has been sent to your email address.");
          setModalVisible(false); // Close the modal after sending the email
        })
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert("Error", errorMessage);
        });
    };
  

    const toggleTooltip = () => {
      setShowTooltip(prevState => !prevState); // Toggle the tooltip visibility
    };
   
  return (
    <SafeAreaView style={styles_info.container}>
        <Text style={styles_info.title}>Welcome back!!</Text>
        <View style={styles_info.inputView}>
            <TextInput style={styles_info.input} placeholder='EMAIL' value={email} onChangeText={setEmail} autoCorrect={false}
        autoCapitalize='none' keyboardType="email-address"  />
            <View style={styles_info.passwordContainer}>
                    <TextInput style={styles_info.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
                            autoCapitalize='none'/>
                    <TouchableOpacity
                        onPress={toggleTooltip}
                        style={styles_info.questionMarkContainer}
                    >
                        <Text style={styles_info.questionMark}>?</Text>
                    </TouchableOpacity>
                </View>
                {showTooltip && (
                    <View style={styles_info.tooltipContainer}>
                        <View style={styles_info.tooltipBubble}>
                            <Text style={styles_info.tooltipText}>
                                Don`t remember your password? press Forgot Password`
                            </Text>
                        </View>
                        <View style={styles_info.tooltipArrow} />
                    </View>
                )}
            
        </View>
        <View style={styles_info.rememberView}>
            <View style={styles_info.switch}>
                <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
                <Text style={styles_info.rememberText}>Remember me</Text>
            </View>
            <View>
              <Pressable onPress={() => setModalVisible(true)}>
                <Text style={styles_info.forgetText}>Forgot Password?</Text>
              </Pressable>
            </View>
        </View>

        <View style={styles_info.buttonView}>
            <Pressable style={styles_info.button} onPress={handleLogin}>
                <Text style={styles_info.buttonText}>LOGIN</Text>
            </Pressable>
            <Text style={styles_info.optionsText}></Text>
        </View>

        <Text style={styles_info.footerText}>Don't Have Account?
          <Text style={styles_info.signup} onPress={() => {navigation.navigate("Register")}}>
            Sign Up 
          </Text>
        </Text>
        
        
        <Image
        source={require('../Images/charli.png')} // replace with your image path
        style={styles_info.image}
      />
        
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles_info.centeredView}>
          <View style={styles_info.modalView}>
            <Text style={styles_info.modalText}>Reset Password</Text>
            <Text style={styles_info.modalTextd}>Enter your account Email to reset your passsword:</Text>
            <TextInput
              style={styles_info.modalInput}
              placeholder="Enter your email"
              value={resetEmail}
              onChangeText={setResetEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Pressable
              style={[styles_info.button, styles_info.buttonClose]}
              onPress={handlePasswordReset}>
              <Text style={styles_info.textStyle}>Send Reset Email</Text>
            </Pressable>
            <Pressable
              style={[styles_info.button, styles_info.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles_info.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
        
    </SafeAreaView>
  )
}


