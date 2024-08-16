import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height

const report_styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        top: 110,
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
    screenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        //marginTop: 100, 
        textAlign:'center',
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
    reportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        width: screen.width - 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    reportListContainer: {
        flex: 1, // Make FlatList take up remaining space
        width: '100%',
        alignItems: 'center',
    },
});
 
export default report_styles;