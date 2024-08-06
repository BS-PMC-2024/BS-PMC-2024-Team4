import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Touchable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import ParkMarker from '../components/ParkMarker';
import MapStyles from '../styles/MapStyles';
import api_url from '../config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';

const MapScreen = () => {
  const [loading, setLoading] = useState(false);
  const [parks, setParks] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showParks, setShowParks] = useState(false);

  const fetchData = async() => {
    setLoading(true);
    try {
      // Fetch parks data
      const parksResponse = await axios.get(`${api_url}info/getParks/`);
      const parksData = parksResponse.data;

      // Fetch temperatures data
      const temperaturesResponse = await axios.get(`${api_url}temperature/token`);
      const temperaturesData = temperaturesResponse.data;
      console.log("temperaturesData:", temperaturesData);
      // Associate temperatures with parks
      const parksWithTemperatures = parksData.map((park, index) => ({
        ...park,
        temperature: temperaturesData[index] || 'N/A' // Handle case if there are fewer temperatures than parks
      }));
  
      setParks(parksWithTemperatures);
      setLoading(false);
      console.log("parks:", parksWithTemperatures);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
      setLoading(false);
   
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('here');
        if (status !== 'granted') {
          console.log('here 2');
          setLoading(false);
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

      } catch (error) {
        setErrorMsg('Error fetching location');
      }
      setLoading(false);
      })();
  },[]);

  const toggleParks = () => {
    setShowParks(prevState => !prevState);
  };

  if (loading) {
    return (
      <View style={MapStyles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <View style={MapStyles.container}>
      <View style={MapStyles.buttonContainer}>
        <TouchableOpacity style={MapStyles.button} onPress={toggleParks}>
          <Text style={MapStyles.buttonText}>Parks</Text>
        </TouchableOpacity>
      </View>
      

      <MapView
        initialRegion={{
        latitude: 31.2518,  
        longitude: 34.7913, 
        latitudeDelta: 0.0922, 
        longitudeDelta: 0.0421, 
      }}
        style={MapStyles.map}
        showsUserLocation={true}
      >
        {showParks && parks.map((park, index) => (
          <ParkMarker park={park} key={index}/>
        ))}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
          />
        )} 
      </MapView>
      {!location && !errorMsg && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};


export default MapScreen;