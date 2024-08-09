import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import api_url from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'react-hook-form';

const Drawer = createDrawerNavigator();

export const User = () => {
    const [show, setShow] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [userName, setUserName] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            if (avatar === null) {
              try{
                const value = await AsyncStorage.getItem("avatar");
                const uid = await AsyncStorage.getItem('userUid');
               
                //const data = resp.data;
                //console.log("User first_name:", data.first_name);
                if(value !== null) {
                  setAvatar(value);
                  //setUserName(storedUserName);
                  //setUserName(firstName)
                  setShow(true);
                  
              }
            }
              catch(e){
                console.log("Error loading avatars for users", e);
              }
            }
        };
        fetchData();
    }, [avatar]);


    return (
        <TouchableOpacity style={styles.userContainer} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Image  source={show && avatar ? {uri: `data:image/jpeg;base64,${avatar}`} : require('../Images/profile-icon.jpg')} 
                    style={{width: 100, height: 100, borderRadius: 100, resizeMode: 'cover',}} />
        </TouchableOpacity>
    );

};

    
export const ProfileLabel = () => {
  return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome6 name="id-card" size={24} />
          <Text style={{paddingLeft: 10, fontSize: 20}}>Profile</Text>
      </View>
  )
}

export const MyDogsLabel = () => {
  return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons name="dog" size={24} color="black" />
          <Text style={{paddingLeft: 10, fontSize: 20}}>My Dogs</Text>
      </View>
  )
}

export const ColorPicker = () => {
  [color, setColor]
}

const styles = StyleSheet.create({
    userContainer: {
      position: 'absolute',
      top: 25,
      right: 5,
      transform: [{scale: 0.7}],
      elevation: 10,
      borderRadius: 100,
      zIndex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 3 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 3, 
    },
    userText: {
      color: '#fff',
      fontSize: 16,
      marginRight: 5,
    },
  });