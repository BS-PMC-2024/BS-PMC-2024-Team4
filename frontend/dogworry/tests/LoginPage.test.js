import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../screens/LoginScreen';
import { Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the dependencies
jest.mock('@firebase/auth', () => ({
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
  }));
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../fbauth', () => ({}));

describe('LoginForm', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginForm navigation={mockNavigation} />);
    
    expect(getByText('Welcome back!!')).toBeTruthy();
    expect(getByPlaceholderText('EMAIL')).toBeTruthy();
    expect(getByPlaceholderText('PASSWORD')).toBeTruthy();
    expect(getByText('LOGIN')).toBeTruthy();
  });

  it('updates email and password inputs', () => {
    const { getByPlaceholderText } = render(<LoginForm navigation={mockNavigation} />);
    
    const emailInput = getByPlaceholderText('EMAIL');
    const passwordInput = getByPlaceholderText('PASSWORD');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('handles successful login', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    getAuth.mockReturnValue({});
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    const { getByText, getByPlaceholderText } = render(<LoginForm navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('EMAIL'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('PASSWORD'), 'password123');
    fireEvent.press(getByText('LOGIN'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userUid', '123');
      expect(Alert.alert).toHaveBeenCalledWith("Login Successful", `Welcome test@example.com`);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Main');
    });
  });

  it('handles login failure', async () => {
    const errorMessage = 'Invalid credentials';
    getAuth.mockReturnValue({});
    signInWithEmailAndPassword.mockRejectedValue({ message: errorMessage });

    const { getByText, getByPlaceholderText } = render(<LoginForm navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('EMAIL'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('PASSWORD'), 'wrongpassword');
    fireEvent.press(getByText('LOGIN'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'wrongpassword');
      expect(Alert.alert).toHaveBeenCalledWith("Login Failed", errorMessage);
    });
  });

  
  

  it('shows forgot password alert', () => {
    const { getByText } = render(<LoginForm navigation={mockNavigation} />);
    
    fireEvent.press(getByText('Forgot Password?'));

    expect(Alert.alert).toHaveBeenCalledWith("Forget Password!");
  });
});