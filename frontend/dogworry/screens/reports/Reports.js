import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import report_styles from '../../styles/report_styles'
import { FlatList } from 'react-native-gesture-handler';

const Reports = () => {
    const navigation = useNavigation();
    const reports = [
        { id: 1, type: 'type1', title: 'Report 1', description: 'This is the first report.' },
        { id: 2, type: 'type2', title: 'Report 2', description: 'This is the second report.' },
        { id: 3, type: 'type3', title: 'Report 3', description: 'This is the third report.' },
        { id: 4, type: 'type1', title: 'Report 4', description: 'This is the fourth report.' },
        { id: 5, type: 'type2', title: 'Report 5', description: 'This is the fifth report.' },
    ];
    const renderItem = ({ item }) => (
        <View style={report_styles.reportItem}>
            <View style={report_styles.reportDetails}>
                <Text style={report_styles.reportTitle}>{item.title}</Text>
                <Text style={report_styles.reportDescription}>{item.description}</Text>
            </View>
        </View>
    )
    return (
        <View style={report_styles.container}>
            <Text style={report_styles.screenTitle}>Report us</Text>
            <View style={report_styles.buttonContainer}>               
                <TouchableOpacity style={report_styles.reportButton} onPress={() => navigation.navigate('ReportLostDog')}>
                    <Text style={report_styles.buttonText}>Lost a dog</Text>    
                </TouchableOpacity>
                <TouchableOpacity style={report_styles.reportButton} onPress={() => navigation.navigate('ProblamaticDog')}>
                    <Text style={report_styles.buttonText}>Problamatic Dog</Text>    
                </TouchableOpacity>
                <TouchableOpacity style={report_styles.reportButton}>
                    <Text style={report_styles.buttonText}>App bugs</Text>    
                </TouchableOpacity>
                <TouchableOpacity style={report_styles.reportButton}>
                    <Text style={report_styles.buttonText}>Road hazard</Text>    
                </TouchableOpacity>
            </View>
            <View style={report_styles.reportListContainer}>
                <FlatList
                    data={reports}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </View>
    );
};

export default Reports;
