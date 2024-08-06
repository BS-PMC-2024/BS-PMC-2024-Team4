import { StyleSheet, Dimensions } from 'react-native';

export const routesStyles = StyleSheet.create({
    getRoute: {
        position: 'absolute',
        bottom: 30,
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.4, 
        shadowRadius: 6, 
    },
    selector: {
        position: 'absolute',
        bottom: 0,
        zIndex: 3,
        backgroundColor: 'white',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: Dimensions.get('window').height * 0.7,
        width: Dimensions.get('window').width * 0.6,
        elevation: 3,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 3 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 3, 
    },
    selectorContent: {
        flex: 1,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    routeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 5,
        backgroundColor: 'transparent'
    },
    closeButton: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'blue',
        fontSize: 16,
    },
    routeItem: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    walkButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        borderRadius: 5,
    },
    walkButtonContainer: {
        position: 'absolute',
        transform: [{translateY: Dimensions.get('window').height * 0.23}, {translateX: Dimensions.get('window').width * 0.1}],
        zIndex: 3,
        backgroundColor: '#d4b0ff',
        borderRadius: 15,
        width: Dimensions.get('window').width * 0.4,
        elevation: 2,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 3 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 3, 
    },
    walkText: {
        fontSize: 16
    }
});

export const stopWalkStyle = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    image: {
      width: 120,
      height: 120,
      marginVertical: 15,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      backgroundColor: '#2196F3',
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      marginHorizontal: 10,
      width: 50,
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 3 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 3, 
    },
    buttonCancel: {
      backgroundColor: '#f44336',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 16,
    },
  });