import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import UserDetails from '../screens/user/UserDetails'; // Adjust the path according to your project structure
import axios from 'axios';

// Mock axios for API calls
jest.mock('@firebase/auth', () => ({
    getAuth: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
  }));
jest.mock('axios');
jest.mock('../fbauth', () => ({}));

const mockData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@example.com',
    phone_number: '1234567890',
    avatar: '',
};

// Mock ImagePicker component
jest.mock('../components/ImagePicker', () => {
    return jest.fn(() => Promise.resolve({
        canceled: false,
        assets: [{ base64: 'image-base64' }],
    }));
});

const renderWithNavigation = (component) => {
    return render(
        <NavigationContainer>
            {component}
        </NavigationContainer>
    );
};

describe('UserDetails Component', () => {
    beforeEach(() => {
        jest.useFakeTimers(); // Use fake timers to control async operations
        axios.post.mockResolvedValueOnce({ data: mockData, status: 200 });
    });

    afterEach(() => {
        jest.useRealTimers();
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
    }, 10000);

    it('updates the first name', async () => {
        const { getByText, getByDisplayValue } = renderWithNavigation(<UserDetails />);

        await waitFor(() => {
            expect(getByDisplayValue('John')).toBeTruthy();
        });

        const firstNameInput = getByDisplayValue('John');
        const editButton = getByText('Edit Details');

        await waitFor(async () => {
            fireEvent.press(editButton);
        });
        fireEvent.changeText(firstNameInput, 'Jane');

        await waitFor(() => {
            expect(firstNameInput.props.value).toBe('Jane');
        });
    });

    it('shows an alert for invalid email', async () => {
        const { getByText, getByDisplayValue } = renderWithNavigation(<UserDetails />);

        await waitFor(() => {
            expect(getByDisplayValue('johndoe@example.com')).toBeTruthy();
        });

        const emailInput = getByDisplayValue('johndoe@example.com');
        const editButton = getByText('Edit Details');

        await waitFor(async () => {
            fireEvent.press(editButton);
        });
        fireEvent.changeText(emailInput, 'invalid-email');
        fireEvent(emailInput, 'blur');

        await waitFor(() => {
            expect(emailInput.props.value).toBe('');
        });
    });

    it('selects an image', async () => {
        const { getByText } = renderWithNavigation(<UserDetails />);

        await waitFor(() => {
            expect(getByText('Profile Picture')).toBeTruthy();
        });

        const profilePictureButton = getByText('Profile Picture');

        await waitFor(async () => {
            fireEvent.press(profilePictureButton);
        });

        await waitFor(() => {
            // Assuming the image URI is displayed somewhere
            expect(getByText('Profile Picture')).toBeTruthy();
        });
    });
});

//from here test for guest registration
import RegisterScreen from '../screens/user/guestRegistration';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

describe('RegisterScreen', () => {
    const mockNavigation = { reset: jest.fn() };
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert').mockImplementation(() => {});
        getAuth.mockReturnValue({
            currentUser: { uid: 'mockUid123' },
        });
        createUserWithEmailAndPassword.mockResolvedValue({
            user: { uid: 'mockUid123' },
        });
        axios.post.mockResolvedValue({ status: 200 });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation(<RegisterScreen />);
    
    // Check if essential elements are rendered
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    //expect(getByText('Sign in with Google')).toBeTruthy();
    expect(getByText('Sign in with e-mail and password')).toBeTruthy();
  });

  it('handles email input correctly', () => {
    const { getByPlaceholderText } = renderWithNavigation(<RegisterScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');

    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('handles password input correctly', () => {
    const { getByPlaceholderText } = renderWithNavigation(<RegisterScreen navigation={mockNavigation} />);
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(passwordInput, 'password123');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('handles confirm password input correctly', () => {
    const { getByPlaceholderText } = renderWithNavigation(<RegisterScreen navigation={mockNavigation} />);
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');

    fireEvent.changeText(confirmPasswordInput, 'password123');
    expect(confirmPasswordInput.props.value).toBe('password123');
  });

  it('matches passwords correctly', async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation(<RegisterScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    const signInButton = getByText('Sign in with e-mail and password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Registered successfully!');
    });
  });

  it('handles Firebase registration correctly', async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation(<RegisterScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    const signInButton = getByText('Sign in with e-mail and password');

    await waitFor(() => {
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    fireEvent.press(signInButton);
    })

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('user/saveUserDetails'), {
        user_id: 'mockUid123',
        email: 'test@example.com',
      });
    });
  });
});

