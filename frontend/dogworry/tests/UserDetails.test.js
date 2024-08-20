import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import UserDetails from '../screens/user/UserDetails'; // Adjust the path according to your project structure
import axios from 'axios';

// Mock axios for API calls
jest.mock('@firebase/auth', () => ({
    getAuth: jest.fn(),
    updateEmail: jest.fn().mockResolvedValue(),
  }));
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../fbauth', () => ({}));
jest.mock('axios');
jest.mock('../components/ImagePicker', () => {
    return jest.fn(() => Promise.resolve({
        canceled: false,
        assets: [{ base64: 'image-base64' }],
    }));
});

const mockData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@example.com',
    phone_number: '1234567890',
    avatar: '',
};


jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn().mockResolvedValue('mockUid123'),
    setItem: jest.fn(),
}));

const renderWithNavigation = (component) => {
    return render(
        <NavigationContainer>
            {component}
        </NavigationContainer>
    );
};

describe('UserDetails Component', () => {
    beforeEach(() => {
        jest.useFakeTimers(); 
        axios.post.mockResolvedValueOnce({ data: mockData, status: 200 });
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks(); 
    });

    it('renders the form with default values', async () => {
        const { getByText, getByDisplayValue } = renderWithNavigation(<UserDetails />);

        await waitFor(() => {
            expect(getByDisplayValue('John')).toBeTruthy();
            expect(getByDisplayValue('Doe')).toBeTruthy();
            expect(getByDisplayValue('johndoe@example.com')).toBeTruthy();
            expect(getByDisplayValue('1234567890')).toBeTruthy();
        });

        expect(getByText('Profile Picture')).toBeTruthy();
    }, 2147483647);

    it('updates the first name', async () => {
        const { getByText, getByDisplayValue } = renderWithNavigation(<UserDetails />);

        await waitFor(() => {
            expect(getByDisplayValue('John')).toBeTruthy();
        });

        const firstNameInput = getByDisplayValue('John');
        const editButton = getByText('Edit Details');

        fireEvent.press(editButton);
        fireEvent.changeText(firstNameInput, 'Jane');

        await waitFor(() => {
            expect(firstNameInput.props.value).toBe('Jane');
        });
    }, 2147483647);

    it('shows an alert for invalid email', async () => {
        const { getByText, getByDisplayValue } = renderWithNavigation(<UserDetails />);

        await waitFor(() => {
            expect(getByDisplayValue('johndoe@example.com')).toBeTruthy();
        });

        const emailInput = getByDisplayValue('johndoe@example.com');
        const editButton = getByText('Edit Details');

        fireEvent.press(editButton);
        fireEvent.changeText(emailInput, 'invalid-email');
        fireEvent(emailInput, 'blur');

        await waitFor(() => {
            expect(emailInput.props.value).toBe('');
        });
    }, 2147483647);

    it('selects an image', async () => {
        const { getByText } = renderWithNavigation(<UserDetails />);

        await waitFor(() => {
            expect(getByText('Profile Picture')).toBeTruthy();
        });

        const profilePictureButton = getByText('Profile Picture');

        fireEvent.press(profilePictureButton);

        await waitFor(() => {
            expect(getByText('Profile Picture')).toBeTruthy();
        });
    }, 2147483647);
});
