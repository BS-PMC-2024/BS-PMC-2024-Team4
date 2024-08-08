import React, { useState } from 'react'
import { Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View , TouchableOpacity } from 'react-native'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import auth from '../fbauth';
import api_url from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default  function LoginForm({navigation}) {
    const [click,setClick] = useState(false);
    const [email,setEmail]=  useState("");
    const [password,setPassword]=  useState(""); 
    const [showTooltip, setShowTooltip] = useState(false);
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

    const toggleTooltip = () => {
      setShowTooltip(prevState => !prevState); // Toggle the tooltip visibility
    };
   
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome back!!</Text>
        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='EMAIL' value={email} onChangeText={setEmail} autoCorrect={false}
        autoCapitalize='none' />
            <View style={styles.passwordContainer}>
                    <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
                            autoCapitalize='none'/>
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
                                Don`t remember your password? press Forgot Password`
                            </Text>
                        </View>
                        <View style={styles.tooltipArrow} />
                    </View>
                )}
            
        </View>
        <View style={styles.rememberView}>
            <View style={styles.switch}>
                <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
                <Text style={styles.rememberText}>Remember me</Text>
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
            <Text style={styles.optionsText}></Text>
        </View>

        <Text style={styles.footerText}>Don't Have Account?
          <Text style={styles.signup} onPress={() => {navigation.navigate("Register")}}>
            Sign Up 
          </Text>
        </Text>

        
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
  questionMarkContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  questionMark: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#769FCD',
  },
  tooltipContainer: {
      position: 'absolute',
      bottom: 60,
      left: 40,
      right: 40,
      alignItems: 'center',
  },
  tooltipBubble: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      borderColor: 'gray',
      borderWidth: 1,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      width: '100%',
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