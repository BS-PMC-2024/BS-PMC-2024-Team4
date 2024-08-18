import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Reports from '../screens/reports/Reports'; // Adjust the path according to your project structure
import axios from 'axios';

jest.mock('axios');

const mockBlockedAreas = [
    {
        address: '123 Test St.',
        handler: 'John Doe',
        description: 'Road closed due to construction.',
    },
    {
        address: '456 Sample Rd.',
        handler: 'Jane Smith',
        description: 'Accident blocking the road.',
    },
];

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockNavigate,
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

describe('Reports Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockBlockedAreas, status: 200 });
        mockNavigate.mockClear(); // Clear mock calls before each test
    });

    it('renders the blocked areas list correctly', async () => {
        const { getByText } = renderWithNavigation(<Reports />);

        await waitFor(() => {
            expect(getByText('Report Us')).toBeTruthy();
        });

        await waitFor(() => {
            expect(getByText('Road Blocking: 123 Test St.')).toBeTruthy();
            expect(getByText('John Doe')).toBeTruthy();
            expect(getByText('Road closed due to construction.')).toBeTruthy();
            expect(getByText('Road Blocking: 456 Sample Rd.')).toBeTruthy();
            expect(getByText('Jane Smith')).toBeTruthy();
            expect(getByText('Accident blocking the road.')).toBeTruthy();
        });
    });

    it('navigates to the correct screens when buttons are pressed', async () => {
        const { getByText } = renderWithNavigation(<Reports />);

        // await waitFor(() => {
        //     expect(getByText('Lost my dog')).toBeTruthy();
        // });

        // fireEvent.press(getByText('Lost my dog'));
        // await waitFor(() => {
        //     expect(mockNavigate).toHaveBeenCalledWith('ReportLostDog');
        // });

        // fireEvent.press(getByText('Problamatic Dog'));
        // await waitFor(() => {
        //     expect(mockNavigate).toHaveBeenCalledWith('ProblamaticDog');
        // });

        fireEvent.press(getByText('App bugs'));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('BugReport');
        });

        fireEvent.press(getByText('Road hazard'));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('RoadReport');
        });
    });
});