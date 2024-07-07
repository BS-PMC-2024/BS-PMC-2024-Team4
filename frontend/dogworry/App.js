import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, Image, FlatList  } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from './MapScreen';
import FoodScreen from './FoodScreen';
import InfoScreen from './InfoScreen';
import LostScreen from './LostScreen';
import styles from './styles';

// landing screen
const LandingScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Tabs'); // Navigate to Main Tab Navigator
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>DW</Text>
      <Image source={require('./Images/dogs.jpg')} style={styles.logo}/>
      <Text style={styles.text}>Dog Worry</Text>
    </View>
  );
};


// navigation of the app
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// header style
const getHeaderOptions = (title) => ({
  headerTitle: title,
  headerTitleAlign: 'left',
});

// bottom tabs navigation
const TabNavigator = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Lost') {
        iconName = focused ? 'paw' : 'paw-outline';
      } else if (route.name === 'Map') {
        iconName = focused ? 'location' : 'location-outline';
      } else if (route.name === 'Food') {
        iconName = focused ? 'nutrition' : 'nutrition-outline';
      } else if (route.name === 'Info') {
        iconName = focused ? 'help' : 'help-outline';
      }
      
      return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#F44336',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        display: 'flex',
      },    
    })}>  
    <Tab.Screen name= "Home" component={HomeScreen} options={getHeaderOptions('Dog Worry')}/>
    <Tab.Screen name= "Lost" component={LostScreen} options={getHeaderOptions('Dog Worry')}/>    
    <Tab.Screen name= "Map" component={MapScreen} options={getHeaderOptions('Dog Worry')}/>
    <Tab.Screen name= "Food" component={FoodScreen} options={getHeaderOptions('Dog Worry')}/> 
    <Tab.Screen name= "Info"component={InfoScreen} options={getHeaderOptions('Dog Worry')}/>
  </Tab.Navigator> 
)

// main screen
const HomeScreen = ({ navigation }) => {
  return;
};


// app
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" hidden={false} />
      <Stack.Navigator initialRouteName='Landing'>
        <Stack.Screen name='Landing' component={LandingScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Tabs' component={TabNavigator} options={{headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

