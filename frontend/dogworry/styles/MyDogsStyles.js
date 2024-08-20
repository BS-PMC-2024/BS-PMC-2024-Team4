import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Light grey background color
        padding: 20,
    },
    dogsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        backgroundColor: '#f0f0f0', // Light grey background color
        padding: 20,
        marginTop: 70,
        paddingTop: 40,
    },
    dogList: {
        width: "100%",
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    buttonContainer: {
        width: '80%',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#d4b0ff', // Light purple button color
        paddingVertical: 10,
        borderRadius: 15,
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#000',
    },
    pickerContainer: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        width: 200,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    picker: {
        height: 40,
    },
    dogItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        width: 300
    },
    dogImage: {
        width: 100,
        height: 100,
        borderRadius: 25,
        marginRight: 10,
    },
    dogName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dogBreed: {
        fontSize: 14,
        color: '#666',
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
      },
      inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
      },
      noDogs: {
        width: screen.width * 0.4,
        height: screen.height * 0.3,
      }
});

export const dogImages = {
    1: require('../Images/dogProfile/1.png'),
    2: require('../Images/dogProfile/2.png'),
    3: require('../Images/dogProfile/3.png'),
    4: require('../Images/dogProfile/4.png'),
    5: require('../Images/dogProfile/5.png'),
};