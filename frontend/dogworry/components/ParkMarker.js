import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapStyles from '../styles/MapStyles';

const ParkMarker = ({ park }) => {
    const [labelVisible, setLabelVisible] = useState(true);
    //const [temperatures, setTemperatures] = useState([]);

    const handlePress = () => {
      setLabelVisible(!labelVisible);
    };

    return (
<<<<<<< HEAD
     
        <Marker coordinate={{
            latitude: park.latitude,
            longitude: park.longitude,
            temperature: park.temperature,
          }}
          onPress={handlePress}
          >
            {labelVisible && (
              <Callout tooltip>
                <View style={MapStyles.callout}>
                  <Text style={MapStyles.calloutName}>dogs park</Text>
                  <Text style={MapStyles.calloutName}>{park.name}</Text>
                  <Text style={MapStyles.calloutText}>{park.address}</Text>
                  <Text style={MapStyles.calloutText}> pavement temperature: {park.temperature}°C</Text>
                </View>
              </Callout>
            )}
          </Marker>

=======
        <Marker 
          coordinate={{
              latitude: parseFloat(park.latitude),
              longitude: parseFloat(park.longitude),
          }} 
          onPress={handlePress} 
          pinColor='green'
        >
          <Callout tooltip>
                  <View style={MapStyles.callout}>
                      <Text style={MapStyles.calloutName}>{park.name}</Text>
                      <Text style={MapStyles.calloutText}>{park.address}</Text>
                  </View>
          </Callout>
        </Marker>
>>>>>>> 52ab636007f42589cf4ac85b48be6118f188a126
    );
};

export default ParkMarker;
