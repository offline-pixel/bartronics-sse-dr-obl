// ApiContext.test.js
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { ApiProvider, useApi } from '../ApiContext'; // Import your context and hooks

// Mock the fetch function to simulate API responses
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: 'Example Data' }]), // Adjust data as needed
  })
);

// Define a test component that uses the useApi hook
function TestComponent() {
  const { data, loading } = useApi();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>API Data:</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

test('fetches data and renders it correctly', async () => {
  render(
    <ApiProvider>
      <TestComponent />
    </ApiProvider>
  );

  // Wait for the data to be fetched and the component to render
  await waitFor(() => {
    expect(screen.getByText('Loading...')).toBeInTheDocument(); // Check if loading text is shown
  });

  // Data should now be fetched and rendered
  expect(screen.getByText('API Data:')).toBeInTheDocument();
  expect(screen.getByText('Example Data')).toBeInTheDocument();
});
