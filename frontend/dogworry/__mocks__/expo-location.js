// __mocks__/expo-location.js

export const requestForegroundPermissionsAsync = jest.fn(() => Promise.resolve({ status: 'granted' }));

export const getCurrentPositionAsync = jest.fn(() => 
  Promise.resolve({
    coords: {
      latitude: 31.27179407552312,
      longitude: 34.77245448672832,
    },
  })
);
