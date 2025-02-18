import { render } from '@testing-library/react';
import App from './App';

test('renders game container', () => {
  render(<App />);
  // Basic smoke test to ensure App renders without crashing
  expect(document.querySelector('.game-container')).toBeTruthy();
});
