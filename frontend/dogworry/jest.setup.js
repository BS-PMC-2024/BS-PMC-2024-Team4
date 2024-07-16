import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

module.exports = {
    // Existing config settings...
    transformIgnorePatterns: [
      "node_modules/(?!(firebase|@firebase))",  
      "node_modules/(?!(jest-)?react-native|react|@react-navigation|@expo/vector-icons/)",
      "node_modules/(?!(expo-status-bar|expo)/)",
      "node_modules/(?!(@react-native|react-native|expo(nent)?|@expo(nent)?/.*)/)"
    ],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",  // Ensure your project is set up to use babel-jest for transformation
      },
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect']
  };
  