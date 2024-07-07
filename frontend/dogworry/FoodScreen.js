import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, ActivityIndicator } from 'react-native';
import styles from './styles';


// food page
const foodData = [
    { id: '1', title: 'Apple' },
    { id: '2', title: 'Avocado' },
    { id: '3', title: 'Cucamber' },
    { id: '4', title: 'Carrot' }
  ];

const FoodScreen = () => {
    return (
        <View style={styles.container}>
        <FlatList data={foodData} 
            keyExtractor={item => item.id} renderItem={({ item }) => (
                <View style={styles.listItem}>
                <Text style={styles.listItemText}>{item.title}</Text>
                </View>
            )}
        />
        </View>
    );
}

export default FoodScreen;