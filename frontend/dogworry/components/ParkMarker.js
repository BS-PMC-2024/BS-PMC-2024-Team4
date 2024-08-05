import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import MapStyles from '../styles/MapStyles';

const ParkMarker = ({ park }) => {
    const [labelVisible, setLabelVisible] = useState(true);

    const handlePress = () => {
      setLabelVisible(!labelVisible);
    };
    return (

        <Marker coordinate={{
            latitude: park.latitude,
            longitude: park.longitude,
          }}
          onPress={handlePress}
          >
            {labelVisible && (
              <Callout tooltip>
                <View style={MapStyles.callout}>
                  <Text style={MapStyles.calloutName}>dogs park</Text>
                  <Text style={MapStyles.calloutName}>{park.name}</Text>
                  <Text style={MapStyles.calloutText}>{park.address}</Text>
                </View>
              </Callout>
            )}
          </Marker>
    );
};

export default ParkMarker;
    