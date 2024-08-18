import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapStyles from '../styles/MapStyles';
import DogParkSvg from '../assets/svgs/dog-park.svg';

const ParkMarker = ({ park }) => {
    const [labelVisible, setLabelVisible] = useState(true);

    const handlePress = () => {
      setLabelVisible(!labelVisible);
    };
    const traffic = park.traffic;
    const trafficColor = traffic === "Low" ? "green" : traffic === "Medium" ? "orange" : "red";
    return (
        <Marker 
          coordinate={{
              latitude: parseFloat(park.latitude),
              longitude: parseFloat(park.longitude),
              temperature: park.temperature,
          }} 
          onPress={handlePress} 
          pinColor='green'
        >
          <View style={MapStyles.markerContainer}>
            <DogParkSvg width={30} height={50}/>
          </View>
          <Callout tooltip>
              <View style={MapStyles.callout}>
                <Text style={MapStyles.calloutName}>dogs park</Text>
                <Text style={MapStyles.calloutName}>Park Name: {park.name}</Text>
                <Text style={MapStyles.calloutText}>Park Address: {park.address}</Text>
                <Text style={MapStyles.calloutText}>Park Traffic: <Text style={{color: trafficColor}}>{traffic}</Text></Text>
                <Text style={MapStyles.calloutText}>Pavement Temperature: {park.temperature}°C</Text>
              </View>
          </Callout>
        </Marker>
    );
};

export default ParkMarker;