import React, { useEffect, useState /*userCallback*/ } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity /*Alert*/ } from 'react-native';
import styles from '../styles';
import styles_info from '../styles/info_styles';
// import { useForm } from 'react-hook-form';
import api_url from '../config';


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
                <View style={styles_info.descriptionContainer}>
                  <Text>{description}</Text>
                </View>
              )}
            </View>
          );
        };

    return (
        <View style={styles.screen}>
        <Text style={styles_info.screenTitle}>Doctor's Tips</Text>
        <FlatList data={infoData} 
            keyExtractor={item => item.id} renderItem={({ item }) => (
                //<View style={styles.container}>
                <View style={styles_info.listItem}>
                <ExpandableComponent
                  style={styles_info.listItemText}
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
