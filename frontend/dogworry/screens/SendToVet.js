import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Keyboard, TouchableWithoutFeedback, Alert,ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api_url from '../config';
import sendToVet_styles from '../styles/sendToVet_styles';


const SendToVet = () => {
    const [subject, setSubject] = useState('general'); 
    const [message, setMessage] = useState('');
    const[uid, setUID] = useState(null);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const userUid = await AsyncStorage.getItem('userUid');
        const resp = await axios.post(`${api_url}user/getUserDetails`, {'uid': userUid});
        const data = resp.data;
        if(resp.status === 200){
            setUID(userUid);
            setLoading(false);
        }
        else
        Alert.alert(
            "We can't find who you are", 
            "Login or sign up to send question to vet, so we would know how to contact you",
            [{ text: "OK", onPress: () => {
                setLoading(false);
                navigation.goBack();
            }}]
        );
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!message.trim()) {
            Alert.alert(
                "Empty Field",
                "You can't send empty message!",
                [{ text: "ok" }]
            );
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(`${api_url}info/sendMessageToVet`, {
                user_id: uid,
                subject: subject,
                message: message,
            });
            if (response.status === 200) {
                Alert.alert(
                    "Question Submitted", 
                    "Thank you. Your question has been recorded in the system and will be answered by a vet in the coming days", // Custom message
                    [{ text: "OK", onPress: () => {
                        setLoading(false);
                        navigation.goBack();
                    }}]
                );
            } else {
                Alert.alert("Error", "Failed to submit question ");
                setLoading(false);
            }
        }   catch (error) {
            console.error('Error submitting question to vet:', error);
            alert('Failed to submit question');
        }
    };

    return (
        <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={sendToVet_styles.container}>
                    <Text style={sendToVet_styles.header}>Send a Message to Vets</Text>
                    <Text style={sendToVet_styles.label}>Subject:</Text>
                    <Picker
                        selectedValue={subject}
                        style={sendToVet_styles.picker}
                        onValueChange={(itemValue) => setSubject(itemValue)}
                    >
                        <Picker.Item label="General Inquiry" value="general" />
                        <Picker.Item label="Specific Question" value="specific" />
                        <Picker.Item label="Emergency" value="emergency" />
                        <Picker.Item label="Feedback" value="feedback" />
                    </Picker>
                    <Text style={sendToVet_styles.label}>Message:</Text>
                    <TextInput
                        style={sendToVet_styles.input}
                        multiline
                        numberOfLines={4}
                        onChangeText={setMessage}
                        value={message}
                        placeholder="Type your message here"
                    />
                    <Button title="Send Message" onPress={handleSubmit} />
                    <Button title="Dismiss" onPress={() => navigation.goBack()} />
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default SendToVet;
