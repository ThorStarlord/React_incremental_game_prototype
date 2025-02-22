// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock MaterialUI components that might cause issues in tests
jest.mock('@mui/material', () => ({
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }) => <span {...props}>{children}</span>,
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  Accordion: ({ children, ...props }) => <div {...props}>{children}</div>,
  AccordionSummary: ({ children, ...props }) => <button {...props}>{children}</button>,
  AccordionDetails: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

// Mock the ExpandMoreIcon
jest.mock('@mui/icons-material/ExpandMore', () => () => <span>expand</span>);
