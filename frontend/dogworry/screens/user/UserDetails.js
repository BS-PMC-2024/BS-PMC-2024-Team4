import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, TextInput, Alert, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import ImagePicker from '../../components/ImagePicker'
import styles from '../../styles';
import api_url from '../../config';

const UserDetails = () => {
    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            navigation.navigate("Main");
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
      );

    const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: async () => (await fetch(api_url + 'user/')).json()});
    const values = watch();
  
    const onSubmit = (data) => {
      console.log(data);
    }

    const onChangeField = useCallback(
      name => text => {
        setValue(name, text);
      },
      []
    );

    const checkEmail = (email) => {
        const re = new RegExp("[\\w\\-\\.]+@([\\w\\-]+\\.)[\\w]+")
        if (!re.test(email) && email !== "") {
            Alert.alert("Invalid Email", "Please enter a valid email address");
            setValue("email", "")
        }
    }

    const checkPhone = (e) => {
        const re = new RegExp("^[0-9]+$")
        const currNum = e.nativeEvent.text
        if(currNum === '' || re.test(currNum))
            setValue('phone_number', currNum)
    }

    const profileImage = async () => {
        const result = await ImagePicker()
        if(result && !result.canceled){
            console.log(result.assets[0])
            setValue('avatar', result.assets[0].uri);
        }
    }

    return (
        <View style={styles.container}>
            <View style={stylesIn.detailsContainer}>

                <TouchableOpacity style={stylesIn.imageContainer} onPress={profileImage}>
                    <Text>Profile Picture</Text>
                    {values.avatar ?
                    (<Image 
                        source={{ uri: values.avatar }}
                        style= {{ width: 100, height: 100, borderRadius: 100,}}/>)
                    :
                    (<Text>No Image</Text>)
                    }
                </TouchableOpacity>

                <View style={stylesIn.inputContainer}>
                    <Text>First Name</Text>
                    <TextInput 
                        style={stylesIn.input}
                        value={values.first_name}
                        onChangeText={onChangeField('first_name')}/>
                </View>

                <View style={stylesIn.inputContainer}>
                    <Text>Last Name</Text>
                    <TextInput 
                        style={stylesIn.input}
                        value={values.last_name}
                        onChangeText={onChangeField('last_name')}/>
                </View>
                
                <View style={stylesIn.inputContainer}>
                    <Text>Email</Text>
                    <TextInput
                        style={stylesIn.input}
                        value={values.email}
                        onChangeText={onChangeField('email')}
                        onBlur={() => checkEmail(values.email)}/>
                </View>
                
                <View style={stylesIn.inputContainer}>
                    <Text>Phone Number</Text>
                    <TextInput 
                        style={stylesIn.input}
                        keyboardType="numeric"
                        value={values.phone_number}
                        onChange={checkPhone}/>
                </View>

                <View style={stylesIn.inputContainer}>
                    <Button title="Save" onPress={handleSubmit(onSubmit)} />
                </View>
            </View>
        </View>
    )
}

export default UserDetails;

const stylesIn = StyleSheet.create({
    input: {
        height: 40,
        width: 150,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    inputContainer: {
        padding: 10,
    },
    imageContainer: {
        padding: 50,
    },
    detailsContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: 10,

    }
})