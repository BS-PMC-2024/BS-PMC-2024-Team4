import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Alert  } from 'react-native';
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
import SendToVet from './screens/SendToVet';
import RegisterScreen from './screens/user/guestRegistration';
import DogDetails from './screens/lostDogs/DogDetails';
import ReportLostDog from './screens/reports/ReportLostDog';
import Reports from './screens/reports/Reports';
import styles from './styles';
import { User, ProfileLabel, MyDogsLabel } from './components/User';
import UserDetails from './screens/user/UserDetails';
import LoginScreen from './screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from './components/BackButton';
import MyDogs from './screens/user/MyDogs';
import BugReportScreen from './screens/reports/BugReport';
import RoadsReport from './screens/reports/RoadsReport';
import ProblematicDog from './screens/reports/ProblematicDog';


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
      } else if (route.name === 'Map'){ 
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
    <Tab.Screen name="Reports" component={ReportStack} options={getHeaderOptions('Dog Worry')} />
    <Tab.Screen name= "Lost Dogs" component={DogDetails} options={getHeaderOptions('Dog Worry')}/> 
    <Tab.Screen name= "Map"       component={MapScreen}  options={getHeaderOptions('Dog Worry')}/>   
    <Tab.Screen name= "Food"      component={FoodScreen} options={getHeaderOptions('Dog Worry')}/> 
    <Tab.Screen name= "Info"      component={InfoStack} options={getHeaderOptions('Dog Worry')}/>
    
  </Tab.Navigator>
)

// Adding only 1 instance of the User component to every screen in Tab Navigator
const TabNavigatorWithUser = ({ avatar, setAvatar }) => (
    <View style={{ flex: 1 }}>
      <User avatar={avatar} setAvatar={setAvatar}/>
      <TabNavigator />
    </View>
)

const StackNavigation = ({ avatar, setAvatar }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Back' options={{headerShown: false }}>
        {props => <TabNavigatorWithUser {...props} avatar={avatar} setAvatar={setAvatar} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

const CustomProfileDrawer = (props) => {
  const {routeNames, index} = props.state;
  const focused = routeNames[index];
  const [uid, setUid] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {userName, setName, setAvatar} = props
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userUid');
      const userNameAsync = await AsyncStorage.getItem('firstName');

      if (value !== null) {
        setUid(value);
        setIsLoggedIn(true);
        if(userNameAsync)
          setName(userNameAsync);
        else
          setName("User");
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
              await AsyncStorage.removeItem('firstName');
              setAvatar(null);
              setName("");
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
};

// Reports tab and all screens available inside it 
const ReportStack = () => (
  <Stack.Navigator screenOptions={{
    cardStyle: { backgroundColor: 'white' },
    }}>
    <Stack.Screen name="ReportsMain" component={Reports} options={{headerLeft: () => null,}}/>
    <Stack.Screen name="BugReport" component={BugReportScreen} options={{headerLeft: () => null,}}/>
    <Stack.Screen name="RoadReport" component={RoadsReport} options={{headerLeft: () => null,}}/>
    <Stack.Screen name="ProblematicDog" component={ProblematicDog} options={{headerLeft: () => null,}}/>
    <Stack.Screen name="ReportLostDog" component={ReportLostDog} options={{headerLeft: () => null,}}/>
  </Stack.Navigator>
);

const InfoStack = () => (
  <Stack.Navigator screenOptions={{
    cardStyle: { backgroundColor: 'white' },
    }}>
    <Stack.Screen name="InfoMain" component={InfoScreen} options={{headerLeft: () => null,}}/>
    <Stack.Screen name='VetNearby' component={VetNearby} options={{headerLeft: () => null,}} />
    <Stack.Screen name='SendVet' component={SendToVet} options={{headerLeft: () => null,}} />
    
  </Stack.Navigator>
)

const ProfileDrawer = () => {
  const [userName, setUserName] = useState('');
  const [avatar, setAvatar] = useState(null);
  return (
    <Drawer.Navigator initialRouteName='Main' backBehavior='Main'
      drawerContent={props => <CustomProfileDrawer {...props} userName={userName} setName={setUserName} setAvatar={setAvatar} />} >

      <Drawer.Screen  name = "Main" 
                      options={{headerShown: false}}>
                        {props => <StackNavigation {...props} avatar={avatar} setAvatar={setAvatar}  />}
      </Drawer.Screen>

      <Drawer.Screen  name="Login" 
                      options={{...getHeaderOptions("Login"), headerLeft:() => <BackButton/>, unmountOnBlur: true}} >
                        {props => <LoginScreen {...props} setAvatar={setAvatar} setName={setUserName} />}
      </Drawer.Screen>

      <Drawer.Screen  name ="Register" 
                      component={RegisterScreen} 
                      backBehavior={() => props.navigation.navigate("Main")}
                      options={{...getHeaderOptions("Register"), headerLeft:() => <BackButton/>, unmountOnBlur: true}}/>

      <Drawer.Screen  name ="User Details" 
                      backBehavior={() => props.navigation.navigate("Main")}
                      options={{...getHeaderOptions("User Details"), unmountOnBlur: true}} >
                        {props => <UserDetails {...props} setName={setUserName} setAvatar={setAvatar}/> }
      </Drawer.Screen>

      <Drawer.Screen  name ="My Dogs"
                      component={MyDogs} 
                      backBehavior={() => props.navigation.navigate("Main")}
                      options={{...getHeaderOptions("My Dogs"), unmountOnBlur: true}}/>

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