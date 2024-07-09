import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    appContainer: {
      flex: 1,
      position: 'relative',
    },
    navigatorContainer: {
      flex: 1,
      zIndex: -1, // Ensure the navigator is below the User component
    },
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingTop: 70
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30, 
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 30, 
    },
    screenDscription:{
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
    },
    logo: {
      width: 250,
      height: 250,
      marginBottom: 30, // Adds gap between the image and the next text element
    },
    listItem: {
      marginTop: 10,
      padding: 20,
      alignItems: 'center',
      backgroundColor: '#fff',
      width: '100%'
    },
    listItemText: {
      fontSize: 18
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 30,
    },
    descriptionContainer: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
    },
  });
  export default styles;