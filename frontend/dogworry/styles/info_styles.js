import { StyleSheet } from 'react-native';

const styles_info = StyleSheet.create({

  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
  },

  caseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    borderBottomColor: '#f0f0f0',
    
  },

  caseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  descriptionContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    fontSize: 16,
  },

  screen: {
    flex: 1,

    backgroundColor: '#ffffff',
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 100, 
    textAlign:'center',
  },

  subTitle: {
    fontSize: 16,
    margin: 5,
    textAlign:'center',
  },

  list: {
    flexGrow: 1,
  },

});
export default styles_info;