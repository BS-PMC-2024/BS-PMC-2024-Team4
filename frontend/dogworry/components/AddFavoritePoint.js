import React, { useEffect, useState } from 'react';
import { View, Modal, Text, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api_url from '../config';
import { dogImages } from '../styles/MyDogsStyles';
import FavoriteStyle from '../styles/FavoriteStyles';

const AddFavoritePoint = ({ pointID, openModal, setOpenModal, parkName }) => {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allDogsLiked, setAllDogsLiked] = useState(false);
    const [hasDogs, setHasDogs] = useState(false);

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const data = await AsyncStorage.getItem('userDogs');
                if (data) {
                    const dogsList = JSON.parse(data);
                    setDogs(dogsList);
                    if(dogsList.length > 0)
                        setHasDogs(true);

                    // Calculate whether all dogs have this point as a favorite
                    const allLiked = dogsList.every(dog => isFavorite(dog, pointID));
                    setAllDogsLiked(allLiked);
                }
            } catch (error) {
                console.error("Error fetching user dogs from storage", error);
            }
        };

        fetchDogs();
    }, [pointID]); // Add pointID to dependencies to update when the park changes

    const toggleFavorite = async (dog) => {
        if (loading) return; // Prevent further clicks while a request is in progress

        setLoading(true);

        try {
            let response;

            if (isFavorite(dog, pointID)) {
                // Remove favorite point
                response = await axios.post(`${api_url}user/removeFavoritePoint`, {
                    user_id: dog.user_id,
                    dog_name: dog.dog_name,
                    pointID: pointID,
                });

                if (response.data.success) {
                    Alert.alert("Success", `${parkName} removed from ${dog.dog_name}'s favorites.`);
                } else {
                    Alert.alert("Error", response.data.error || "Failed to remove point of interest.");
                }
            } else {
                // Add favorite point
                response = await axios.post(`${api_url}user/addFavoritePoint`, {
                    user_id: dog.user_id,
                    dog_name: dog.dog_name,
                    pointID: pointID,
                });

                if (response.data.success) {
                    Alert.alert("Success", `${parkName} added to ${dog.dog_name}'s favorites.`);
                } else {
                    Alert.alert("Error", response.data.error || "Failed to add point of interest.");
                }
            }

            const newDogData = await axios.post(`${api_url}user/getUserDogs`, {
                uid: dog.user_id
            });

            if (newDogData.status === 200) {
                await AsyncStorage.setItem("userDogs", JSON.stringify(newDogData.data));
                setDogs(newDogData.data);

                const allLiked = newDogData.data.every(d => isFavorite(d, pointID));
                setAllDogsLiked(allLiked);
            }

        } catch (error) {
            Alert.alert("Error", "An error occurred while updating the favorite point.");
        } finally {
            setLoading(false); // Allow further clicks once the request is finished
        }
    };

    const isFavorite = (dog, pointID) => {
        return dog.favorite_points && dog.favorite_points.includes(pointID);
    };

    const handleClose = () => {
        setOpenModal(false);
    }

    return (
        hasDogs &&
        <View style={FavoriteStyle.heartContainer}>
            <TouchableOpacity onPress={() => setOpenModal(true)}>
                <AntDesign name={allDogsLiked ? "heart" : "hearto"}
                           size={24} 
                           color={allDogsLiked ? "red" : "black"} />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={openModal}
                onRequestClose={handleClose}
            >
                {openModal &&
                <View style={FavoriteStyle.modalOverlay}>
                    <View style={FavoriteStyle.modalContent}>
                        <Text style={FavoriteStyle.modalTitle}>Add {parkName} to favorites</Text>
                        <Text style={FavoriteStyle.modalSubtitle}>Tap the heart to add/remove the park from a dog's favorites</Text>
                        <FlatList
                            data={dogs}
                            keyExtractor={(item) => item.dog_name}
                            renderItem={({ item }) => (
                                <View style={FavoriteStyle.dogItem}>
                                    <Image style={FavoriteStyle.dogImage} source={item.no_image ? dogImages[item.dog_image] : { uri: `data:image/jpeg;base64,${item.dog_image}` }} />
                                    <Text style={FavoriteStyle.dogName}>{item.dog_name}</Text>
                                    <TouchableOpacity testID="heart-icon" onPress={() => toggleFavorite(item)} disabled={loading}>
                                        <AntDesign
                                            name={isFavorite(item, pointID) ? "heart" : "hearto"}
                                            size={24}
                                            color={isFavorite(item, pointID) ? "red" : "black"}
                                            style={FavoriteStyle.favoriteIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        <TouchableOpacity style={FavoriteStyle.cancelButton} onPress={handleClose}>
                            <Text style={FavoriteStyle.cancelButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
            </Modal>
        </View>
    );
};

export default AddFavoritePoint;
