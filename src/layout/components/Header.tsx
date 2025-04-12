import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
} from '@mui/material';

/**
 * Props for the Header component
 */
interface HeaderProps {
  /** Title displayed in the header */
  title?: string;
}

/**
 * Minimalist Header Component
 * 
 * @component
 * @description
 * Displays only the game title as per REQ-UI-013.
 * 
 * @example
 * return (
 *   <Header title="My Game" />
 * )
 */
const Header: React.FC<HeaderProps> = ({ 
  title = 'Incremental RPG', 
}) => {
    return (
        <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    flexGrow: 1, 
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
