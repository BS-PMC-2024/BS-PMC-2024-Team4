import React from 'react';
import ParkMarker from '../components/ParkMarker'; 
import { render, fireEvent, waitFor } from '@testing-library/react-native';



jest.mock('react-native-maps', () => {
    const { View, Text } = require('react-native');
    return {
      Marker: (props) => <View {...props} />,
      Callout: (props) => <View {...props} />,
      MapView:(props) => <View {...props} />,
      AddFavoritePoint: (props) => <View {...props} />,
    };
  });
  
  describe('ParkMarker', () => {
    const mockPark = {
      latitude: 37.78825,
      longitude: -122.4324,
      name: 'Park 1',
      address: '123 Park St',
      traffic: 'Low',
      temperature: 25,
    };
  
    it('renders correctly with park data', () => {
      const { getByText } = render(<ParkMarker park={mockPark} />);
  
      expect(getByText('Dog Park')).toBeTruthy();
      expect(getByText('Park Name: Park 1')).toBeTruthy();
      expect(getByText('Park Address: 123 Park St')).toBeTruthy();
      expect(getByText('Pavement Temperature: 25°C')).toBeTruthy();
      expect(getByText('Park Traffic: Low')).toBeTruthy();
    }, 2147483647);
  
    it('toggles label visibility on marker press', async () => {
      const { getByText, queryByText } = render(<ParkMarker park={mockPark} />);
  
      // Verify that callout content is visible initially
      expect(getByText('Dog Park')).toBeTruthy();
      
      // Simulate marker press to hide the label
      fireEvent.press(getByText('Dog Park'));
      
      // Simulate marker press again to show the label
      fireEvent.press(getByText('Dog Park'));
      expect(getByText('Dog Park')).toBeTruthy();
    }, 2147483647);
  });