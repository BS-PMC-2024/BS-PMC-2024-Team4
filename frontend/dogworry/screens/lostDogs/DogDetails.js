import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import api_url from "../../config"



const DogDetails = () => {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchDogs();
      }, []);
    
      const fetchDogs = async () => {
        try {
          const response = await axios.get(`${api_url}lostDog/getAllDogs/`);
          const dogs = response.data;
          setDogs(dogs);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching dog details:', error);
          setLoading(false);
        }
      };


    const renderItem = ({ item }) => (
        <View style={styles.card}>
        <Text style={styles.name}>{item.dog_name}</Text>
        {item.avatar ? (
            <Image source={require('../../Images/dogs.jpg')} style={styles.avatar} resizeMode='contain'/>
            ) : (
                <Image source={{ uri: item.avatar }} style={styles.avatar} resizeMode='contain' />
            )}
        <Text style={styles.lastSeen}>{`identifier: ${item.friendly ? 'Friendly and tamed' : 'Not friendly'}`}</Text>
        <Text style={styles.lastSeen}>{`Last area: ${item.lost_area}`}</Text>
        <Text style={styles.lastSeen}>{`Owner Phone: ${item.owner_phone}`}</Text>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleFoundDog(item._id)}>
                <Text style={styles.buttonText}>I found the dog</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>I've seen this dog</Text>
            </TouchableOpacity>
        </View>
    </View>
    
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }
    if (dogs.length === 0) {
        return (
            <View style={styles.noDogsContainer}>
            <Image source={require('../../Images/dogs.jpg')} style={styles.avatar} resizeMode='contain'/>
            <Text style={styles.noDogsText}>No dogs lost</Text>
        </View>
  
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={dogs}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f1e3',
        justifyContent: 'flex-start',
        paddingTop: 100,
    },
    noDogsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f1e3',
    },
    noDogsImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    noDogsText: {
        fontSize: 18,
        color: '#2d3436',
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: '#0002',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        width: '95%', // שינוי לרוחב של 95%
        alignSelf: 'center', // כדי למרכז את הכרטיס
        flexDirection: 'column',
        justifyContent: 'space-between'
    
        
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3436',
        alignSelf: 'center',
    },
    description: {
        fontSize: 16,
        color: '#636e72',
        marginVertical: 10,
    },
    lastSeen: {
        fontSize: 14,
        color: '#636e72',
        alignSelf: 'center',
    },
    avatar: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
        height: undefined, // מאפשר גובה יחסי
        aspectRatio: 1.5, 
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#55efc4',
        borderRadius: 5,
        padding: 10,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#2d3436',
        fontWeight: 'bold',
    },
});


export default DogDetails;





