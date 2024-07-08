import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import styles from './styles';

const LostScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>LostScreen</Text>
        <Image source={require('./Images/dogs.jpg')} style={styles.logo}/>
        </View>
    );
}

export default LostScreen;