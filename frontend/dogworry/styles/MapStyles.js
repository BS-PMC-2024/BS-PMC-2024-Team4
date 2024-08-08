import { StyleSheet } from 'react-native';

const MapStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    map: {
        width: '100%',
        height: '100%',
        ...StyleSheet.absoluteFillObject,
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
    
    icon: {
        width: 20, // Width of the circular icon
        height: 20, // Height of the circular icon
        borderRadius: 10, // Half of the width/height to make it circular
        resizeMode: 'cover', // Ensure image covers the circle
    },
    calloutContainer: {
        width: 150, // Set your desired width
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 1,
    },
    calloutText: {
        fontSize: 14,
        color: 'black',
    },

});
 
export default MapStyles;