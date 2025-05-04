import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App'; // Import your App component

// Mock the useApi hook to provide mock data
jest.mock('./ApiContext', () => ({
  useApi: () => ({
    data: [
      // Your mock data here
      { id: 1, title: 'Book 1' },
      { id: 2, title: 'Book 2' },
    ],
    loading: false,
  }),
}));

test('renders App component with data', () => {
  render(<App />);

  // Verify that the component renders without errors
  expect(screen.getByText('Book Extracts from Pan Macmillan')).toBeInTheDocument();

  // You can add more assertions to check other parts of your component
  expect(screen.getByText('Book 1')).toBeInTheDocument();
  expect(screen.getByText('Book 2')).toBeInTheDocument();
});

test('renders Loader when loading is true', () => {
  // Mock the useApi hook to simulate loading
  jest.mock('./ApiContext', () => ({
    useApi: () => ({
      data: [],
      loading: true,
    }),
  }));

  render(<App />);

  // Verify that the loader is displayed when loading is true
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
