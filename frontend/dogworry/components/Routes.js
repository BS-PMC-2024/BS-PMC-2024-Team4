import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, FlatList, ActivityIndicator, Animated, Easing, Dimensions} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Polyline } from 'react-native-maps';
import axios from 'axios';
import api_url from '../config';
import DogWalkSVG from '../assets/svgs/dog-walk.svg';
import StopWalkAlert from './StopWalkAlert';
import { routesStyles } from '../styles/routes_styles';

export const WalkRoute = (props) => {
    const { coordinates } = props;

    return (
        <Polyline coordinates={coordinates} strokeWidth={2} strokeColor="blue" />
    );
};

export const GetRoutes = (props) => {
    const { currentCoordinates, setRoute } = props;
    const [routes, setRoutes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const windowHeight = Dimensions.get('window').height
    const windowWidth = Dimensions.get('window').width

    const slideAnim = useRef(new Animated.Value(windowHeight)).current;

    const fetchRoutesCoordinates = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${api_url}map/paths`, { coords: currentCoordinates });
            const routes = response.data.routes;

            setRoutes(routes);
            setLoading(false);
            slideUp();
        } catch (error) {
            setLoading(false);
            console.error('Error fetching routes:', error);
        }
    };

    const slideUp = () => {
        Animated.timing(slideAnim, {
            toValue: windowHeight * 0.4,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();
    };

    const slideDown = () => {
        Animated.timing(slideAnim, {
            toValue: windowHeight,
            duration: 300,
            easing: Easing.in(Easing.exp),
            useNativeDriver: true,
        }).start(() => setRoutes(null));
    };

    const handleClose = () => {
        setRoute(null);
        slideDown();
    }

    const handleSelection = () => {
        setSelected(true);
        slideDown();
    }

    return (
        <View style={routesStyles.container}>
            {selected ?
            <View style={routesStyles.getRoute}>
                <TouchableOpacity onPress={() => {setAlertVisible(true)}}>
                    <Text>Stop Walk</Text>
                </TouchableOpacity>
                <StopWalkAlert 
                    visible={alertVisible} 
                    onClose={() => setAlertVisible(false)} 
                    setSelected={setSelected}
                    setRoute={setRoute}/>
            </View>
            :
            <TouchableOpacity onPress={fetchRoutesCoordinates} style={routesStyles.getRoute}>
                <Text>Find Walking Routes</Text>
                <View style={routesStyles.routeButton}>
                    <FontAwesome6 name="route" size={24} color="black" />
                </View>
            </TouchableOpacity>
            }
            {routes && (
                <Animated.View style={[routesStyles.selector, { transform: [{ translateY: slideAnim }] }]}>
                    <TouchableOpacity onPress={handleClose} style={routesStyles.closeButton}>
                        <Text style={routesStyles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    <RouteSelector setRoute={setRoute} routes={routes} />
                    <TouchableOpacity style={routesStyles.walkButtonContainer} onPress={handleSelection}>
                        <View style={routesStyles.walkButton}>
                            <Text style={routesStyles.walkText}>Lets Walk!  </Text>
                            <DogWalkSVG width={45} height={45} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            )}
            {loading && <ActivityIndicator 
                        style={{position: 'absolute', transform: [{translateY: -(windowHeight * 0.5)}]}} 
                        size="large" 
                        testID="loading" />}
        </View>
    );
};

export const RouteSelector = (props) => {
    const { routes, setRoute } = props;

    return (
        <View style={routesStyles.selectorContent}>
            <FlatList
                data={routes}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setRoute(item.route.map(coord => ({
                            latitude: coord[0],
                            longitude: coord[1],
                        })))}
                        style={routesStyles.routeItem}>
                        <Text>{item.route_name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default GetRoutes;
