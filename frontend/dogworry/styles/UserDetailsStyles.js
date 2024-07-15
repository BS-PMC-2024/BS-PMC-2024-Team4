import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 5,
        alignItems: 'center',
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
});

export default styles;
