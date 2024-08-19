import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useForm } from 'react-hook-form';
import { getAuth, updateEmail } from "firebase/auth";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../../components/BackButton';
import styles from '../../styles/UserDetailsStyles';
import ImagePicker from '../../components/ImagePicker';
import api_url from '../../config';

const UserDetails = ({ setName, setAvatar }) => {
    const [data, setData] = useState(null);
    const [uid, setUID] = useState(null);
    const [loading, setLoading] = useState(true);
    const { reset, handleSubmit, setValue, watch } = useForm({ defaultValues: data });
    const [isEditing, setIsEditing] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const values = watch();
    const auth = getAuth();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const fetchData = async () => {
        const userUid = await AsyncStorage.getItem('userUid');
        const resp = await axios.post(`${api_url}user/getUserDetails`, { 'uid': userUid });
        const data = resp.data;

        if (data.first_name)
            await AsyncStorage.setItem("firstName", data.first_name);

        if (resp.status === 200) {
            setUID(userUid);
            setData(data);
            setLoading(false);
        } else {
            Alert.alert("User Details", data.error);
        }
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
            try {
                await AsyncStorage.setItem("avatar", data.avatar);
                setAvatar(data.avatar);
                if (data.first_name) {
                    setName(data.first_name);
                    await AsyncStorage.setItem("firstName", data.first_name);
                }
                
                // If email is being changed, trigger the verification process
                if (data.email && data.email !== auth.currentUser.email) {
                    await updateEmail(auth.currentUser, data.email);
                }

                Alert.alert("Personal Details", "Personal details saved successfully.");

                setIsEditing(false);
            } catch {
                Alert.alert("Personal Details", "There was a problem saving your details. Please try again.");
            }
        } else {
            Alert.alert("Personal Details", response.data.error);
        }
    };

    const onChangeField = useCallback(
        name => text => {
            setValue(name, text);
        },
        [setValue]
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
        if (currNum === '' || re.test(currNum)) {
            setValue('phone_number', currNum);
        }
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

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" testID="loading" />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
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

                <BackButton />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default UserDetails;
