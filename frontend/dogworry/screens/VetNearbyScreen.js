import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as Location from 'expo-location';
import api_url from '../config';

import styles_info from '../styles/vetNearby_styles';

const VetNearby = () => {
  const navigation = useNavigation();
  const [vets, setVets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      axios.get(`${api_url}info/getVets/`)
        .then(response => {
          const sortedVets = sortVetsByDistance(response.data, location.coords);
          setVets(sortedVets);
          setLoading(false);
        })
        .catch(error => {
          console.error('error fetching data', error);
          setLoading(false);
        });
    })();
  }, []);

  const sortVetsByDistance = (vets, userLocation) => {
    return vets.map(vet => {
      const distance = getDistanceFromLatLonInKm(
        userLocation.latitude, userLocation.longitude,
        parseFloat(vet.latitude), parseFloat(vet.longitude)
      );
      return { ...vet, distance };
    }).sort((a, b) => a.distance - b.distance);
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);//latitude difference
    const dLon = deg2rad(lon2 - lon1);//longitude difference
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const ExpandableVetComponent = ({ name, address,openingHours }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    return (
      <View style={styles_info.container}>
        <TouchableOpacity onPress={toggleExpand}>
          <Text style={styles_info.name}>{name}</Text>
        </TouchableOpacity>
        {expanded && (
          <View>
            <Text style={styles_info.detailsT}>Address:</Text>
            <Text style={styles_info.details}>{address}</Text>
            
            <Text style={styles_info.detailsT}>Opening hours:</Text>
            <Text style={styles_info.details}>{openingHours}</Text>
           
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles_info.screen}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles_info.screen}>
        <Text style={styles_info.error}>{error}</Text>
      </View>
    );
  }

  if (!vets) {
    return (
      <View style={styles_info.screen}>
        <Text style={styles_info.error}>Error fetching data</Text>
      </View>
    );
  }

  return (
    <View style={styles_info.screen}>
      <Text style={styles_info.screenTitle}>List of vets sorted by                   your current location:</Text>
      <FlatList
        data={vets}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ExpandableVetComponent 
            name={item.name} 
            address={item.address}
            openingHours={item.openingHours}
            
          />
        )}
        contentContainerStyle={styles_info.list}
      />
    </View>
  );
};



export default VetNearby;
