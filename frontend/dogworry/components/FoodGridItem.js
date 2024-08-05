import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import styles_info from '../styles/info_styles';

    const images = {
            banana: require('../Images/Food/banana.jpg'),
            apple: require('../Images/Food/apple.jpg'),
            cucumber: require('../Images/Food/cucumber.jpg'),
            strawberries: require('../Images/Food/strawberries.jpg'),
            watermelon: require('../Images/Food/watermelon.jpg'),
            pear: require('../Images/Food/pear.jpg'),
            pineapple: require('../Images/Food/pineapple.jpg'),
            avocado: require('../Images/Food/avocado.jpg'),
            chocolate: require('../Images/Food/chocolate.jpg'),
            grapes: require('../Images/Food/grapes.jpg'),
            nuts: require('../Images/Food/nuts.jpg'),
            alcohol: require('../Images/Food/alcohol.jpg'),
            garlic: require('../Images/Food/garlic.jpg'),
        }

const FoodGridItem = ({ food }) => {
    
    const backgroundColor = food.status === 'bad' ? '#BE1600' : '#9DC183';
    //const imageSource = require('../Images/Food/banana.jpg');
    const imageSource = images[food.name];
    
    return (
        <View style={[styles_info.gridItem, {backgroundColor}]}>
            <Image source={imageSource} style={styles_info.image}/>
            <Text style={styles_info.itemText}>{food.name}</Text>
        </View>
    );
};

export default FoodGridItem;