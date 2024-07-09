import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setloading] = useState(true)

  // FOR TESTING //
  const fetchData = async () =>
  {
    try {
      // Change the ip
      const response = await fetch('http:// 10.0.22631.3737:5000/getmaps');
      if(!response.ok){
        throw new Error('network error');
      }
      const json = await response.json();
      setData(json)
    }
    catch (error){
      setData(error)
    } finally {
      setloading(false);
    }
  }

  if (loading) {
    return(
      <View style={styles.container}>
        <Text>press the button</Text>
        <Button title="click me" onPress={fetchData}/>
        <StatusBar style="auto" />
      </View>
    )
  }
  else{
    return(
      <View>
        <Text>{data['message']}</Text>
        <MapView initialRegion={{
                              latitude: 37.78825,
                              longitude: -122.4324,
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421,
                            }} style={styles.map} />
      </View>
    )
  }
  // FOR TESTING //

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
