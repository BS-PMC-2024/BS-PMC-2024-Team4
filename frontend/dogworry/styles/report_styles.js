import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height

const report_styles = StyleSheet.create({
    // report screen styles
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingToptop: 60,
        backgroundColor: 'white',
        marginTop: 40,
    },

    screenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20, 
        textAlign:'center',
        width: '100%',
    },

    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },

    reportButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 5, // Android shadow effect
        margin: 10,
        justifyContent: 'center',
        width: (screen.width / 2) - 30, // Adjusted width for 2 buttons per row
    },

    buttonText: {
        color: 'black',
        fontSize: 16,
    },

    reportListContainer: {
        flex: 1, // Make FlatList take up remaining space
        width: '100%',
        alignItems: 'center',
    },

    reportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        margin: 10,
        borderRadius: 10,
        width: screen.width - 25,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative',
    },

    icon: {
        width: 20, // Width of the circular icon
        height: 20, // Height of the circular icon
        borderRadius: 10, // Half of the width/height to make it circular
        resizeMode: 'cover', // Ensure image covers the circle
        position: 'absolute',
        top: 10,
        right: 10,
    },

    reportDetails: {
        flex: 1,
    },

    reportTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    reportDescription: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },







    // bugs report screen
    bugsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60,
        backgroundColor: 'white',
    },

    bugsScreenTitle: {
        fontSize: 20,
        fontWeight: 'bold', 
        textAlign:'center',
        width: '100%',
    },
    reportContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        width: '100%',
    },

    pickerContainer: {
        width: '100%',
    },

    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },

    label: {
        marginBottom: 10,
        fontSize: 16,
    },

    picker: {

    },

    input: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        textAlignVertical: 'top',
        marginBottom: 20,
        width: '100%',
    },

    bugsButtonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
 
export default report_styles;