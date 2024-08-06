import { StyleSheet } from 'react-native';

const styles_info = StyleSheet.create({

  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    width: '100%',
  },

  caseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    borderBottomColor: '#f0f0f0',
    
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  descriptionContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    fontSize: 26,
  },

  screen: {
    flex: 1,

    backgroundColor: '#ffffff',
  },
  
  

  details:{
    fontSize:18,
  },

  detailsT:{
    fontSize:20,
    fontWeight:'bold',
    textDecorationLine: 'underline'
    
  },

  screenTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 100, 
    textAlign:'center',
  },

  subTitle: {
    fontSize: 20,
    margin: 5,
    textAlign:'center',
  },

  list: {
    flexGrow: 1,
  },


});
export default styles_info;