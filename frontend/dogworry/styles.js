import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
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
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 30,
    },
    logo:{
      width: 50,
      height: 55
    },
    headerTitleContainer: {
      transform: [{translateY: (screen.height*ASPECT_RATIO*0.02)}],
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 100,
      padding: 5,
    },
    titleText: {
      fontSize: 20,
      textShadowRadius: 2
    },
  });
  export default styles;