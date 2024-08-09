import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, Modal, TouchableOpacity, TextInput, Alert, BackHandler, Keyboard, VirtualizedList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { FontAwesome6, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import ImagePicker from '../../components/ImagePicker';
import { styles, dogImages } from '../../styles/MyDogsStyles';
import api_url from '../../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../../components/BackButton';
import RNPickerSelect from 'react-native-picker-select';

const MyDogs = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [dogs, setDogs] = useState(null);
    const [uid, setUid] = useState("");
    const [hasDogs, setHasDogs] = useState(false);
    const [selectedDog, setSelectedDog] = useState(null);

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
        const uid = await AsyncStorage.getItem("userUid");
        setUid(uid);
        const resp = await axios.post(`${api_url}user/getUserDogs`, { 'uid': uid });
        const data = resp.data;

        if (resp.status === 200) {
            setDogs(data);
            setLoading(false);
            setHasDogs(data.length > 0);
        }
        else if(resp.status === 204) {
            setLoading(false);
            setHasDogs(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getItem = (data, index) => data[index];

    const getItemCount = (data) => data.length;

    const renderDogItem = ({ item }) => (
        <TouchableOpacity style={styles.dogItem} onPress={() => setSelectedDog(item)}>
            <Image style={styles.dogImage} source={item.no_image ? dogImages[item.dog_image] : { uri: `data:image/jpeg;base64,${item.dog_image}` }} />
            <View>
                <Text style={styles.dogName}>{item.dog_name}</Text>
                <Text style={styles.dogBreed}>{item.dog_breed}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading)
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );

    return (
        <View style={styles.dogsContainer}>
            {hasDogs && (<VirtualizedList
                                style={styles.dogList}
                                data={dogs}
                                initialNumToRender={3}
                                contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                                renderItem={renderDogItem}
                                keyExtractor={(item, index) => index.toString()}
                                getItemCount={getItemCount}
                                getItem={getItem}
                            />)}
            <AddDog hasDogs={hasDogs} onDogAdded={fetchData} userUid={uid} selectedDog={selectedDog} setSelectedDog={setSelectedDog} />
            <BackButton />
        </View>
    );
}

const AddDog = (props) => {
    const { hasDogs, onDogAdded, userUid, selectedDog, setSelectedDog } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageNum, setImageNum] = useState(null);
    const { reset, handleSubmit, setValue, watch } = useForm({
        defaultValues: selectedDog || {}
    });
    const values = watch();

    const ref_breed = useRef();
    const ref_age = useRef();

    useEffect(() => {
        if (selectedDog) {
            setValue('dog_name', selectedDog.dog_name);
            setValue('dog_breed', selectedDog.dog_breed);
            setValue('dog_size', selectedDog.dog_size);
            setValue('dog_color', selectedDog.dog_color);
            setValue('dog_age', selectedDog.dog_age);
            if(selectedDog.no_image)
                setSelectedImage(dogImages[selectedDog.dog_image]);
            else
                setValue('dog_image', selectedDog.dog_image);
            setModalVisible(true);
        }
    }, [selectedDog]);

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
        setSelectedDog(null);
    };

    const onSubmit = async (data) => {
        // Checks if user uploaded image for the dog
        if (values.dog_image === undefined) {
            data['no_image'] = true;
            // If dog is not being edited and no image was uploaded
            if(selectedDog === null) 
                data['dog_image'] = imageNum;
        }
        data['user_id'] = userUid;

        let response;
        if (selectedDog) {
            // Update existing dog
            response = (await axios.post(`${api_url}user/updateDog`, {old_data: selectedDog, data: data})).data;
        } else {
            // Add new dog
            response = (await axios.post(`${api_url}user/addDog`, data)).data;
        }

        if (response.success) {
            Alert.alert("Doggy Details", selectedDog ? "Dog details updated successfully 🥳" : "Dog added successfully to your dogs 🥳");
            closeModal();
            onDogAdded();
        } else {
            if (response.exist)
                Alert.alert("Doggy Details", "Your dog is already added 😎\nEdit your dog's detail if you want to add new details.");
            else
                Alert.alert("Doggy Details", "There was a problem adding the dog to your dogs 😢\nPlease try again later.");
        }
    };

    return (
        <View>
            {hasDogs ? (
                <View style={{ alignItems: 'center' }}>
                    <Text>Add Another Dog</Text>
                    <TouchableOpacity testID='Modal Button' onPress={openModal}>
                        <FontAwesome6 name="plus-square" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            )
                :
                (
                    <View>
                        <Foundation name="no-dogs" size={50} color="black" />
                        <TouchableOpacity onPress={openModal}>
                            <Text>Add Dog</Text>
                            <FontAwesome6 name="plus-square" size={50} color="black" />
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
                            placeholder='Doggy Name'
                            style={styles.input}
                            value={values.dog_name}
                            onChangeText={onChangeField('dog_name')}
                            returnKeyType="next"
                            onSubmitEditing={() => ref_breed.current.focus()} />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text> Breed </Text>
                        <TextInput
                            placeholder='Breed'
                            style={styles.input}
                            value={values.dog_breed}
                            onChangeText={onChangeField('dog_breed')}
                            returnKeyType="next"
                            onSubmitEditing={() => ref_age.current.focus()}
                            ref={ref_breed} />
                    </View>

                    <View style={[styles.inputContainer, { alignItems: 'center' }]}>
                        <Text> Size </Text>
                        <View style={styles.pickerContainer}>
                        <RNPickerSelect
                            value={values.dog_size}
                            onValueChange={onChangeField('dog_size')}
                            placeholder={{ label: 'Select Size', value: null, color: 'gray' }}
                            items={[
                                { label: 'Small', value: 'Small' },
                                { label: 'Medium', value: 'Medium' },
                                { label: 'Large', value: 'Large' },
                            ]}
                            style={{
                                inputIOS: styles.inputIOS,
                                inputAndroid: styles.inputAndroid,
                            }}/>
                        </View>
                    </View>

                    <View style={[styles.inputContainer, { alignItems: 'center' }]}>
                        <Text> Color </Text>
                        <View style={styles.pickerContainer}>
                        <RNPickerSelect
                            value={values.dog_color}
                            onValueChange={(itemValue) => setValue('dog_color', itemValue)}
                            placeholder={{ label: 'Select Color', value: null, color: 'gray' }}
                            items={[
                                { label: 'Black', value: 'Black' },
                                { label: 'Brown', value: 'Brown' },
                                { label: 'White', value: 'White' },
                                { label: 'Golden', value: 'Golden' },
                                { label: 'Mixed', value: 'Mixed' },
                            ]}
                            style={{
                                inputIOS: styles.inputIOS,
                                inputAndroid: styles.inputAndroid,
                            }}/>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text> Age </Text>
                        <TextInput
                            placeholder='Age'
                            style={styles.input}
                            value={values.dog_age}
                            onChangeText={onChangeField('dog_age')}
                            keyboardType="numeric"
                            ref={ref_age} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit(onSubmit)}
                            testID="Add Dog">
                            <Text style={styles.buttonText}>{selectedDog ? 'Update Dog' : 'Add Dog'}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </View>
    );
}

export default MyDogs;
