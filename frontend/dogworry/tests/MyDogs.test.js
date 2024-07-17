import React from 'react';
import { Text } from 'react-native'; // Import Text here
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyDogs from '../screens/user/MyDogs'; // Adjust the path according to your project structure
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

jest.mock('../components/ImagePicker', () => {
    return jest.fn(() => Promise.resolve({
        canceled: false,
        assets: [{ base64: 'image-base64' }],
    }));
});

const mockDogs = [
    {
        dog_name: 'Buddy',
        dog_breed: 'Golden Retriever',
        dog_image: 'base64image',
        no_image: false,
    },
    {
        dog_name: 'Max',
        dog_breed: 'Bulldog',
        dog_image: 'base64image',
        no_image: false,
    },
];

const renderWithNavigation = (component) => {
    return render(
        <NavigationContainer>
            {component}
        </NavigationContainer>
    );
};

describe('MyDogs Component', () => {
    beforeEach(() => {
        jest.useFakeTimers(); // Use fake timers to control async operations
        AsyncStorage.getItem.mockResolvedValue('test-uid');
        axios.post.mockResolvedValue({ data: mockDogs, status: 200 });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders the dog list correctly', async () => {
        const { getByText, debug } = renderWithNavigation(<MyDogs />);

        await waitFor(async () => {
            await waitFor(() => {
                expect(getByText('Buddy')).toBeTruthy();
                expect(getByText('Golden Retriever')).toBeTruthy();
                expect(getByText('Max')).toBeTruthy();
                expect(getByText('Bulldog')).toBeTruthy();
            });
        });

        debug(); // Print the rendered component to the console
    });

    it('opens the add dog modal and adds a new dog', async () => {
        const { getByText, getByPlaceholderText, queryByText } = renderWithNavigation(<MyDogs />);

        await waitFor(async () => {
            await waitFor(() => {
                expect(getByText('Buddy')).toBeTruthy();
                expect(getByText('Golden Retriever')).toBeTruthy();
            });
        });

        const addButton = getByText('Add Another Dog');
        fireEvent.press(addButton);

        await waitFor(async () => {
            await waitFor(async () => {
                fireEvent.press(profilePictureButton);
            });
            await waitFor(() => {
                expect(getByText('Doggy Picture')).toBeTruthy();
            });
        });

        const dogNameInput = getByPlaceholderText('Doggy Name');
        fireEvent.changeText(dogNameInput, 'Charlie');
        const breedInput = getByPlaceholderText('Breed');
        fireEvent.changeText(breedInput, 'Beagle');
        const ageInput = getByPlaceholderText('Age');
        fireEvent.changeText(ageInput, '3');

        const submitButton = getByText('Add Dog');
        fireEvent.press(submitButton);

        await waitFor(async () => {
            await waitFor(() => {
                expect(queryByText('Charlie')).toBeTruthy();
                expect(queryByText('Beagle')).toBeTruthy();
            });
        });
    });
});
