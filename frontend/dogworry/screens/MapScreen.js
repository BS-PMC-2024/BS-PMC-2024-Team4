// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import MapView from 'react-native-maps';
// import api_url from '../config';

// const MapScreen = () => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);

//   const fetchData = async () => {
//     try {
//         // change to you ip
//       const response = await fetch(api_url + 'getmaps');
//       if (!response.ok) {
//         throw new Error('Network error');
//       }
//       const json = await response.json();
//       setData(json);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <MapView
//         initialRegion={{
//           latitude: 37.78825,
//           longitude: -122.4324,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//         style={styles.map}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default MapScreen;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
<<<<<<< HEAD
import MapView, { Marker, Callout } from 'react-native-maps';
import api_url from '../config';

const MapScreen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch data from API
      const response = await fetch(api_url + 'getmaps');
      if (!response.ok) {
        throw new Error('Network error');
      }
      const json = await response.json();
      // Assume json is an array of { latitude, longitude, name, temperature }
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
=======
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import ParksMarkers from '../components/ParksMarkers';
import api_url from '../config';

const MapScreen = () => {
  const [loading, setLoading] = useState(false);
  //const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
>>>>>>> 31ca41973e3e5e1b76058cbb523bacfefb6b0b7f

  useEffect(() => {
    setLoading(true);
    (async () => {
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
      setLoading(false);
    })();
  },[]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
<<<<<<< HEAD
          latitude: 31.2518,  // Be'er Sheva latitude
          longitude: 34.7913, // Be'er Sheva longitude
          latitudeDelta: 0.0922, // Adjust the latitudeDelta to zoom in or out
          longitudeDelta: 0.0421, // Adjust the longitudeDelta to zoom in or out
        }}
        style={styles.map}
      >
        {data.map((park, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: park.latitude,
              longitude: park.longitude,
            }}
            title={park.name}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text>{park.name}</Text>
                <Text>Temperature: {park.temperature}°C</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
=======
        latitude: 31.2518,  
        longitude: 34.7913, 
        latitudeDelta: 0.0922, 
        longitudeDelta: 0.0421, 
      }}
        style={styles.map}
        showsUserLocation={true}
      >
        <ParksMarkers/>
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
>>>>>>> 31ca41973e3e5e1b76058cbb523bacfefb6b0b7f
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
  calloutContainer: {
    width: 150,
    padding: 5,
  },
});

export default MapScreen;
