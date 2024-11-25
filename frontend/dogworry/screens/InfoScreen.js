import React, { useEffect, useState /*userCallback*/ } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, /*Alert*/ 
ActivityIndicator} from 'react-native';
import styles from '../styles';
import styles_info from '../styles/info_styles';
// import { useForm } from 'react-hook-form';
import api_url from '../config';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


// info page
const InfoScreen = () => {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
      axios.get(`${api_url}info/getHealthCases/`)
        .then(response => {
          setData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('error fetching data', error);
          setLoading(false);
        });
    }, []);

    const ExpandableComponent = ({ title, description }) => {
      const [expanded, setExpanded] = useState(false);
      const toggleExpand = () => {
        setExpanded(!expanded);
      };
      return (
        <View style={styles_info.container}>
          <TouchableOpacity onPress={toggleExpand} style={styles_info.caseContainer}>
            <Text style={styles_info.caseText}>{title}</Text>
          </TouchableOpacity>      
          {expanded && (
          <View style={styles_info.descriptionContainer}>
            <Text>{description}</Text>
          </View>
          )}
        </View>
      );
    };
    
    const renderFooter = () => {
      return (
        <View>
          <TouchableOpacity
            style={styles_info.findVetButton}
            onPress={() => navigation.navigate('VetNearby')}
            >
            <Text style={styles_info.findVetButtonText}>Looking for a vet immediately? Click here!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles_info.findVetButton}
            onPress={() => navigation.navigate('SendVet')}
            >
            <Text style={styles_info.findVetButtonText}>Send a question to a vet</Text>
          </TouchableOpacity>
        </View>
        
      );
    };

    if (loading) {
      return (
        <View style={styles.screen}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      );
    }

    if (!data) {
      return (
        <View style={styles.screen}>
          <Text style={styles_info.error}>Error fetching data</Text>
        </View>
      );
    }

    return (

        <View style={styles_info.screen}>
          <Text style={styles_info.screenTitle}>Doctor's Tips</Text>
          <Text style={styles_info.subTitle}>find usefull information for first aid treatment</Text>
          <FlatList data={data} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => (
            <ExpandableComponent title={item.case} description={item.guidelines}/>
          )}
          
          contentContainerStyle={styles_info.list}
          
          ListFooterComponent={renderFooter} 
          />
          {/* <TouchableOpacity style={styles_info.findVetButton} onPress={()=>navigation.navigate('VetNearby')}>

            
          <Text style={styles_info.findVetButtonText}>Find Vet Nearby</Text>
        </TouchableOpacity> */}
        </View>

    );

}


export default InfoScreen;