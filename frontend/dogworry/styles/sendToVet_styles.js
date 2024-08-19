import { StyleSheet, Dimensions } from 'react-native';

// Use Dimensions to get the full width of the device
const { width } = Dimensions.get('window');

const sendToVet_styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        paddingTop:40,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        paddingTop:-4,
    },
    
    picker: {
        paddingTop:-20,
        height:180,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        height: 100,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
});
export default sendToVet_styles;