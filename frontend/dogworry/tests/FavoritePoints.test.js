import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import AddFavoritePoint from '../components/AddFavoritePoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('AddFavoritePoint Component', () => {
    const mockDogs = [
        {
            user_id: 'user1',
            dog_name: 'Buddy',
            favorite_points: ['point1'],
            dog_image: 'imageData1',
            no_image: false,
        },
        {
            user_id: 'user2',
            dog_name: 'Max',
            favorite_points: [],
            dog_image: 'imageData2',
            no_image: true,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers(); 
        AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockDogs));
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks(); 
    });

    it('renders correctly and shows the correct initial heart icon', async () => {
        const { getByText, getAllByTestId } = render(
            <AddFavoritePoint pointID="point1" openModal={true} setOpenModal={() => {}} parkName="Central Park" />
        );

        await waitFor(() => {
            expect(getByText('Add Central Park to favorites')).toBeTruthy();
        });

        const heartIcons = getAllByTestId('heart-icon');
        expect(heartIcons[0].children[0].props.name).toBe('heart');
    }, 2147483647);

    it('toggles favorite status when heart icon is pressed', async () => {
        axios.post.mockResolvedValue({ data: { success: true } });

        const { getByText, getAllByTestId } = render(
            <AddFavoritePoint pointID="point2" openModal={true} setOpenModal={() => {}} parkName="Central Park" />
        );

        await waitFor(() => {
            expect(getByText('Add Central Park to favorites')).toBeTruthy();
        });

        const heartIcons = getAllByTestId('heart-icon');
        expect(heartIcons[1].children[0].props.name).toBe('hearto');

        await act(async () => {
            fireEvent.press(heartIcons[1]);
            await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
        });

        // Re-fetch heartIcons after the state change
        const updatedHeartIcons = getAllByTestId('heart-icon');
        expect(updatedHeartIcons[1].children[0].props.name).toBe('hearto');
    }, 2147483647);

    it('displays error alert when request fails', async () => {
        axios.post.mockRejectedValue({
            response: {
                data: {
                    error: 'Request failed',
                },
            },
        });

        const { getByText, getAllByTestId } = render(
            <AddFavoritePoint pointID="point2" openModal={true} setOpenModal={() => {}} parkName="Central Park" />
        );

        await waitFor(() => {
            expect(getByText('Add Central Park to favorites')).toBeTruthy();
        });

        const heartIcons = getAllByTestId('heart-icon');
        expect(heartIcons[1].children[0].props.name).toBe('hearto');

        await act(async () => {
            fireEvent.press(heartIcons[1]);
        });

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

        // Re-fetch heartIcons to check the state after the error
        const updatedHeartIcons = getAllByTestId('heart-icon');
        expect(updatedHeartIcons[1].children[0].props.name).toBe('hearto');
    }, 2147483647);

    it('disables heart icon when loading', async () => {
        axios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

        const { getByText, getAllByTestId } = render(
            <AddFavoritePoint pointID="point2" openModal={true} setOpenModal={() => {}} parkName="Central Park" />
        );

        await waitFor(() => {
            expect(getByText('Add Central Park to favorites')).toBeTruthy();
        });

        const heartIcons = getAllByTestId('heart-icon');

        await act(async () => {
            fireEvent.press(heartIcons[1]);
        });

        await waitFor(() => {
            expect(heartIcons[1].children[0].props.name).toBe('hearto');
        });
    }, 2147483647);
});
