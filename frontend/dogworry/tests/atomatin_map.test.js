import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ParkMarker from '../components/ParkMarker'; 
import { render, fireEvent, waitFor } from '@testing-library/react-native';



jest.mock('react-native-maps', () => {
    const { View, Text } = require('react-native');
    return {
      Marker: (props) => <View {...props} />,
      Callout: (props) => <View {...props} />,
      MapView: (props) => <View {...props} />,
    };
  });
  
  describe('ParkMarker', () => {
    const mockPark = {
      latitude: 37.78825,
      longitude: -122.4324,
      name: 'Park 1',
      address: '123 Park St',
      temperature: 25,
    };
  
    it('renders correctly with park data', () => {
      const { getByText } = render(<ParkMarker park={mockPark} />);
  
      expect(getByText('dogs park')).toBeTruthy();
      expect(getByText('Park 1')).toBeTruthy();
      expect(getByText('123 Park St')).toBeTruthy();
      expect(getByText('pavement  temperature: 25°C')).toBeTruthy();
    });
  
    it('toggles label visibility on marker press', async () => {
      const { getByText, queryByText } = render(<ParkMarker park={mockPark} />);
  
      // Verify that callout content is visible initially
      expect(getByText('dogs park')).toBeTruthy();
      
      // Simulate marker press to hide the label
      fireEvent.press(getByText('dogs park'));
      
      // Wait for label to toggle visibility
      await waitFor(() => expect(queryByText('dogs park')).toBeNull());
      
      // Simulate marker press again to show the label
      fireEvent.press(getByText('dogs park'));
      expect(getByText('dogs park')).toBeTruthy();
    });
  });