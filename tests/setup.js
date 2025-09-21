// Test setup file
import { jest } from '@jest/globals';

// Mock global fetch function for testing
global.fetch = jest.fn();

// Mock AbortController
global.AbortController = jest.fn(() => ({
  signal: {},
  abort: jest.fn()
}));

// Reset mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
  document.body.innerHTML = '';
});