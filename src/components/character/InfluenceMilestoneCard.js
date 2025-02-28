import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const InfluenceMilestoneCard = ({ milestone, unlocked, current }) => {
  return (
    <Card 
      variant={current ? "elevation" : "outlined"}
      elevation={current ? 3 : 1}
      sx={{ 
        height: '100%',
        borderColor: unlocked ? 'success.main' : current ? 'primary.main' : 'divider',
        borderWidth: (unlocked || current) ? 2 : 1,
        bgcolor: unlocked ? 'success.50' : 'background.paper'
      }}
    >
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 1 
        }}>
          <Typography variant="h6">{milestone.level}%</Typography>
          {unlocked ? (
            <Chip 
              icon={<LockOpenIcon />}
              label="Unlocked" 
              size="small" 
              color="success" 
            />
          ) : current ? (
            <Chip 
              label="Next" 
              size="small" 
              color="primary" 
            />
          ) : (
            <Chip 
              icon={<LockIcon />}
              label="Locked" 
              size="small" 
              color="default"
              variant="outlined"
            />
          )}
        </Box>
        
        <Typography variant="subtitle1" gutterBottom>
          {milestone.feature}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {milestone.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfluenceMilestoneCard;