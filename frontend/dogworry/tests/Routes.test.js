import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import GetRoutes from '../components/Routes'; // Adjust the path according to your project structure
import axios from 'axios';

jest.mock('axios');

const mockRoutes = {
  routes: [
    {
      route_name: 'Route 1',
      route: [
        [34.0522, -118.2437],
        [34.0522, -118.2436],
      ],
    },
    {
      route_name: 'Route 2',
      route: [
        [34.0523, -118.2437],
        [34.0523, -118.2436],
      ],
    },
  ],
};

describe('GetRoutes Component', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: mockRoutes, status: 200 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays routes when the button is pressed', async () => {
    const currentCoordinates = [34.0522, -118.2437];
    const setRoute = jest.fn();

    const { getByText } = render(<GetRoutes currentCoordinates={currentCoordinates} setRoute={setRoute} />);

    await act(async () => {
      fireEvent.press(getByText('Find Walking Routes'));

      await waitFor(() => {
        expect(getByText('Route 1')).toBeTruthy();
        expect(getByText('Route 2')).toBeTruthy();
      });
    });
  });

  it('allows selecting a route', async () => {
    const currentCoordinates = [34.0522, -118.2437];
    const setRoute = jest.fn();

    const { getByText } = render(<GetRoutes currentCoordinates={currentCoordinates} setRoute={setRoute} />);

    await act(async () => {
      fireEvent.press(getByText('Find Walking Routes'));

      await waitFor(() => {
        expect(getByText('Route 1')).toBeTruthy();
        expect(getByText('Route 2')).toBeTruthy();
      });

      fireEvent.press(getByText('Route 1'));

      await waitFor(() => {
        expect(setRoute).toHaveBeenCalledWith([
          { latitude: 34.0522, longitude: -118.2437 },
          { latitude: 34.0522, longitude: -118.2436 },
        ]);
      });
    });
  });

  it('confirm selected walking path', async () => {
    const currentCoordinates = [34.0522, -118.2437];
    const setRoute = jest.fn();

    const { getByText } = render(<GetRoutes currentCoordinates={currentCoordinates} setRoute={setRoute} />);

    await act(async () => {
      fireEvent.press(getByText('Find Walking Routes'));

      await waitFor(() => {
        expect(getByText('Route 1')).toBeTruthy();
        expect(getByText('Route 2')).toBeTruthy();
      });

      fireEvent.press(getByText('Route 1'));

      await waitFor(() => {
        expect(setRoute).toHaveBeenCalledWith([
          { latitude: 34.0522, longitude: -118.2437 },
          { latitude: 34.0522, longitude: -118.2436 },
        ]);
      });

      await act(async () => {
        fireEvent.press(getByText('Lets Walk!'));

        await waitFor(() => {
          expect(getByText('Stop Walk')).toBeTruthy();
        });
      });
    });
  });

  it('stop walk alert showing', async () => {
    const currentCoordinates = [34.0522, -118.2437];
    const setRoute = jest.fn();

    const { getByText } = render(<GetRoutes currentCoordinates={currentCoordinates} setRoute={setRoute} />);

    await act(async () => {
      fireEvent.press(getByText('Find Walking Routes'));

      await waitFor(() => {
        expect(getByText('Route 1')).toBeTruthy();
        expect(getByText('Route 2')).toBeTruthy();
      });

      fireEvent.press(getByText('Route 1'));

      await waitFor(() => {
        expect(setRoute).toHaveBeenCalledWith([
          { latitude: 34.0522, longitude: -118.2437 },
          { latitude: 34.0522, longitude: -118.2436 },
        ]);
      });

      fireEvent.press(getByText('Lets Walk!'));

      await waitFor(() => {
        fireEvent.press(getByText('Stop Walk'));

        expect(getByText('Are you sure you want to stop the current walking route?')).toBeTruthy();
      });
    });
  });

  it('stop walk', async () => {
    const currentCoordinates = [34.0522, -118.2437];
    const setRoute = jest.fn();

    const { getByText } = render(<GetRoutes currentCoordinates={currentCoordinates} setRoute={setRoute} />);

    await act(async () => {
      fireEvent.press(getByText('Find Walking Routes'));

      await waitFor(() => {
        expect(getByText('Route 1')).toBeTruthy();
        expect(getByText('Route 2')).toBeTruthy();
      });

      fireEvent.press(getByText('Route 1'));

      await waitFor(() => {
        expect(setRoute).toHaveBeenCalledWith([
          { latitude: 34.0522, longitude: -118.2437 },
          { latitude: 34.0522, longitude: -118.2436 },
        ]);
      });

      fireEvent.press(getByText('Lets Walk!'));

      await waitFor(() => {
        fireEvent.press(getByText('Stop Walk'));

        expect(getByText('Are you sure you want to stop the current walking route?')).toBeTruthy();
      });

      fireEvent.press(getByText('Yes'));

      await waitFor(() => {
        expect(getByText('Find Walking Routes')).toBeTruthy();
      });
    });
  });

  it('cancel stop walk', async () => {
    const currentCoordinates = [34.0522, -118.2437];
    const setRoute = jest.fn();

    const { getByText } = render(<GetRoutes currentCoordinates={currentCoordinates} setRoute={setRoute} />);

    await act(async () => {
      fireEvent.press(getByText('Find Walking Routes'));

      await waitFor(() => {
        expect(getByText('Route 1')).toBeTruthy();
        expect(getByText('Route 2')).toBeTruthy();
      });

      fireEvent.press(getByText('Route 1'));

      await waitFor(() => {
        expect(setRoute).toHaveBeenCalledWith([
          { latitude: 34.0522, longitude: -118.2437 },
          { latitude: 34.0522, longitude: -118.2436 },
        ]);
      });

      fireEvent.press(getByText('Lets Walk!'));
      
      await waitFor(() => {
        fireEvent.press(getByText('Stop Walk'));

        expect(getByText('Are you sure you want to stop the current walking route?')).toBeTruthy();
      });

      await act(async () =>{
        fireEvent.press(getByText('No'));
      })
      
      await waitFor(() => {
        expect(getByText('Stop Walk')).toBeTruthy();
      });
    });
  });
});
