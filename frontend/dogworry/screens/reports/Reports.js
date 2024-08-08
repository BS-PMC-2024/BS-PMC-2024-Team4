import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Reports = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Button
                title="Report Lost Dog"
                onPress={() => navigation.navigate('ReportLostDog')}
            />
            <Button
                title="Report Problamatic Dog"
                onPress={() => navigation.navigate('ProblamaticDog')}
            />
            {/* Add more buttons as needed */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Reports;
