import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet ,Alert } from 'react-native';
//import { ColorPicker } from 'react-native-color-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import api_url from '../../config';
import * as Location from 'expo-location';


const ReportProblematicDog = () => {
    const [dogBreed, setDogBreed] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [color, setColor] = useState('');
    let [location , setLocation] = useState('');
    const navigation = useNavigation();
   
    const handleReport = async () => {
        location = await Location.getCurrentPositionAsync({});
        setLocation(setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }));
        try {
            const response = await axios.post(`${api_url}user/reportProblematicDog`, {
                'dog_breed' : dogBreed,
                'issue_description' : issueDescription,
                'dog_color': color,
                'latitude' : location.coords.latitude,
                'longitude' : location.coords.longitude
            });

            if (response.status === 200 && response.data.success) {
                Alert.alert('Success', response.data.message);
                navigation.navigate("Main");
            } else {
                Alert.alert('Error', response.data.error || 'Failed to report problematic dog');
            }
        } catch (error) {
            console.error('Error reporting problematic dog:', error);
            Alert.alert('Error', 'Failed to report problematic dog');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Dog Breed:</Text>
            <TextInput
                style={styles.input}
                value={dogBreed}
                onChangeText={setDogBreed}
                placeholder="Enter dog breed"
            />
            <Text style={styles.label}>Issue Description:</Text>
            <TextInput
                style={styles.input}
                value={issueDescription}
                onChangeText={setIssueDescription}
                placeholder="Describe the issue"
                multiline
            />
            <Text style={styles.label}>Color:</Text>
            <TextInput
                style={styles.input}
                value={color}
                onChangeText={setColor}
                placeholder="please enter color"
            />
            <Button title="Report Problematic Dog" onPress={handleReport} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f1e3',
    },
    label: {
        fontSize: 16,
        color: '#2d3436',
        marginBottom: 8,
        marginTop: 80,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
});

export default ReportProblematicDog;
