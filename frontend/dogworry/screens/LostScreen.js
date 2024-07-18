import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import DogDetails from './lostDogs/DogDetails'; 

const LostScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text1}>Lost Dogs</Text>
            <DogDetails />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20, 
        backgroundColor: '#f7f1e3',
    },
    text1: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10, 
        textAlign: 'center', 
        color: '#2d3436', 
    },
    logo: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
});

export default LostScreen;





