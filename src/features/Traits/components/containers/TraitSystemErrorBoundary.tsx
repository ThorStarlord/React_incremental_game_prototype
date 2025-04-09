import React, { ErrorInfo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Interface for TraitSystemErrorBoundary props
 * 
 * @interface TraitSystemErrorBoundaryProps
 * @property {React.ReactNode} children - Child components to be rendered
 */
interface TraitSystemErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Interface for TraitSystemErrorBoundary state
 * 
 * @interface TraitSystemErrorBoundaryState
 * @property {boolean} hasError - Whether an error has been caught
 */
interface TraitSystemErrorBoundaryState {
  hasError: boolean;
}

/**
 * TraitSystemErrorBoundary Component
 * 
 * Error boundary component that catches errors in the trait system
 * and displays a fallback UI when errors occur.
 */
class TraitSystemErrorBoundary extends React.Component<
  TraitSystemErrorBoundaryProps,
  TraitSystemErrorBoundaryState
> {
  constructor(props: TraitSystemErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TraitSystemErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Trait System Error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Box 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'error.main',
            borderRadius: 1
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong with the trait system
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={this.handleRetry}
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default TraitSystemErrorBoundary;
