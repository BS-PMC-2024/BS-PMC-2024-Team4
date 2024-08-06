import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VetNearby from '../screens/VetNearbyScreen';
import api_url from '../config';

const mock = new MockAdapter(axios);

const mockVets = [
  {
    _id: '1',
    name: 'Vet 1',
    address: 'Address 1',
    latitude: '31.27179407552312',
    longitude: '34.77245448672832',
    openingHours: '9:00 - 17:00'
  },
  {
    _id: '2',
    name: 'Vet 2',
    address: 'Address 2',
    latitude: '31.27179407552312',
    longitude: '34.77245448672832',
    openingHours: '10:00 - 18:00'
  },
];

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 31.27179407552312,
      longitude: 34.77245448672832,
    },
  }),
}));

describe('VetNearby', () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet(`${api_url}info/getVets/`).reply(200, mockVets);
  });

  const renderWithNavigation = (component) => {
    return render(
      <NavigationContainer>
        {component}
      </NavigationContainer>
    );
  };

  it('renders correctly and displays vets sorted by proximity', async () => {
    const { getByText, getAllByText, debug } = renderWithNavigation(<VetNearby />);
    
    await waitFor(() => expect(getByText('List of vets sorted by your current location:')).toBeTruthy());
    
    const vetNames = getAllByText(/Vet/);
    expect(vetNames.length).toBe(2);
    expect(vetNames[0].props.children).toBe('Vet 1');
    expect(vetNames[1].props.children).toBe('Vet 2');
  });

  it('expands and shows details when vet name is clicked', async () => {
    const { getByText, queryByText, debug } = renderWithNavigation(<VetNearby />);

    await waitFor(() => expect(getByText('Vet 1')).toBeTruthy());

    fireEvent.press(getByText('Vet 1'));

    await waitFor(() => {
      expect(queryByText('Address 1')).toBeTruthy();
      expect(queryByText('9:00 - 17:00')).toBeTruthy();
    });
  });
});
