import '@testing-library/jest-dom/extend-expect';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEnabled(): R;
      toBeInTheDocument(): R;
    }
  }
}

export {};
