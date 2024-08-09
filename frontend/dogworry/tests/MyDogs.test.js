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
        jest.useFakeTimers(); 
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

    }, 2147483647);

    it('opens the add dog modal and adds a new dog', async () => {
        const { getByText, getByPlaceholderText, getByTestId, unmount, debug } = renderWithNavigation(<MyDogs />);

        await waitFor(async () => {
            await waitFor(() => {
                expect(getByText('Buddy')).toBeTruthy();
                expect(getByText('Golden Retriever')).toBeTruthy();
            });
        });

        const addButton = getByTestId('Modal Button');
        await waitFor(() => {
            fireEvent.press(addButton);
        })

        await waitFor(() => {
            expect(getByText('Doggy Picture')).toBeTruthy();
        });

        const mock_dog = {
            dog_name: 'Charlie',
            dog_breed: 'Beagle',
            dog_age: '3',
        }

        await waitFor(async () =>{
            const dogNameInput = getByPlaceholderText('Doggy Name');
            fireEvent.changeText(dogNameInput, 'Charlie');
            expect(dogNameInput).toHaveProp('value', 'Charlie');

            const breedInput = getByPlaceholderText('Breed');
            fireEvent.changeText(breedInput, 'Beagle');
            expect(breedInput).toHaveProp('value', 'Beagle');

            const ageInput = getByPlaceholderText('Age');
            fireEvent.changeText(ageInput, '3');
            expect(ageInput).toHaveProp('value', '3');

            axios.post.mockResolvedValue({ data: {success: true} });
            const submitButton = getByTestId('Add Dog');

            await waitFor(() => {
                fireEvent.press(submitButton);
            })
        })
        unmount();

        axios.post.mockResolvedValueOnce({ data: [...mockDogs, { dog_name: 'Charlie', dog_breed: 'Beagle', dog_age: '3', dog_image: 'base64image', no_image: false }], status: 200 });
        const { getByText: getByTextAfterReload } = renderWithNavigation(<MyDogs />);
        
        await waitFor(() => {
            expect(getByTextAfterReload('Buddy')).toBeTruthy();
            expect(getByTextAfterReload('Golden Retriever')).toBeTruthy();
            expect(getByTextAfterReload('Max')).toBeTruthy();
            expect(getByTextAfterReload('Bulldog')).toBeTruthy();
            expect(getByTextAfterReload('Charlie')).toBeTruthy();
            expect(getByTextAfterReload('Beagle')).toBeTruthy();
        });
    }, 2147483647);
});
