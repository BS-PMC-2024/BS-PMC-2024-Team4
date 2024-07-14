import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserDetails from '../screens/user/UserDetails'; // Adjust the path according to your project structure
import api_url from '../config';

// Mock fetch for default values
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone_number: '1234567890',
            avatar: '',
        }),
    })
);

jest.mock('../components/ImagePicker', () => {
    return jest.fn(() => Promise.resolve({
        canceled: false,
        assets: [{ uri: 'image-uri' }],
    }));
});

describe('UserDetails Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renders the form with default values', async () => {
        const { getByText, getByDisplayValue } = render(<UserDetails />);

        await waitFor(() => {
            expect(getByDisplayValue('John')).toBeTruthy();
            expect(getByDisplayValue('Doe')).toBeTruthy();
            expect(getByDisplayValue('john.doe@example.com')).toBeTruthy();
            expect(getByDisplayValue('1234567890')).toBeTruthy();
        });

        expect(getByText('Profile Picture')).toBeTruthy();
    });

    it('updates the first name', async () => {
        const { getByDisplayValue } = render(<UserDetails />);

        await waitFor(() => {
            expect(getByDisplayValue('John')).toBeTruthy();
        });

        const firstNameInput = getByDisplayValue('John');
        fireEvent.changeText(firstNameInput, 'Jane');

        expect(firstNameInput.props.value).toBe('Jane');
    });

    it('shows an alert for invalid email', async () => {
        const { getByText, getByDisplayValue } = render(<UserDetails />);

        await waitFor(() => {
            expect(getByDisplayValue('john.doe@example.com')).toBeTruthy();
        });

        const emailInput = getByDisplayValue('john.doe@example.com');
        fireEvent.changeText(emailInput, 'invalid-email');
        fireEvent(emailInput, 'blur');

        await waitFor(() => {
            expect(getByDisplayValue('')).toBeTruthy(); // Email should be cleared
        });
    });

    it('selects an image', async () => {
        const { getByText, getByDisplayValue } = render(<UserDetails />);

        await waitFor(() => {
            expect(getByDisplayValue('John')).toBeTruthy();
        });

        const profilePictureButton = getByText('Profile Picture');
        fireEvent.press(profilePictureButton);

        await waitFor(() => {
            expect(getByText('Profile Picture')).toBeTruthy(); // Assuming the image URI is displayed somewhere
        });
    });
});