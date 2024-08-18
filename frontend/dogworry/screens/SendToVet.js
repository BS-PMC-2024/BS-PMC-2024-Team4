import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SendToVet = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
  },
  text: {
    fontSize: 24, 
    color: '#000', 
  },
});

export default SendToVet;
