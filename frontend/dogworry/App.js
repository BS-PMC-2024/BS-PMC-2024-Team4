import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, Image, FlatList  } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from './screens/MapScreen';
import FoodScreen from './screens/FoodScreen';
import InfoScreen from './screens/InfoScreen';
import LostScreen from './screens/LostScreen';
import styles from './styles';
import User from './components/User';
import UserDetails from './screens/user/UserDetails';

// navigation of the app
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// header style
const getHeaderOptions = (title) => ({
  headerTitle: title,
  headerTitleAlign: 'center',
  headerTransparent: true,
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
    <Tab.Screen name= "Map"  component={MapScreen}  options={getHeaderOptions('Dog Worry')}/>
    <Tab.Screen name= "Food" component={FoodScreen} options={getHeaderOptions('Dog Worry')}/> 
    <Tab.Screen name= "Info" component={InfoScreen} options={getHeaderOptions('Dog Worry')}/>
  </Tab.Navigator> 
)

const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Tabs' component={TabNavigator} options={{headerShown: false }}/>
    </Stack.Navigator>
  )
}

const CustomProfileDrawer = (props) => {
  const {routeNames, index} = props.state;
  const focused = routeNames[index];
  
  return (
    <DrawerContentScrollView {...props}>
      <Text>Hello</Text>
      <DrawerItem 
        label="profile"
        onPress={() => props.navigation.navigate("User Details")}
        activeTintColor="blue"
        backBehavior={() => props.navigation.navigate("Main")}/>
    </DrawerContentScrollView>
  )
}


const ProfileDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName='Main' backBehavior='Main'
      drawerContent={props => <CustomProfileDrawer {...props} />} >
      <Drawer.Screen name = "Main" component={TabNavigator} options={{headerShown: false}}/>
      <Drawer.Screen name ="User Details" component={UserDetails} backBehavior={() => props.navigation.navigate("Main")}/>
    </Drawer.Navigator>
  )
}

// main screen
const HomeScreen = ({ navigation }) => {
  return(
    <UserDetails/>
  )
};

const MainNavigation = ({ navigation }) => {
  return (
    <NavigationContainer>
      <ProfileDrawer/>
      <User />
    </NavigationContainer>
  )
}

// app
export default function App() {
  return (
      <MainNavigation />
  );
}