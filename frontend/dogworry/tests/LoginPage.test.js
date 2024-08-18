import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../screens/LoginScreen';
import { Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// Mock the dependencies
jest.mock('@firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(),
}));
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../fbauth', () => ({}));
jest.mock('axios');
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('LoginForm', () => {
  let mockNavigation;

  beforeEach(() => {
    mockNavigation = { 
      navigate: jest.fn(), 
      goBack: jest.fn() 
    };
    jest.clearAllMocks();
    getAuth.mockReturnValue({});
    useNavigation.mockReturnValue(mockNavigation);
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginForm navigation={mockNavigation} />);
    
    expect(getByText('Welcome back!!')).toBeTruthy();
    expect(getByPlaceholderText('EMAIL')).toBeTruthy();
    expect(getByPlaceholderText('PASSWORD')).toBeTruthy();
    expect(getByText('LOGIN')).toBeTruthy();
  }, 2147483647);

  it('updates email and password inputs', () => {
    const { getByPlaceholderText } = render(<LoginForm navigation={mockNavigation} />);
    
    const emailInput = getByPlaceholderText('EMAIL');
    const passwordInput = getByPlaceholderText('PASSWORD');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  }, 2147483647);

  it('handles successful login', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    const setAvatar = jest.fn();
    const setName = jest.fn();

    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => ['', setAvatar]) // Mock setAvatar
      .mockImplementationOnce(() => ['', setName]);  // Mock setName
    
    getAuth.mockReturnValue({});
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    axios.post.mockResolvedValueOnce({ data: { avatar: 'avatar' }, status: 200 });

    const { getByText, getByPlaceholderText } = render(
      <LoginForm navigation={mockNavigation} setAvatar={setAvatar} setName={setName} />
    );

    fireEvent.changeText(getByPlaceholderText('EMAIL'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('PASSWORD'), 'password123');
    fireEvent.press(getByText('LOGIN'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userUid', '123');
      expect(Alert.alert).toHaveBeenCalledWith("Login Successful", `Welcome test@example.com`);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Main');
    });
  }, 2147483647);

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
  }, 2147483647);

  it('opens reset password modal when "Forgot Password?" is pressed', () => {
    const { getByText, getByPlaceholderText } = render(<LoginForm navigation={mockNavigation} />);
    
    // Trigger the "Forgot Password?" press
    fireEvent.press(getByText('Forgot Password?'));

    // Check if the modal elements are displayed
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByText('Send Reset Email')).toBeTruthy();
  });

  it('sends a reset email when a valid email is entered', async () => {
    const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(<LoginForm navigation={mockNavigation} />);
  
    // Trigger the "Forgot Password?" press
    fireEvent.press(getByText('Forgot Password?'));
  
    // Enter an email address
    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'test@example.com');
  
    // Press the "Send Reset Email" button
    fireEvent.press(getByText('Send Reset Email'));
  
    // Assert that sendPasswordResetEmail was called with the correct email
    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'test@example.com');
    });
  
    // Check if the modal is closed by ensuring the modal input is no longer in the DOM
    await waitFor(() => {
      expect(queryByPlaceholderText('Enter your email')).toBeNull();
    });
  });

  it('shows an error if email is not entered for password reset', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<LoginForm navigation={mockNavigation} />);

    // Trigger the "Forgot Password?" press
    fireEvent.press(getByText('Forgot Password?'));

    // Do not enter any email address

    // Press the "Send Reset Email" button
    fireEvent.press(getByText('Send Reset Email'));

    // Check if the Alert is shown (this depends on how you handle alerts)
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Reset Password", "Please enter your email address.");
    });
  }, 2147483647);

});


