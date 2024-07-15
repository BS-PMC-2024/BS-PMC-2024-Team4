import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import api_url from '../config';
import axios from 'axios';

const Drawer = createDrawerNavigator();

const User = () => {
    const [show, setShow] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const uid = "lmqhbH1slQUG4vEEMkGW9GYBUjI3";

    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            if (avatar === null) {
                const response = await axios.post(`${api_url}user/getUserDetails/`, {"uid": uid});
                const data = response.data;

                setAvatar(data.avatar);
                setShow(true)
            }
        };
        fetchData();
    }, [avatar]);

    //<Ionicons name={"person-circle-outline"} size={30} color="#fff" />

    return (
        <TouchableOpacity style={styles.userContainer} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Image  source={show && avatar ? {uri: `data:image/jpeg;base64,${avatar}`} : require('../Images/profile-icon.jpg')} 
                    style={{width: 100, height: 100, borderRadius: 100, resizeMode: 'cover',}} />
        </TouchableOpacity>
    );

};
    

const styles = StyleSheet.create({
    userContainer: {
      position: 'absolute',
      top: 25,
      right: 5,
      transform: [{scale: 0.7}],
      shadowColor: 'black',
      elevation: 10,
      borderRadius: 100,
      zIndex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    userText: {
      color: '#fff',
      fontSize: 16,
      marginRight: 5,
    },
  });

export default User;