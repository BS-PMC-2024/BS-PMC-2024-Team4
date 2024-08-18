// ReportLostDog.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import api_url from '../../config';
import { useNavigation } from '@react-navigation/native';

const ReportLostDog = () => {
    const [dogName, setDogName] = useState('');
    const [lostArea, setLostArea] = useState('');
    const [ownerPhone, setOwnerPhone] = useState('');
    const navigation = useNavigation();

    const handleReport = async () => {
        try {
            const response = await axios.post(`${api_url}lostDog/report`, {
                dog_name: dogName,
                lost_area: lostArea,
                owner_phone: ownerPhone,
            });
            if (response.status === 200) {
                Alert.alert('Success', 'Lost dog reported successfully');
                navigation.goBack(); // Go back to the previous screen
            }
        } catch (error) {
            console.error('Error reporting lost dog:', error);
            Alert.alert('Error', 'Failed to report lost dog');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Dog Name:</Text>
            <TextInput
                style={styles.input}
                value={dogName}
                onChangeText={setDogName}
                placeholder="Enter dog name"
            />
            <Text style={styles.label}>Lost Area:</Text>
            <TextInput
                style={styles.input}
                value={lostArea}
                onChangeText={setLostArea}
                placeholder="Enter lost area"
            />
            <Text style={styles.label}>Owner Phone:</Text>
            <TextInput
                style={styles.input}
                value={ownerPhone}
                onChangeText={setOwnerPhone}
                placeholder="Enter owner phone"
                keyboardType="phone-pad"
            />
            <Button title="Report Lost Dog" onPress={handleReport} />
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

export default ReportLostDog;
