import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const User = () => {
    const [show, setShow] = useState(false);

    const showMenu = () => setShow(!show);

    const navigation = useNavigation();

    if (show === false) {
        return (
            <TouchableOpacity style={styles.userContainer} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                <Text style={styles.userText}>User Info</Text>
                <Ionicons name={"person-circle-outline"} size={30} color="#fff" />
            </TouchableOpacity>
        );
    }
    else {
        return (
            <Text></Text>
        )
    }
};
    

const styles = StyleSheet.create({
    userContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
      padding: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 5, 
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