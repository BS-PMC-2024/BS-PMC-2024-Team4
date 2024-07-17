import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, Image, FlatList,Alert  } from 'react-native';
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
import RegisterScreen from './screens/user/guestRegistration';
import DogDetails from './screens/lostDogs/DogDetails';
import styles from './styles';
import {User, ProfileLabel, MyDogsLabel} from './components/User';
import UserDetails from './screens/user/UserDetails';
import LoginScreen from './screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native-gesture-handler';
import MyDogs from './screens/user/MyDogs';

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
      else if (route.name === 'guestRegistration'){ // from here
        iconName = focused ? 'reg' : 'help-outline';
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
    <Tab.Screen name= "Lost" component={DogDetails} options={getHeaderOptions('Dog Worry')}/>    
    <Tab.Screen name= "Map"  component={MapScreen}  options={getHeaderOptions('Dog Worry')}/>
    <Tab.Screen name= "Food" component={FoodScreen} options={getHeaderOptions('Dog Worry')}/> 
    <Tab.Screen name= "Info" component={InfoScreen} options={getHeaderOptions('Dog Worry')}/>
    <Tab.Screen name= "regi" component={RegisterScreen} options={getHeaderOptions('Dog Worry')}/> 
    
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
      <Stack.Screen name='Tabs' component={TabNavigatorWithUser} options={{headerShown: false }}/>
    </Stack.Navigator>
  )
}


//Logout func


// Empty dependency array means this effect runs once on mount

const CustomProfileDrawer = (props) => {
  const {routeNames, index} = props.state;
  const focused = routeNames[index];
  const [uid, setUid] = useState("");
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userUid');
      if (value !== null) {
        setUid(value);
        setIsLoggedIn(true);
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
              setIsLoggedIn(false);
              props.navigation.navigate('Main');
            } catch (error) {
              console.error("Failed to logout.", error);
            }
          }
        }
      ],
      { cancelable: false }
    );
    try {
        await AsyncStorage.removeItem('userUid');
        if(await AsyncStorage.getItem('avatar'))
            await AsyncStorage.removeItem('avatar'); 

        setIsLoggedIn(false);
        props.navigation.navigate('Main');
    } catch (error) {
        console.error("Failed to logout.", error);
    }
  };
  
  useEffect(() => {
    retrieveData();
    
  });
  
  return (
    <DrawerContentScrollView {...props}>
      {isLoggedIn ? (
        <>
          <DrawerItem 
            label={() => <ProfileLabel />}
            onPress={() => props.navigation.navigate("User Details")}
            activeTintColor="blue"
            backBehavior={() => props.navigation.navigate("Main")}
          />

          <DrawerItem 
            label={() => <MyDogsLabel />}
            onPress={() => props.navigation.navigate("My Dogs")}
            activeTintColor="blue"
            backBehavior={() => props.navigation.navigate("Main")}
          />

          <DrawerItem
            label="Logout"
            onPress={logout}
            activeTintColor='#F44336'
          />
        </>
      ) : (
        <DrawerItem
          label="Login"
          onPress={() => props.navigation.navigate("Login")}
          activeTintColor='#F44336'
        />
      )}
    </DrawerContentScrollView>
  );
}


const ProfileDrawer = () => {

  const [uid, setUid] = useState("");

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userUid');
      if (value !== null) {
        setUid(value);
      }
    } catch (error) {
      console.error("Failed to retrieve data", error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);
   
  return (
    <Drawer.Navigator initialRouteName='Main' backBehavior='Main'
      drawerContent={props => <CustomProfileDrawer {...props} />} >
      <Drawer.Screen name = "Main" component={StackNavigation} options={{headerShown: false, unmountOnBlur: true}}/>
      <Drawer.Screen name ="User Details" component={UserDetails} backBehavior={() => props.navigation.navigate("Main")}
                     options={{unmountOnBlur: true}} />
      <Drawer.Screen name="Login" component={LoginScreen}/>
      <Drawer.Screen name ="My Dogs" component={MyDogs} backBehavior={() => props.navigation.navigate("Main")}
                     options={{unmountOnBlur: true}}/>
    </Drawer.Navigator>
  )
}

// main screen
const HomeScreen = ({ navigation }) => {
  return(
    <View style={styles.container}>
      <Text>Home</Text>
      
    </View>
  )
};

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