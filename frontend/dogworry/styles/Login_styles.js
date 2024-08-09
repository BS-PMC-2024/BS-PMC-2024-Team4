import { StyleSheet } from 'react-native';

const styles_info = StyleSheet.create({
    container : {
      alignItems : "center",
      paddingTop: 70,
    },
    image : {
      height : 160,
      width : 170
    },
    title : {
      fontSize : 30,
      fontWeight : "bold",
      textTransform : "uppercase",
      textAlign: "center",
      paddingVertical : 40,
      marginTop:30,
      color : "#769FCD"
    },
    inputView : {
      gap : 15,
      width : "100%",
      paddingHorizontal : 40,
      marginBottom  :5
    },
    input : {
      height : 50,
      paddingHorizontal : 20,
      borderColor : "#80858a",
      borderWidth : 1,
      borderRadius: 7,
      color:"#6c6e70"
    },
    questionMarkContainer: {
      position: 'absolute',
      right: 15,
      top: 15,
    },
    questionMark: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#769FCD',
    },
    tooltipContainer: {
        position: 'absolute',
        bottom: 60,
        left: 40,
        right: 40,
        alignItems: 'center',
    },
    tooltipBubble: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        width: '100%',
    },
    tooltipText: {
        color: 'gray',
        textAlign: 'center',
    },
    tooltipArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
        alignSelf: 'center',
        marginTop: -1,
    },
    rememberView : {
      width : "100%",
      paddingHorizontal : 50,
      justifyContent: "space-between",
      alignItems : "center",
      flexDirection : "row",
      marginBottom : 8
    },
    switch :{
      flexDirection : "row",
      gap : 1,
      justifyContent : "center",
      alignItems : "center"
      
    },
    rememberText : {
      fontSize: 13
    },
    forgetText : {
      fontSize : 15,
      color : "#769FCD"
    },
    button : {
      backgroundColor : "#769FCD",
      height : 45,
      borderColor : "gray",
      borderWidth  : 1,
      borderRadius : 5,
      alignItems : "center",
      justifyContent : "center"
    },
    buttonText : {
      color : "white"  ,
      fontSize: 18,
      fontWeight : "bold"
    }, 
    buttonView :{
      width :"100%",
      paddingHorizontal : 50
    },
    optionsText : {
      textAlign : "center",
      paddingVertical : 10,
      color : "gray",
      fontSize : 13,
      marginBottom : 6
    },
    mediaIcons : {
      flexDirection : "row",
      gap : 15,
      alignItems: "center",
      justifyContent : "center",
      marginBottom : 23
    },
    icons : {
      width : 40,
      height: 40,
    },
    footerText : {
      textAlign: "center",
      color : "gray",
    },
    signup : {
      color : "#769FCD",
      fontSize : 13
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    buttonClose: {
      backgroundColor: "#769FCD",
      marginTop: 10,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontSize: 22,
      fontWeight: "bold"
    },
  
    modalTextd: {
      marginBottom: 12,
      textAlign: "center",
      fontSize: 15
    },
    modalInput: {
      height: 40,
      width: 250,
      borderColor: "#80858a",
      borderWidth: 1,
      borderRadius: 7,
      paddingHorizontal: 10,
      marginBottom: 15,
      color: "#6c6e70"
    },

    image: {
        
        width: 250,   // adjust the width as needed
        height: 270,  // adjust the height as needed
        marginTop: 30,  // space between the footer text and the image
        alignSelf: 'center',  // center the image horizontally
      },
  })
  export default styles_info;