import React, { useEffect, useState } from 'react';
import MapView, { Circle, Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapStyles from '../styles/MapStyles';


const RoadBlockIcon = ({ item, index }) => {
    return (
        <React.Fragment key={index}>
           <Marker
                coordinate={{ 
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude)
                }}
                >
                <Image
                    source={require('../Images/no_entry.jpg')} 
                    style={MapStyles.icon} 
                />
                <Callout>
                    <View style={MapStyles.calloutContainer}>
                        <Text style={MapStyles.calloutText}>{item.description}</Text>
                    </View>
                </Callout>
            </Marker>
        </React.Fragment>
    );
};

export default RoadBlockIcon;