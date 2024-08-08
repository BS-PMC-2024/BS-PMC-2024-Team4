import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import MapStyles from '../styles/MapStyles';

const WaterMarker = ({ item }) => {
    const [labelVisible, setLabelVisible] = useState(true);

    const handlePress = () => {
      setLabelVisible(!labelVisible);
    };
    return (

        <Marker coordinate={{
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }}
          onPress={handlePress}
          pinColor='blue'
          >
            <Callout tooltip>
              <View style={MapStyles.callout}>
                <Text style={MapStyles.calloutName}>water spot</Text>
              </View>
            </Callout>
          </Marker>
    );
};

export default WaterMarker;