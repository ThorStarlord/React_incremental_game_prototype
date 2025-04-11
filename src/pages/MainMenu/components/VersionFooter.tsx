import React from 'react';
// Import Box, Typography, Chip, SxProps, Theme from MUI
import { Box, Typography, Chip, SxProps, Theme } from '@mui/material'; 

interface VersionFooterProps {
  version: string;
  shortcuts?: Array<{
    key: string;
    description: string;
    modifiers?: string;
  }>;
  /** Optional MUI sx prop for custom styling */
  sx?: SxProps<Theme>; 
}

export function VersionFooter({ version, shortcuts = [], sx }: VersionFooterProps) {
  return (
    // Replace div with Box and apply sx prop
    <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 8, ...sx }}> 
      <Typography variant="body2">Version {version}</Typography>
      
      {shortcuts.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" display="block" sx={{ mb: 1 }}>
            Keyboard Shortcuts:
          </Typography>
          {/* Use Box for flex layout */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: 2 // Use gap for spacing
            }}
          >
            {shortcuts.map((shortcut, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                {shortcut.modifiers && (
                  <Typography variant="caption" sx={{ mr: 0.5 }}>
                    {shortcut.modifiers}+
                  </Typography>
                )}
                {/* Replace kbd with MUI Chip */}
                <Chip 
                  label={shortcut.key} 
                  size="small" 
                  sx={{ 
                    height: 20, 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold', 
                    fontFamily: 'monospace',
                    bgcolor: 'action.hover' // Use theme color
                  }} 
                />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {shortcut.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
