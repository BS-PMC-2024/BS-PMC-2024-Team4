import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity, TextInput, Alert, BackHandler, Keyboard } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import ImagePicker from '../../components/ImagePicker';
import styles from '../../styles/UserDetailsStyles';
import api_url from '../../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../../components/BackButton';

const UserDetails = ( { setName } ) => {
    const navigation = useNavigation();
    const [disableSave, setdisableSaveSave] = useState(false);
    const [data, setData] = useState(null);
    const [uid, setUID] = useState(null);
    const [loading, setLoading] = useState(true);
    const { reset, handleSubmit, setValue, watch } = useForm({ defaultValues: data });
    const [isEditing, setIsEditing] = useState(false);
    const values = watch();
    const [userName, setUserName] = useState('');


    if (Keyboard.isVisible() !== disableSave)
        setdisableSaveSave(Keyboard.isVisible());

    const fetchData = async () => {
        const userUid = await AsyncStorage.getItem('userUid');
        const resp = await axios.post(`${api_url}user/getUserDetails`, {'uid': userUid});
        const data = resp.data;
            
        await AsyncStorage.setItem("firstName", data.first_name);

                    
        if(resp.status === 200){
            setUID(userUid);
            setData(data);
            setUserName(data.first_name);
            setLoading(false);
        }
        else
            Alert.alert("User Details", data.error)
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            reset(data);
        }
    }, [data, reset]);

    const onSubmit = async (data) => {
        data.user_id = uid;
        const response = await axios.post(`${api_url}user/saveUserDetails`, data);

        if (response.data.success) {
            try{
            await AsyncStorage.setItem("avatar", data.avatar);
            if(data.first_name) {
                setName(data.first_name);
                await AsyncStorage.setItem("firstName", data.first_name);
            }
            Alert.alert("Personal Details", "Personal details saved successfully");
            setIsEditing(false);
            }
            catch{
                Alert.alert("Personal Details", "There was a problem saving your details please try again.");
            }
        }
        else
            Alert.alert("Personal Details", response.data.error);
    };

    const onChangeField = useCallback(
        name => text => {
            setValue(name, text);
        },
        []
    );

    const checkEmail = (email) => {
        const re = new RegExp("[\\w\\-\\.]+@([\\w\\-]+\\.)[\\w]+");
        if (!re.test(email) && email !== "" && email !== undefined) {
            Alert.alert("Invalid Email", "Please enter a valid email address");
            setValue("email", "");
        }
    };

    const checkPhone = (e) => {
        const re = new RegExp("^[0-9]+$");
        const currNum = e.nativeEvent.text;
        if (currNum === '' || re.test(currNum))
            setValue('phone_number', currNum);
    };

    const profileImage = async () => {
        const result = await ImagePicker({
            allowdEditing: true,
            base64: true,
        });
        if (result && !result.canceled) {
            setValue('avatar', result.assets[0].base64);
        }
    };

    if (loading)
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" testID="loading" />
            </View>
        );

    return (
        <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
            <View style={styles.detailsContainer}>
                <TouchableOpacity style={styles.imageContainer} onPress={profileImage} disabled={!isEditing}>
                    <Text>Profile Picture</Text>
                    <Image
                        source={values.avatar ? { uri: `data:image/jpeg;base64,${values.avatar}` } : require("../../Images/profile-icon.jpg")}
                        style={styles.profileImage} />
                    
                </TouchableOpacity>

                <View style={styles.inputRow}>
                    <View style={styles.inputContainerName}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={[styles.input, isEditing ? styles.inputEnabled : styles.inputDisabled]}
                            value={values.first_name}
                            onChangeText={onChangeField('first_name')}
                            editable={isEditing} />
                    </View>

                    <View style={styles.inputContainerName}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={[styles.input, isEditing ? styles.inputEnabled : styles.inputDisabled]}
                            value={values.last_name}
                            onChangeText={onChangeField('last_name')}
                            editable={isEditing} />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, isEditing ? styles.inputEnabled : styles.inputDisabled]}
                        value={values.email}
                        onChangeText={onChangeField('email')}
                        onBlur={() => checkEmail(values.email)}
                        editable={isEditing} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={[styles.input, isEditing ? styles.inputEnabled : styles.inputDisabled]}
                        keyboardType="numeric"
                        value={values.phone_number}
                        onChange={checkPhone}
                        editable={isEditing} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={isEditing ? handleSubmit(onSubmit) : () => setIsEditing(true)}
                    >
                        <Text style={styles.buttonText}>{isEditing ? 'Save Details' : 'Edit Details'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.homeIconContainer}>

            </View>

            <BackButton />
        </View>
    );
};

export default UserDetails;
