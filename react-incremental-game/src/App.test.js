import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main menu', () => {
  render(<App />);
  const linkElement = screen.getByText(/main menu/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders settings page', () => {
  render(<App />);
  const settingsElement = screen.getByText(/settings/i);
  expect(settingsElement).toBeInTheDocument();
});