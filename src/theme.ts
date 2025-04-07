import { createTheme } from '@mui/material/styles';

// Create a basic theme with customizations
const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db', // Match the primary color from shared.module.css
    },
    secondary: {
      main: '#2ecc71', // Match the secondary color from shared.module.css
    },
    background: {
      default: '#ecf0f1', // Match the background color from shared.module.css
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50', // Match the text color from shared.module.css
    },
  },
  shape: {
    borderRadius: 5, // Match the border radius from shared.module.css
  },
  typography: {
    fontFamily: "'Arial', sans-serif", // Match the font family from shared.module.css
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents uppercase text in buttons
          transition: '0.3s', // Match transition speed from shared.module.css
        },
      },
    },
  },
});

export default theme;
