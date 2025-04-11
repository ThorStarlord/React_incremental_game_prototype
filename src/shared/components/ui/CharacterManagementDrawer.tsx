import React from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Divider,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CharacterManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
  width?: number | string;
}

/**
 * CharacterManagementDrawer Component
 * 
 * A sidebar drawer for character management screens using Material UI styling.
 * 
 * @param {boolean} isOpen - Whether the drawer is visible
 * @param {Function} onClose - Handler for closing the drawer
 * @param {ReactNode} children - Content to display inside the drawer
 * @param {string} title - Optional title for the drawer
 * @param {number|string} width - Optional width for the drawer
 * @returns {JSX.Element} The rendered component
 */
const CharacterManagementDrawer: React.FC<CharacterManagementDrawerProps> = ({
  isOpen,
  onClose,
  children,
  title = "Character Management",
  width = 320
}) => {
  const theme = useTheme();
  
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          boxShadow: theme.shadows[5],
        },
      }}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ 
        overflow: 'auto',
        flex: 1,
        p: 2
      }}>
        {children}
      </Box>
    </Drawer>
  );
};

export default CharacterManagementDrawer;
