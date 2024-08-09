import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, Image, FlatList,Alert  } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MapScreen from './screens/MapScreen';
import FoodScreen from './screens/FoodScreen';
import InfoScreen from './screens/InfoScreen';
import VetNearby from './screens/VetNearbyScreen';
import LostScreen from './screens/LostScreen';
import RegisterScreen from './screens/user/guestRegistration';
import DogDetails from './screens/lostDogs/DogDetails';
import ReportLostDog from './screens/lostDogs/ReportLostDog';
import Reports from './screens/reports/Reports';
import styles from './styles';
import {User, ProfileLabel, MyDogsLabel} from './components/User';
import UserDetails from './screens/user/UserDetails';
import LoginScreen from './screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from './components/BackButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MyDogs from './screens/user/MyDogs';
import Svg from 'react-native-svg'
import axios from 'axios';

// navigation of the app
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const Title = ( {title} ) => {
  return (
    <View style={styles.headerTitleContainer}>
      <Image source={require('./assets/logo.png')} style={styles.logo}/>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  )
}
// header style
const getHeaderOptions = (title) => ({
  headerTitle: () => <Title title={title}/>,
  headerTitleAlign: 'center',
  headerTransparent: true,
});

// bottom tabs navigation
const TabNavigator = () => (
  <Tab.Navigator initialRouteName='Map' screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Reports') {
        iconName = focused ? 'report' : 'report-gmailerrorred';
      } else if (route.name === 'Lost Dogs') {
        iconName = focused ? 'paw' : 'paw-outline';
      } else if (route.name === 'Food') {
        iconName = focused ? 'nutrition' : 'nutrition-outline';
      } else if (route.name === 'Info') {
        iconName = focused ? 'help' : 'help-outline';
      } else if (route.name === 'Map'){ // from here
        iconName = focused ? 'compass' : 'compass-outline';
      }
      
      return route.name === 'Reports' ? 
            <MaterialIcons name={iconName} size={size} color={color} /> 
            : 
            <Ionicons name={iconName} size={size} color={color} />;
      },

      tabBarActiveTintColor: '#F44336',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        display: 'flex',
      },    
    })}>
    <Tab.Screen name= "Reports"   component={Reports}    options={getHeaderOptions('Dog Worry')}/>
    <Tab.Screen name= "Lost Dogs" component={DogDetails} options={getHeaderOptions('Dog Worry')}/> 
    <Tab.Screen name= "Map"       component={MapScreen}  options={getHeaderOptions('Dog Worry')}/>   
    <Tab.Screen name= "Food"      component={FoodScreen} options={getHeaderOptions('Dog Worry')}/> 
    <Tab.Screen name= "Info"      component={InfoScreen} options={getHeaderOptions('Dog Worry')}/>
    
  </Tab.Navigator>
)

// Adding only 1 instance of the User component to every screen in Tab Navigator
const TabNavigatorWithUser = () => (
    <View style={{ flex: 1 }}>
      <User />
      <TabNavigator />
    </View>
)

const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Back' component={TabNavigatorWithUser} options={{headerShown: false }}/>
      <Stack.Screen name='VetNearby' component={VetNearby} options={{ ...getHeaderOptions('Vet Nearby') }} />
    </Stack.Navigator>
  )
}


const CustomProfileDrawer = (props) => {
  const {routeNames, index} = props.state;
  const focused = routeNames[index];
  const [uid, setUid] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {userName, setName} = props
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userUid');
      const userNameAsync = await AsyncStorage.getItem('firstName');
      

      if (value !== null) {
        setUid(value);
        setIsLoggedIn(true);
        setName(userNameAsync);
      }
    } catch (error) {
      
      console.error("Failed to retrieve data", error);
    }
  };

  const logout = async () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "No",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userUid');
              await AsyncStorage.removeItem('avatar');
              setIsLoggedIn(false);
              props.navigation.reset(({
                index: 0,
                routes: [{name: "Main"}]
              }));
            } catch (error) {
              console.error("Failed to logout.", error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };
  
  useEffect(() => {
    retrieveData();
    
  });
  
  return (
    <DrawerContentScrollView {...props}>
      {isLoggedIn ? (
        <>
          <View style={styles.container}>
            <Image source={require('./assets/logo.png')} style={styles.logo}/>
            <Text style={styles.text}>Hello {userName}</Text>
          </View> 
          

          <DrawerItem 
            label={() => <ProfileLabel />}
            onPress={() => props.navigation.navigate("User Details")}
            activeTintColor="blue"
            backBehavior={() => props.navigation.navigate("Main")} />

          <DrawerItem 
            label={() => <MyDogsLabel />}
            onPress={() => props.navigation.navigate("My Dogs")}
            activeTintColor="blue"
            backBehavior={() => props.navigation.navigate("Main")} />

          <DrawerItem
            label="Logout" 
            onPress={logout}
            activeTintColor='#F44336' />
        </>
      ) : (
        <>
        <DrawerItem
          label="Login"
          onPress={() => props.navigation.navigate("Login")}
          activeTintColor='#F44336' />
        <DrawerItem
          label="Register"
          onPress={() => props.navigation.navigate("Register")}
          activeTintColor='#F44336' />
          <DrawerItem 
            label="Main"
            onPress={() => props.navigation.navigate("Main")}
            activeTintColor="blue"
            backBehavior={() => props.navigation.navigate("Main")} />
        </>
        
        
      )}
    </DrawerContentScrollView>
  );
}


const ProfileDrawer = () => {
  const [userName, setUserName] = useState('');
  return (
    <Drawer.Navigator initialRouteName='Main' backBehavior='Main'
      drawerContent={props => <CustomProfileDrawer {...props} userName={userName} setName={setUserName} />} >

      <Drawer.Screen  name = "Main" 
                      component={StackNavigation} 
                      options={{headerShown: false}}/>

      <Drawer.Screen  name="Login" 
                      component={LoginScreen}
                      options={{...getHeaderOptions("Login"), headerLeft:() => <BackButton/>, unmountOnBlur: true}} />

      <Drawer.Screen  name ="Register" 
                      component={RegisterScreen} 
                      backBehavior={() => props.navigation.navigate("Main")}
                      options={{...getHeaderOptions("Register"), headerLeft:() => <BackButton/>, unmountOnBlur: true}}/>

      <Drawer.Screen  name ="User Details" 
                      backBehavior={() => props.navigation.navigate("Main")}
                      options={{...getHeaderOptions("User Details"), unmountOnBlur: true}} >
                        {props => <UserDetails {...props} setName={setUserName}/> }
      </Drawer.Screen>

      <Drawer.Screen  name ="My Dogs"
                      component={MyDogs} 
                      backBehavior={() => props.navigation.navigate("Main")}
                      options={{...getHeaderOptions("My Dogs"), unmountOnBlur: true}}/>
      <Drawer.Screen  name ="ReportLostDog" 
                      component={ReportLostDog} 
                      backBehavior={() => props.navigation.navigate("Main")}
                      options={{...getHeaderOptions("ReportLostDog"), unmountOnBlur: true}}/>
      <Drawer.Screen  name ="Reports" 
                      component={Reports} 
                      backBehavior={() => props.navigation.navigate("Main")}
                      options={{...getHeaderOptions("Reports"), unmountOnBlur: true}}/>

    </Drawer.Navigator>
  )
}

// main navigation stack
const MainNavigation = ({ navigation }) => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" hidden={false} />
      <ProfileDrawer/>
    </NavigationContainer>
  )
}

// app
export default function App() {
  return (
      <MainNavigation />
  );
}