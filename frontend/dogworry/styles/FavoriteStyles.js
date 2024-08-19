import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height

const FavoriteStyle = StyleSheet.create({
    heartContainer: {
        position: "absolute",
        top: 5,
        right: 5,
        zIndex: 10,  // Ensure it's on top of other components
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: screen.width * 0.8,
        height: screen.height * 0.8,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
        textAlign: 'center',
    },
    dogItem: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        marginVertical: 5,
        borderRadius: 5,
        width: screen.width * 0.5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    selectedDog: {
        backgroundColor: '#e0e0e0',
    },
    dogName: {
        fontSize: 16,
        flex: 1,
    },
    dogImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,  // Adjust margin to better align text with image
    },
    favoriteIcon: {
        marginLeft: 10,
    },
    addButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'green',
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 10,
        padding: 15,
        backgroundColor: 'red',
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default FavoriteStyle;