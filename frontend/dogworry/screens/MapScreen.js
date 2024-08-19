import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Touchable, Dimensions, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, UrlTile, Circle  } from 'react-native-maps';
import * as Location from 'expo-location';
import ParkMarker from '../components/ParkMarker';
import RoadBlockIcon from '../components/RoadBlockIcon';
import MapStyles from '../styles/MapStyles';
import api_url from '../config';
import axios from 'axios';
import { WalkRoute, GetRoutes } from '../components/Routes';
import WaterMarker from '../components/WaterMarker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = () => {
  const [loading, setLoading] = useState(false);
  const [parks, setParks] = useState(null);
  const [waterSpots, setWaterSpots] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showParks, setShowParks] = useState(false);
  const [routeCoordinate, setRouteCoordinate] = useState(null);
  const [isTracking, setIsTracking] = useState(true); // State to manage location updates
  const mapRef = useRef(null);
  const [showWater, setShowWater] = useState(false);
  const [blockedAreas, setBlockedAreas] = useState(null);

  const fetchData = async() => {
    setLoading(true);
    try {
      const [parksResponse, temperaturesResponse, waterResponse, blockedResponse] = await Promise.all([
        axios.get(`${api_url}info/getParks/`),
        axios.get(`${api_url}temperature/token`),
        axios.get(`${api_url}info/getWaterSpots/`),
        axios.get(`${api_url}info/getBlockedAreas/`),
      ]);

      const parksData = parksResponse.data;
      const temperaturesData = temperaturesResponse.data;
      // Associate temperatures with parks
      const parksWithTemperatures = parksData.map((park, index) => ({
        ...park,
        temperature: temperaturesData[index] || 'N/A' // Handle case if there are fewer temperatures than parks
      }));
  
      setParks(parksWithTemperatures);
      setWaterSpots(waterResponse.data);
      setBlockedAreas(blockedResponse.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(true);
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoading(false);
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // Update every second
            distanceInterval: 1, // Update every meter
          },
          (newLocation) => {
            setLocation(newLocation);
            if (isTracking) {
              setLocation(newLocation);
            }
          }
        );

        setLoading(false);
        return () => {
          subscription.remove();
        };

      } catch (error) {
        setErrorMsg('Error fetching location');
      }

      })();
  },[]);

  const handleTouch = () => {
    setIsTracking(false);
    setTimeout(() => {
        setIsTracking(true);
    }, 10000); // Re-enable tracking after 10 seconds
  };

  const toggleParks = () => {
    if(!showParks)
      fetchData();
    setShowParks(prevState => !prevState);
  };

  const toggleWaterSpots = () => {
    if(!showWater)
      fetchData();
    setShowWater(prevState => !prevState);
  };

  // delete later 
  const circleCenter = {
    latitude: 31.255578, 
    longitude: 34.790095
  }
  const circleRadius = 1000;

  useEffect(() => {
    if (routeCoordinate && mapRef.current) {
      const middle = Math.floor(routeCoordinate.length/2)
      const region = {
        latitude: routeCoordinate[middle].latitude,
        longitude: routeCoordinate[middle].longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
      };
      mapRef.current.animateToRegion(region, 500);
    }
  }, [routeCoordinate]);

  if (!location) {
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
        <TouchableOpacity style={MapStyles.button} onPress={toggleWaterSpots}>
          <Text style={MapStyles.buttonText}>Water</Text>
        </TouchableOpacity>
      </View>
      

      <MapView
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude, 
          latitudeDelta: LATITUDE_DELTA, 
          longitudeDelta: LONGITUDE_DELTA,
        }}
        style={MapStyles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        ref={mapRef}
        onTouchStart={handleTouch}
      >
        
        <UrlTile
          urlTemplate="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=mmwdR1ETX0fPK2yovC5E"
          maximumZ={30}
          minimumZ={13}
        />

        {showParks && parks.map((park, index) => (
          <ParkMarker park={park} key={index}/>
        ))}

        {routeCoordinate && <WalkRoute coordinates={routeCoordinate}/> }
        {showWater && waterSpots.map((item, index) => (
          <WaterMarker item={item} key={index}/>
        ))}

        {blockedAreas && blockedAreas.map((area, index) => (
            <RoadBlockIcon item={area} key={index}/>
        ))                             
        }   
      </MapView>
      <GetRoutes currentCoordinates={[location.coords.latitude, location.coords.longitude]} setRoute={setRouteCoordinate}/>
    </View>
  );
};


export default MapScreen;