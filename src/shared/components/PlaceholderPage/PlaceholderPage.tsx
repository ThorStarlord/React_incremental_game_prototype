import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Alert, 
  AlertTitle,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Build as BuildIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

export interface PlaceholderPageProps {
  /** Title of the feature/page */
  title: string;
  /** Description message */
  message: string;
  /** Development status */
  status: 'planned' | 'in-development' | 'implemented' | 'coming-soon';
  /** Timeline information */
  timeline?: string;
  /** List of planned features */
  features?: string[];
  /** Additional details */
  details?: string;
}

/**
 * PlaceholderPage component - Reusable placeholder for unimplemented features
 * 
 * Features:
 * - Consistent placeholder messaging
 * - Development status indicators
 * - Feature roadmap display
 * - Timeline information
 * - Professional appearance matching game UI
 */
export const PlaceholderPage: React.FC<PlaceholderPageProps> = React.memo(({
  title,
  message,
  status,
  timeline,
  features = [],
  details
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'implemented': return 'success';
      case 'in-development': return 'warning';
      case 'coming-soon': return 'info';
      case 'planned': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'implemented': return <CheckCircleIcon />;
      case 'in-development': return <BuildIcon />;
      case 'coming-soon': return <ScheduleIcon />;
      case 'planned': return <VisibilityIcon />;
      default: return <InfoIcon />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'implemented': return 'Implemented';
      case 'in-development': return 'In Development';
      case 'coming-soon': return 'Coming Soon';
      case 'planned': return 'Planned';
      default: return 'Unknown';
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ mb: 3 }}
      >
        {title}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip
              icon={getStatusIcon()}
              label={getStatusLabel()}
              color={getStatusColor()}
              variant="outlined"
              sx={{ mr: 2 }}
            />
            {timeline && (
              <Typography variant="body2" color="text.secondary">
                {timeline}
              </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {message}
          </Typography>

          {details && (
            <Typography variant="body2" color="text.secondary">
              {details}
            </Typography>
          )}
        </CardContent>
      </Card>

      {features.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Planned Features
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {features.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <InfoIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Alert severity="info" sx={{ mt: 3 }}>
        <AlertTitle>Development Progress</AlertTitle>
        This feature is part of the ongoing development roadmap. Check back for updates 
        as new functionality becomes available.
      </Alert>
    </Box>
  );
});

PlaceholderPage.displayName = 'PlaceholderPage';

export default PlaceholderPage;
