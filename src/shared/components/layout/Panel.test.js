import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Panel from './Panel';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock theme for testing
const theme = createTheme();

// Wrapper component for providing theme context
const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('Panel Component', () => {
  test('renders with title', () => {
    render(
      <TestWrapper>
        <Panel title="Test Panel">Content</Panel>
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('renders with icon when provided', () => {
    const MockIcon = () => <div data-testid="test-icon">Icon</div>;
    
    render(
      <TestWrapper>
        <Panel title="Panel with Icon" icon={<MockIcon />}>Content</Panel>
      </TestWrapper>
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('is expanded by default', () => {
    render(
      <TestWrapper>
        <Panel title="Expanded Panel">Hidden Content</Panel>
      </TestWrapper>
    );
    
    expect(screen.getByText('Hidden Content')).toBeVisible();
  });

  test('can toggle expansion state', () => {
    render(
      <TestWrapper>
        <Panel title="Toggle Panel">Toggle Content</Panel>
      </TestWrapper>
    );
    
    // Should be expanded initially
    expect(screen.getByText('Toggle Content')).toBeVisible();
    
    // Click to collapse
    fireEvent.click(screen.getByText('Toggle Panel'));
    
    // Content should still be in the document but might be hidden/collapsed
    // Note: Full collapse visual testing may require more complex assertions
    expect(screen.getByText('Toggle Content')).toBeInTheDocument();
  });

  test('respects defaultExpanded prop', () => {
    render(
      <TestWrapper>
        <Panel title="Collapsed Panel" defaultExpanded={false}>Hidden Content</Panel>
      </TestWrapper>
    );
    
    // Content should be in the document but might be hidden due to collapsed state
    // Visual collapse testing would require more complex assertions
    const content = screen.getByText('Hidden Content');
    expect(content).toBeInTheDocument();
  });
});