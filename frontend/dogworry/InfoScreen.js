import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';

// info page
const infoData = [
    { id: '1', title: 'Burn on the paws', description: 'Burn on the paws' },
    { id: '2', title: 'Jellyfish', description: 'Burn on the paws' },
    { id: '3', title: 'Vomiting', description: 'Burn on the paws' },
    { id: '4', title: 'Bite from another dog', description: 'Burn on the paws' }
  ];


const InfoScreen = () => {
    const ExpandableComponent = ({ title, description }) => {
        const [expanded, setExpanded] = useState(false);
        const toggleExpand = () => {
          setExpanded(!expanded);
        };
        return (
            <View style={styles.container}>
              {/* Title section */}
              <TouchableOpacity onPress={toggleExpand} style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </TouchableOpacity>
        
              {/* Description section (conditionally rendered based on 'expanded' state) */}
              {expanded && (
                <View style={styles.descriptionContainer}>
                  <Text>{description}</Text>
                </View>
              )}
            </View>
          );
        };
    return (
        <View style={styles.container}>
        <Text style={styles.screenTitle}>Doctor's Tips</Text>
        <FlatList data={infoData} 
            keyExtractor={item => item.id} renderItem={({ item }) => (
                //<View style={styles.container}>
                <View style={styles.listItem}>
                <ExpandableComponent
                  style={styles.listItemText}
                  title= {item.title}
                  description={item.description}
                />
              </View>               
            )}
        />
        </View>
    );
}
export default InfoScreen;
