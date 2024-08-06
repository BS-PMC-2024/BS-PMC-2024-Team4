import { StyleSheet } from 'react-native';

const styles_info = StyleSheet.create({
  // healthcare styles
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

  // food styles
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 130,

    justifyContent: 'center',
    alignItems: 'center'
  },

  flatListContent: {
    justifyContent: 'center'

    //alignItems: 'center',
    
    // paddingHorizontal: 16, // Adjust as needed
    // paddingBottom: 16 // Adjust as needed
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

  foodIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#000',
  },

  searchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchInput: {
    flex: 1,
    autoCapitalize: 'none',
  },
  gridItem: {
    // flex: 1,
    justifyContent: 'flex-end',
    margin: 5,
    width:110,
    height:110,
    alignItems: 'center',
  },

  image: {
    width: 78,
    height: 78,
    borderRadius: 39,
    marginBottom: 5,
  },

itemText: {
  textAlign: 'center',
  fontSize: 16,
  fontWeight: 'bold',
  color: 'black',
  marginBottom: 2,
  width: '100%',
}
});
export default styles_info;