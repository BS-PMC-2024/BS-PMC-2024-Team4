import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, ActivityIndicator } from 'react-native';
import styles from '../styles';
import api_url from '../config';
import axios from 'axios';
import FoodGridItem from '../components/FoodGridItem';
import styles_info from '../styles/info_styles';
import filter from "lodash";


// food page

const FoodScreen = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [fullData, setFullData] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${api_url}info/getFood/`)
        .then(response => {
            setData(response.data);
            setFullData(response.data)
            setLoading(false);
        })
        .catch(error => {
            console.error('error fetching data', error);
            setLoading(false);
        });
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(fullData, (item) => { 
            return contains(item.name, formattedQuery);
        });
        setData(filteredData);
    };

    const contains = (name, query) => {
        return name.toLowerCase().includes(query);
    };

    return (
        <View style={styles_info.screenContainer}>
            {/* <View style={styles_info.searchBox}>
                <TextInput style={styles_info.searchInput} placeholder='Search' clearButtonMode='always'
                    value={searchQuery}
                    onChangeText={(query) => handleSearch(query)}
                />
            </View> */}
            <FlatList data={data}
                keyExtractor={item => item.name} renderItem={({ item }) => ( <FoodGridItem food={item}></FoodGridItem> )}
                numColumns={3}
                contentContainerStyle={styles_info.flatListContent}
            />
        </View>
    );
}

export default FoodScreen;