import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  status?: 'planned' | 'in-progress' | 'coming-soon';
  estimatedCompletion?: string;
  features?: string[];
}

/**
 * Reusable placeholder component for unimplemented features
 * Provides consistent styling and information about development status
 */
export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  status = 'planned',
  estimatedCompletion,
  features = [],
}) => {
  const theme = useTheme();

  const statusConfig = {
    planned: {
      color: theme.palette.info.main,
      label: 'Planned',
      icon: <ScheduleIcon />,
    },
    'in-progress': {
      color: theme.palette.warning.main,
      label: 'In Progress',
      icon: <ConstructionIcon />,
    },
    'coming-soon': {
      color: theme.palette.success.main,
      label: 'Coming Soon',
      icon: <ScheduleIcon />,
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Status Icon */}
        <Box
          sx={{
            mb: 2,
            color: currentStatus.color,
            '& .MuiSvgIcon-root': {
              fontSize: '3rem',
            },
          }}
        >
          {currentStatus.icon}
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>

        {/* Status Chip */}
        <Chip
          label={currentStatus.label}
          sx={{
            mb: 3,
            backgroundColor: currentStatus.color,
            color: theme.palette.getContrastText(currentStatus.color),
            fontWeight: 500,
          }}
        />

        {/* Description */}
        {description && (
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        )}

        {/* Estimated Completion */}
        {estimatedCompletion && (
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: theme.palette.text.secondary,
              fontStyle: 'italic',
            }}
          >
            Estimated completion: {estimatedCompletion}
          </Typography>
        )}

        {/* Planned Features */}
        {features.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            >
              Planned Features:
            </Typography>
            <Box
              component="ul"
              sx={{
                textAlign: 'left',
                color: theme.palette.text.secondary,
                '& li': {
                  mb: 0.5,
                },
              }}
            >
              {features.map((feature, index) => (
                <li key={index}>
                  <Typography variant="body2">{feature}</Typography>
                </li>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PlaceholderPage;
