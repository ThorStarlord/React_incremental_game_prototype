import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

class TraitSystemErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Trait System Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
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