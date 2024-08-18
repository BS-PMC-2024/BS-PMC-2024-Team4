import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import report_styles from '../../styles/report_styles'
import { FlatList } from 'react-native-gesture-handler';
import api_url from '../../config'
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const Reports = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [blockedAreas, setBlockedAreas] = useState(null);
    const [selectedValue, setSelectedValue] = useState("java");
    const fetchData = async() => {
        setLoading(true);
        try {
            const [blockedResponse] = await Promise.all([
                axios.get(`${api_url}info/getBlockedAreas/`)
            ]);
            setBlockedAreas(blockedResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const renderRoadBlockedItem = ({ item }) => (
        <View style={report_styles.reportItem}>
            <Image
                source={require('../../Images/no_entry.jpg')} 
                    style={report_styles.icon} 
                />
            <View style={report_styles.reportDetails}>
                <Text style={report_styles.reportTitle}>Road Blocking: {item.address} </Text>
                <Text style={report_styles.reportDescription}>{item.handler}</Text>
                <Text style={report_styles.reportDescription}>{item.description}</Text>
            </View>
        </View>
    );
    return (
        <View style={report_styles.container}>
            <Text style={report_styles.screenTitle}>Report Us</Text>
            <View style={report_styles.buttonContainer}>               
                <TouchableOpacity style={report_styles.reportButton} onPress={() => navigation.navigate('ReportLostDog')}>
                    <Text style={report_styles.buttonText}>Lost my dog</Text>    
                </TouchableOpacity>
                <TouchableOpacity style={report_styles.reportButton} onPress={() => navigation.navigate('ProblamaticDog')}>
                    <Text style={report_styles.buttonText}>Problamatic Dog</Text>    
                </TouchableOpacity>
                <TouchableOpacity style={report_styles.reportButton} onPress={() => navigation.navigate('BugReport')}>
                    <Text style={report_styles.buttonText}>App bugs</Text>    
                </TouchableOpacity>
                <TouchableOpacity style={report_styles.reportButton} onPress={() => navigation.navigate('RoadReport')}>
                    <Text style={report_styles.buttonText}>Road hazard</Text>    
                </TouchableOpacity>
            </View>
            <View style={report_styles.reportListContainer}>
                {loading ? (
                    <View style={report_styles.container}>
                        <ActivityIndicator size="large" color="#0000ff"/>
                    </View>
                ) : (
                    <FlatList 
                        data={blockedAreas} 
                        renderItem={renderRoadBlockedItem} 
                        keyExtractor={(item, index) => index.toString()}
                    />
                )}
            </View>
        </View>
    );
};

export default Reports;
