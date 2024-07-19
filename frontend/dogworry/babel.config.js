module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'module:metro-react-native-babel-preset',
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-transform-flow-strip-types',
      ['@babel/plugin-proposal-class-properties', { "loose": true }],
      ['@babel/plugin-transform-private-methods', { "loose": true }],
      ['@babel/plugin-proposal-private-property-in-object', { "loose": true }],
      '@babel/plugin-transform-runtime',
      'react-native-reanimated/plugin'
    ]
  };
};
