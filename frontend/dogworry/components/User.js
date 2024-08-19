import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

export const User = ( props ) => {
    const [show, setShow] = useState(false);
    const { avatar, setAvatar } = props

    const navigation = useNavigation();

    useEffect(() => {
      const fetchAvatar = async () => {
          try {
              let storedAvatar = await AsyncStorage.getItem('avatar');
              if (storedAvatar) {
                  setAvatar(storedAvatar);
                  setShow(true);
              } else {
                  setShow(false);
              }
          } catch (e) {
              console.log("Error loading avatar", e);
          }
      };

      fetchAvatar();
  }, []);

  useEffect(() => {
      if (avatar) {
          setShow(true);
      } else {
          setShow(false);
      }
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