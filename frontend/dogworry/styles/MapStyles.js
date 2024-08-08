import { StyleSheet } from 'react-native';

const MapStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{translateY: 10}]
    },

    map: {
        width: '100%',
        height: '100%',
    },

    buttonContainer: {
        position: 'absolute',
        top: 80, 
        width: '100%',
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
         
    },

    button: {
        backgroundColor: 'white', 
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 20, 
        alignItems: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.4, 
        shadowRadius: 6, 
        elevation: 5, // Android shadow effect
        margin: 10,
    },

    buttonText: {
        color: 'black',
        fontSize: 16,
    },

    callout: {
        padding: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    calloutName: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },

    calloutText: {
        color: '#000',
        fontSize: 14,
    },
});
 
export default MapStyles;