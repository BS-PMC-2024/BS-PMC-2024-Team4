import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, Platform } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { WalkRoute, GetRoutes } from '../components/Routes';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoordinate, setRouteCoordinate] = useState(null);
  const [isTracking, setIsTracking] = useState(true); // State to manage location updates
  const mapRef = useRef(null); // Create a reference to the MapView
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Monitor location change
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (newLocation) => {
          if (isTracking) {
            setLocation(newLocation);
          }
        }
      );

      return () => {
        subscription.remove();
      };
    })();
  }, [isTracking]);

  
  const handleTouch = () => {
      setIsTracking(false);
      setTimeout(() => {
          setIsTracking(true);
      }, 10000); // Re-enable tracking after 10 seconds
  };

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

  if (!location)
    return (
      <Text>Loading...</Text>
    )
  return (
    <View style={styles.container}>
        <MapView
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          style={styles.map}
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
          {routeCoordinate && <WalkRoute coordinates={routeCoordinate}/> }
        </MapView>

        <GetRoutes currentCoordinates={[location.coords.latitude, location.coords.longitude]} setRoute={setRouteCoordinate}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapScreen;
