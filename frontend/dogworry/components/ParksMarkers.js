import React from 'react';
import MapView, { Marker } from 'react-native-maps';

const ParksMarkers = () => {
    const testMarker = {
        latitude: 31.24949, 
        longitude: 34.79055,
    };

    return (
        <Marker coordinate={testMarker}
        title= "park location"
        description='test element'
        />
    )
};

export default ParksMarkers;
    