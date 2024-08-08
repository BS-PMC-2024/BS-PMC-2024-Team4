import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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

    carrot: require('../Images/Food/carrot.jpg'),
    blueberries: require('../Images/Food/blueberries.jpg'),
    sweet_potato: require('../Images/Food/sweet potato.jpg'), 
    rice: require('../Images/Food/rice.jpg'),
    peanut_butter: require('../Images/Food/peanut butter.jpg'),
    onion: require('../Images/Food/onion.jpg'),
    caffeine: require('../Images/Food/caffeine.jpg'),
    tomato: require('../Images/Food/tomato.jpg'),
    dairy : require('../Images/Food/dairy.jpg'),
    pumpkin: require('../Images/Food/pumpkin.jpg'),
}

const FoodGridItem = ({ food }) => {   
    const backgroundColor = food.status === 'bad' ? '#BE1600' : '#9DC183';
    
    // convert food name to underscored version
    const getUnderscoredName = (name) => {
        return name.split(' ').join('_');
    };

    const underscoredName = food.name.includes(' ') ? getUnderscoredName(food.name) : food.name;
    const imageSource = images[underscoredName];

    return (
        <View style={[styles_info.gridItem, {backgroundColor}]}>
            <Image source={imageSource} style={styles_info.image}/>
            <Text style={styles_info.itemText}>{food.name}</Text>
        </View>
    );
};

export default FoodGridItem;