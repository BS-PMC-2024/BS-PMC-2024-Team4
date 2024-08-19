import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert   } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import report_styles from '../../styles/report_styles';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api_url from '../../config';

const BugReportScreen = () => {
    const [description, setDescription] = useState('');
    const navigation = useNavigation();
    const [selectedValue, setSelectedValue] = useState('info');
    const[uid, setUID] = useState(null);
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
            "Login or sign up to submit a report, so we would know how to contact you",
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
        if (!description.trim()) {
            Alert.alert(
                "Empty Field",
                "Description of the bug must be entered",
                [{ text: "ok" }]
            );
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(`${api_url}user/submitBugsReport`, {
                user_id: uid,
                screen: selectedValue,
                description: description,
            });
            if (response.status === 200) {
                Alert.alert(
                    "Report Submitted", 
                    "Thank you. Your report has been recorded in the system and will be evaluated in the coming days", // Custom message
                    [{ text: "OK", onPress: () => {
                        setLoading(false);
                        navigation.goBack();
                    }}]
                );
            } else {
                Alert.alert("Error", "Failed to submit bug report");
                setLoading(false);
            }
        }   catch (error) {
            console.error('Error submitting bug report:', error);
            alert('Failed to submit bug report');
        }
    }; 
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={report_styles.bugsContainer}>
            <View style={report_styles.reportContainer}>
                <Text style={report_styles.bugsScreenTitle}>Report a Bug in the App</Text>
                <View style={report_styles.pickerContainer}>
                    <Text style={report_styles.label}>Select the screen you were on:</Text>
                    <Picker
                        selectedValue={selectedValue}
                        style={report_styles.picker}
                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                        >
                        <Picker.Item label="Info" value="info" />
                        <Picker.Item label="Food" value="food" />
                        <Picker.Item label="Map" value="map" />
                        <Picker.Item label="Lost Dogs" value="lost_dogs" />
                        <Picker.Item label="Reports" value="reports" />
                    </Picker>
                </View>
                <View style={report_styles.inputContainer}>
                    <Text style={report_styles.label}>Enter bug description:</Text>
                    <TextInput
                        style={report_styles.input}
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                        accessibilityLabel="Enter bug description"
                    />
                </View>
                <View style={report_styles.bugsButtonContainer}>
                    <Button title="Back" onPress={() => navigation.goBack()} />
                    <Button title="Submit" onPress={handleSubmit} /> 
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>
  );
};

export default BugReportScreen;