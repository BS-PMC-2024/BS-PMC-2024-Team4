import React, { useState } from 'react'
import { Modal,Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";
import auth from '../fbauth';
import api_url from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default  function LoginForm({navigation}) {
    const [click,setClick] = useState(false);
    const [email,setEmail]=  useState("");
    const [password,setPassword]=  useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState(""); 
    const handleLogin = async() => {
        const auth = getAuth();
        
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                try {
                  await AsyncStorage.setItem('userUid', user.uid);
                  const response = await axios.post(`${api_url}user/getUserDetails`, {'uid': user.uid})
                  if(response.status === 200){
                    await AsyncStorage.setItem("avatar", response.data['avatar']);
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
  
   
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome back!!</Text>
        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='EMAIL' value={email} onChangeText={setEmail} autoCorrect={false}
        autoCapitalize='none' keyboardType="email-address"  />
            <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
        </View>
        <View style={styles.rememberView}>
            <View style={styles.switch}>
                <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
                <Text style={styles.rememberText}>Remember me</Text>
            </View>
            <View>
              <Pressable onPress={() => setModalVisible(true)}>
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
        <Button
      title="Google Sign-In"
      />
      
                
        </View>

        <Text style={styles.footerText}>Don't Have Account?
          <Text style={styles.signup} onPress={() => {navigation.navigate("Register")}}>
            Sign Up 
          </Text>
        </Text>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Reset Password</Text>
            <Text style={styles.modalTextd}>Enter your account Email to reset your passsword:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your email"
              value={resetEmail}
              onChangeText={setResetEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handlePasswordReset}>
              <Text style={styles.textStyle}>Send Reset Email</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
        
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
    borderColor : "#80858a",
    borderWidth : 1,
    borderRadius: 7,
    color:"#6c6e70"
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
    fontSize : 15,
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    backgroundColor: "#769FCD",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold"
  },

  modalTextd: {
    marginBottom: 12,
    textAlign: "center",
    fontSize: 15
  },
  modalInput: {
    height: 40,
    width: 250,
    borderColor: "#80858a",
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#6c6e70"
  },
})