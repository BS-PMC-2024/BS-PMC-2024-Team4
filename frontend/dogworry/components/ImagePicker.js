import { Alert } from 'react-native';
import * as Picker from 'expo-image-picker';

const ImagePicker = async (props) => {
    const { status } = await Picker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted"){
        Alert.alert("Permission denied", "Please grant permission to upload images.");
    }
    else {
        let result = await Picker.launchImageLibraryAsync(props);
        return result;
    }
};

export default ImagePicker;