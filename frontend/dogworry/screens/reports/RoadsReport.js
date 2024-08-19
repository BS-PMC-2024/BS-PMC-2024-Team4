import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert   } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import report_styles from '../../styles/report_styles';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api_url from '../../config';
import { ScrollView } from 'react-native-gesture-handler';


const RoadsReport = () => {
    const[uid, setUID] = useState(null);
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);  
    const navigation = useNavigation();
    const [selectedValue, setSelectedValue] = useState('Pest control');
    
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
                "Description of the events must be enterd",
                [{ text: "ok" }]
            );
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(`${api_url}user/submitRoadsReport`, {
                user_id: uid,
                type: selectedValue,
                description: description,
                address: address,
            });
            if (response.status === 200) {
                Alert.alert(
                    "Report Submitted", 
                    "Thank you for your report. It has been sent to us and will be viewd in short moments.",
                    [{ text: "OK", onPress: () => {
                        setLoading(false);
                        navigation.goBack();
                    }}]
                );
            } else {
                Alert.alert("Error", "Failed to submit roads report");
                setLoading(false);
            }
        }   catch (error) {
            console.error('Error submitting roads report:', error);
            alert('Failed to submit bug report');
        }
    };
    
    // if (loading)
    //     return (
    //         <View style={report_styles.loading_container}>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //         </View>
    //     );
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={report_styles.scrollContainer}>
                <View style={report_styles.bugsContainer}>
                    <View style={report_styles.reportContainer_np}>
                        <Text style={report_styles.bugsScreenTitle}>Roads Reports</Text>
                        <Text style={report_styles.road_label}>Encountered works on the way? Saw municipal workers spraying the grass? This is the place to report any hazard or unusual sight you encounter on your ways</Text>
                        <View style={report_styles.pickerContainer}>
                            <Text style={report_styles.road_label}>Tell us what you saw:</Text>
                            <Picker
                                selectedValue={selectedValue}
                                style={report_styles.picker}
                                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                                >
                                <Picker.Item label="Pest control" value="pest_control" />
                                <Picker.Item label="Construction work" value="construction_work" />
                                <Picker.Item label="Blocked road" value="blocked_road" />
                                <Picker.Item label="Dog poisoning" value="dog_poisoning" />
                            </Picker>
                        </View>
                        <View style={report_styles.inputContainer}>
                            <Text style={report_styles.label}>Enter Address:</Text>
                            <TextInput
                                style={report_styles.address_input}
                                multiline={false}
                                value={address}
                                onChangeText={setAddress}
                            />
                            <Text style={report_styles.label}>Enter description:</Text>
                            <TextInput
                                style={report_styles.input}
                                multiline
                                numberOfLines={4}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>
                        <View style={report_styles.bugsButtonContainer}>
                            <Button title="Back" onPress={() => navigation.goBack()} />
                            <Button title="Submit" onPress={handleSubmit} /> 
                        </View>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

export default RoadsReport;