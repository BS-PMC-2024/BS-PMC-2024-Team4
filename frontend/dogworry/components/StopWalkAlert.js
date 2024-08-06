import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { stopWalkStyle } from '../styles/routes_styles';

const StopWalkAlert = ({ visible, onClose, setSelected, setRoute }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={stopWalkStyle.centeredView}>
        <View style={stopWalkStyle.modalView}>
            <Text style={stopWalkStyle.modalText}>Are you sure you want to stop the current walking route?</Text>

            <Image source={require('../Images/sad-dog.png')} resizeMode='contain' style={stopWalkStyle.image} />

            <View style={stopWalkStyle.buttonContainer}>

            <TouchableOpacity style={stopWalkStyle.button} onPress={() => { setSelected(false); setRoute(null); onClose(); }}>
                <Text style={stopWalkStyle.buttonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[stopWalkStyle.button, stopWalkStyle.buttonCancel]} onPress={onClose}>
                <Text style={stopWalkStyle.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StopWalkAlert;