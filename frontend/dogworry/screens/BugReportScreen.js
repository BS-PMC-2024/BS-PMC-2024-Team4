import React, { useState } from 'react';
import { View, Text, TextInput, Button, Keyboard, TouchableWithoutFeedback  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import report_styles from '../styles/report_styles';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const BugReportScreen = () => {
  const [screen, setScreen] = useState('info');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState('info');

  const handleSubmit = async () => {
    try {
      // await axios.post('YOUR_BACKEND_URL_HERE/reportBug', {
      //     screen,
      //     description
      // });
      alert('Bug report submitted successfully');
    } catch (error) {
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