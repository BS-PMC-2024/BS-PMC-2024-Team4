import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, Modal, TouchableOpacity, TextInput, Alert, BackHandler, Keyboard, VirtualizedList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { FontAwesome6, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import ImagePicker from '../../components/ImagePicker';
import {styles, dogImages} from '../../styles/MyDogsStyles';
import api_url from '../../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyDogs = () => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true);
    const [dogs, setDogs] = useState(null);
    const [uid, setUid] = useState("");
    const [hasDogs, setHasDogs] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.navigate("Main");
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );

    const fetchData = async () => {
        const uid = await AsyncStorage.getItem("userUid")
        setUid(uid);
        const resp = await axios.post(`${api_url}user/getUserDogs`, {'uid': uid});
        const data = resp.data;

        if(resp.status === 200){
            setDogs(data);
            setLoading(false);
            setHasDogs(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getItem = (data, index) => data[index];

    const getItemCount = (data) => data.length;

    const renderDogItem = ({ item }) => (
        <View style={styles.dogItem}>
            <Image style={styles.dogImage} source={item.no_image ? dogImages[item.dog_image] : { uri: `data:image/jpeg;base64,${item.dog_image}`}} />
            <View>
                <Text style={styles.dogName}>{item.dog_name}</Text>
                <Text style={styles.dogBreed}>{item.dog_breed}</Text>
            </View>
        </View>
    );

    if (loading)
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );

    return (
        <View style={styles.dogsContainer}>
            <VirtualizedList
                data={dogs}
                initialNumToRender={3}
                renderItem={renderDogItem}
                keyExtractor={(item, index) => index.toString()}
                getItemCount={getItemCount}
                getItem={getItem}
            />
            <AddDog hasDogs={hasDogs} onDogAdded={fetchData} userUid={uid} />
        </View>
    )
}

const AddDog = ( props ) => {
    const { hasDogs, onDogAdded, userUid } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageNum, setImageNum] = useState(null);
    const { reset, handleSubmit, setValue, watch, control } = useForm();
    const values = watch();

    const ref_breed = useRef();
    const ref_age = useRef();
    
    const onChangeField = useCallback(
        name => text => {
            setValue(name, text);
        },
        []
    );

    const dogImage = async () => {
        const result = await ImagePicker({
            allowdEditing: true,
            base64: true,
        });
        if (result && !result.canceled) {
            setValue('dog_image', result.assets[0].base64);
        }
    };

    const openModal = async () => {
        // Generate a random number between 1 and 5 when the modal is opened
        const imageNum = Math.floor(Math.random() * 5) + 1;
        const image = dogImages[imageNum];
        
        setImageNum(imageNum);
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        reset();
    };

    const onSubmit = async (data) => {
        if(values.dog_image === undefined){
            data['dog_image'] = imageNum;
            data['no_image'] = true;
        }
        data['user_id'] = userUid;

        const response = (await axios.post(`${api_url}user/addDog`, data)).data;

        if(response.success){
            Alert.alert("Add New Doggy", "Dog added successfully to your dogs 🥳");
            closeModal();
            onDogAdded();
        }
        else{
            console.log(response)
            if(response.exist)
                Alert.alert("Add New Doggy", "Your dog is already added 😎\nEdit your dog's detail if you want to add new details.");
            else
                Alert.alert("Add New Doggy", "There was a problem adding the dog to your dogs 😢\nPlease try again later.");
        }
    };

    return (
        <View>
            { hasDogs ? (
                <View style={{alignItems:'center'}}>
                    <Text>Add Another Dog</Text>
                    <TouchableOpacity onPress={openModal}>
                        <FontAwesome6 name="plus-square" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            )
            :
            (
                <View>
                    <Foundation name="no-dogs" size={24} color="black" />
                    <TouchableOpacity onPress={openModal}>
                        <FontAwesome6 name="plus-square" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )
            }
                <Modal
                    onDismiss={() => reset(values)}
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                    statusBarTranslucent={true}>
                    <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>

                        <TouchableOpacity style={styles.imageContainer} onPress={dogImage}>
                            <Text>Doggy Picture</Text>
                            <Image
                                source={values.dog_image ? { uri: `data:image/jpeg;base64,${values.dog_image}` } : selectedImage}
                                style={styles.profileImage} />
                        
                        </TouchableOpacity>

                        <View style={styles.inputContainer}>
                            <Text> Doggy Name </Text>
                            <TextInput
                            style={styles.input}
                            value={values.dog_name}
                            onChangeText={onChangeField('dog_name')}
                            returnKeyType="next"
                            onSubmitEditing={() => ref_breed.current.focus()}/>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text> Breed </Text>
                            <TextInput
                            style={styles.input}
                            value={values.dog_breed}
                            onChangeText={onChangeField('dog_breed')}
                            returnKeyType="next"
                            onSubmitEditing={() => ref_age.current.focus()}
                            ref={ref_breed}/>
                        </View>

                        <View style={[styles.inputContainer, {alignItems: 'center'}]}>
                            <Text> Size </Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                selectedValue={values.dog_size}
                                onValueChange={onChangeField('dog_size')}
                                styles={styles.picker}
                                dropdownIconColor="blue">
                                    <Picker.Item label="Select Size" color="gray"/>
                                    <Picker.Item label="Small" value="Small" />
                                    <Picker.Item label="Medium" value="Medium" />
                                    <Picker.Item label="Large" value="Large" />
                                </Picker>
                            </View>
                        </View>

                        <View style={[styles.inputContainer, {alignItems: 'center'}]}>
                            <Text> Color </Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                selectedValue={values.dog_color}
                                onValueChange={(itemValue) => setValue('dog_color', itemValue)}
                                style={styles.picker}
                                dropdownIconColor="blue">
                                    <Picker.Item label="Select Color" color="gray"/>
                                    <Picker.Item label="Black" value="Black" />
                                    <Picker.Item label="Brown" value="Brown" />
                                    <Picker.Item label="White" value="White" />
                                    <Picker.Item label="Golden" value="Golden" />
                                    <Picker.Item label="Mixed" value="Mixed" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text> Age </Text>
                            <TextInput
                            style={styles.input}
                            value={values.dog_age}
                            onChangeText={onChangeField('dog_age')}
                            keyboardType="numeric"
                            ref={ref_age}/>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSubmit(onSubmit)}>
                                <Text style={styles.buttonText}>Add Dog</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>
            </View>
    )
}

export default MyDogs