import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Keyboard } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BackButton = ( props ) => {
    const navigation = useNavigation();
    const { backPressNavigate, backButtonNavigate } = props;

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.navigate(backPressNavigate ? backPressNavigate : "Main");
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );

    const goBackHandler = () => {
        navigation.navigate(backButtonNavigate ? backButtonNavigate : "Main");
    }

    return (
        <View style={{flex: 1, flexDirection:'column', position:'absolute', bottom:10, left:10, transform:"scale(1.1)"}}>
            <TouchableOpacity onPress={goBackHandler} style={{flex: 1, flexDirection: 'row-reverse',}}>
                <Text>Go Back</Text>
                <MaterialCommunityIcons name="keyboard-return" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default BackButton;