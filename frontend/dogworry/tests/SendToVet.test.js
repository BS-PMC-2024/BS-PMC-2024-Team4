import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import SendToVet from '../screens/SendToVet'; // Adjust the import path as necessary
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';





jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

const mockNavigate = jest.fn();
const mockGoBack=jest.fn();

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockNavigate,
            goBack: mockGoBack, // Assuming 'goBack' is used for navigation
        }),
    };
});

const renderWithNavigation = (component) => {
    return render(
        <NavigationContainer>
            {component}
        </NavigationContainer>
    );
};

describe('SendToVet Component', () => {
    beforeEach(() => {
        // Clear mock calls before each test
        mockNavigate.mockClear();
        AsyncStorage.getItem.mockResolvedValue('userUid123'); // Mock user ID fetched from AsyncStorage
        axios.post.mockResolvedValue({ status: 200 }); // Mock axios post to always succeed
    });

    it('renders and allows a message to be sent', async () => {
        const { getByText, getByPlaceholderText } = renderWithNavigation(<SendToVet />);

        await waitFor(() => {
            expect(getByText('Send a Message to Vets')).toBeTruthy();
        });

        const messageInput = getByPlaceholderText('Type your message here');
        fireEvent.changeText(messageInput, 'Hello, this is a test message.');

        const sendButton = getByText('Send Message');
        fireEvent.press(sendButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.anything(), {
                user_id: 'userUid123',
                subject: 'general',
                message: 'Hello, this is a test message.'
            });
            expect(Alert.alert).toHaveBeenCalledWith(
                "Question Submitted",
                "Thank you. Your question has been recorded in the system and will be answered by a vet in the coming days",
                expect.anything()
            );
        });
    });

    it('shows error if no message is entered', async () => {
        const { getByText } = renderWithNavigation(<SendToVet />);

        const sendButton = getByText('Send Message');
        fireEvent.press(sendButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Empty Field",
                "You can't send empty message!",
                expect.anything()
            );
        });
    });

    it('navigates back when dismiss button is pressed', async () => {
        const { getByText } = renderWithNavigation(<SendToVet />);

        const dismissButton = getByText('Dismiss');
        fireEvent.press(dismissButton);
        
        await waitFor(() => {
            expect(mockGoBack).toHaveBeenCalled();
        });

    });
});
