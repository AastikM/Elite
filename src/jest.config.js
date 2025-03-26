module.exports = {
  testEnvironment: 'jsdom', // Use JSDOM for browser-like environment
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Transform JS/JSX files using Babel
  },
  transformIgnorePatterns: [
    // Allow Jest to transform specific ES modules (e.g., axios)
    '/node_modules/(?!axios)/',
  ],
  moduleNameMapper: {
    // Map react-router-dom to its CommonJS version
    '^react-router-dom$': '<rootDir>/node_modules/react-router-dom',
  },
};