import { StyleSheet } from 'react-native';

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
    },
    detailsContainer: {
        alignItems: 'center',
        width: '100%',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    inputContainerName: {
        width: '48%',
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
    inputEnabled: {
        backgroundColor: 'white', // Light green background when enabled
    },
    inputDisabled: {
        backgroundColor: '#ffe6e6', // Light red background when disabled
        color: '#3b3b3b',
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
    homeIconContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    homeIcon: {
        width: 40,
        height: 40,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#000',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
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
});

export const dogImages = {
    1: require('../Images/dogProfile/1.png'),
    2: require('../Images/dogProfile/2.png'),
    3: require('../Images/dogProfile/3.png'),
    4: require('../Images/dogProfile/4.png'),
    5: require('../Images/dogProfile/5.png'),
};