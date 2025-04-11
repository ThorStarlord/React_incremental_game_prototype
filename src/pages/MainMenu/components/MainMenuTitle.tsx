import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';

interface MainMenuTitleProps {
  title: string;
  subtitle?: string;
  /** Optional MUI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

export function MainMenuTitle({ title, subtitle, sx }: MainMenuTitleProps) {
  return (
    <Box sx={{ textAlign: 'center', mb: 8, ...sx }}>
      <Typography
        variant="h2"
        component="h1"
        fontWeight="bold"
        color="primary.main"
        gutterBottom
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="h6"
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
