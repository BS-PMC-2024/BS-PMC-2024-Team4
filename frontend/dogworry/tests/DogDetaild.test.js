import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import DogDetails from '../screens/lostDogs/DogDetails';

// Mock axios
jest.mock('axios');

const mockDogs = [
    {
        _id: '1',
        dog_name: 'Buddy',
        avatar: 'base64_image_string',
        friendly: true,
        lost_area: 'Park',
        owner_phone: '123-456-7890',
    },
    {
        _id: '2',
        dog_name: 'Max',
        avatar: '',
        friendly: false,
        lost_area: 'Downtown',
        owner_phone: '098-765-4321',
    },
];

const renderWithNavigation = (component) => {
    return render(
        <NavigationContainer>
            {component}
        </NavigationContainer>
    );
};

describe('DogDetails', () => {
    it('renders loading state initially', () => {
        axios.get.mockResolvedValue({ data: [] });
        const { getByText } = renderWithNavigation(<DogDetails />);
        expect(getByText('Loading...')).toBeTruthy();
    });

    it('renders no dogs message when no dogs are found', async () => {
        axios.get.mockResolvedValue({ data: [] });
        const { getByText } = renderWithNavigation(<DogDetails />);

        await waitFor(() => expect(getByText('No dogs lost')).toBeTruthy());
    });

    it('renders a list of dogs when data is fetched', async () => {
        axios.get.mockResolvedValue({ data: mockDogs });
        const { getByText } = renderWithNavigation(<DogDetails />);

        await waitFor(() => {
            expect(getByText('Buddy')).toBeTruthy();
            expect(getByText('Max')).toBeTruthy();
            expect(getByText('identifier: Friendly and tamed')).toBeTruthy();
            expect(getByText('identifier: Not friendly')).toBeTruthy();
            expect(getByText('Last area: Park')).toBeTruthy();
            expect(getByText('Last area: Downtown')).toBeTruthy();
        });
    });
});
