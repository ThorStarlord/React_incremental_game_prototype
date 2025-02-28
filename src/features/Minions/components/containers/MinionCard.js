import React, { useState, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Switch,
  FormControlLabel,
  LinearProgress,
  Divider
} from '@mui/material';
import AssistantIcon from '@mui/icons-material/Assistant';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WorkIcon from '@mui/icons-material/Work';
import ExploreIcon from '@mui/icons-material/Explore';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { GameDispatchContext } from '../context/GameStateContext';

const MinionCard = ({ minion }) => {
  const dispatch = useContext(GameDispatchContext);
  
  // Set task handler
  const setTask = (minionId, task) => {
    dispatch({
      type: 'SET_MINION_TASK',
      payload: { minionId, task }
    });
  };
  
  // Toggle independence handler
  const toggleIndependence = (minionId, isIndependent) => {
    dispatch({
      type: 'SET_MINION_INDEPENDENCE',
      payload: { minionId, isIndependent }
    });
    
    // If becoming independent, automatically set a task
    if (isIndependent) {
      const tasks = ['gather', 'explore', 'train'];
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      setTask(minionId, randomTask);
    }
  };
  
  // Get task description
  const getTaskDescription = (task) => {
    switch (task) {
      case 'gather': return 'Gathering resources';
      case 'explore': return 'Exploring the area';
      case 'train': return 'Training skills';
      case 'assist': return 'Assisting you';
      default: return 'Idle';
    }
  };
  
  // Get task icon
  const getTaskIcon = (task) => {
    switch (task) {
      case 'gather': return <WorkIcon fontSize="small" />;
      case 'explore': return <ExploreIcon fontSize="small" />;
      case 'train': return <FitnessCenterIcon fontSize="small" />;
      case 'assist': return <AssistantIcon fontSize="small" />;
      default: return null;
    }
  };
  
  // Get relationship color
  const getRelationshipColor = (value) => {
    if (value >= 80) return 'success.main';
    if (value >= 50) return 'info.main';
    if (value >= 30) return 'warning.main';
    return 'error.main';
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: minion.isIndependent ? '2px solid' : 'none',
        borderColor: 'warning.main' 
      }}
    >
      {minion.isIndependent && (
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          bgcolor: 'warning.main',
          color: 'white',
          px: 1,
          py: 0.25,
          borderBottomLeftRadius: 4
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <AutoFixHighIcon fontSize="small" sx={{ mr: 0.5 }} />
            Independent
          </Typography>
        </Box>
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{minion.name}</Typography>
          <Chip 
            label={minion.type} 
            size="small" 
            color="primary" 
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Level {minion.level}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Strength: {minion.strength.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intelligence: {minion.intelligence.toFixed(1)}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Relationship:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: getRelationshipColor(minion.relationship) }}
            >
              {minion.relationship}/100
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={minion.relationship} 
            sx={{ 
              mt: 0.5,
              height: 6, 
              borderRadius: 1,
              bgcolor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                bgcolor: getRelationshipColor(minion.relationship)
              }
            }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Task:
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getTaskIcon(minion.task)}
            <Typography variant="body1" sx={{ ml: 1 }}>
              {getTaskDescription(minion.task)}
            </Typography>
          </Box>
          
          {(minion.task !== 'idle' && minion.task !== 'assist') && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Progress:
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.floor(minion.taskProgress || 0)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={minion.taskProgress || 0} 
                sx={{ height: 4, borderRadius: 1 }}
              />
            </Box>
          )}
        </Box>
      </CardContent>
      
      <CardActions sx={{ flexDirection: 'column', alignItems: 'stretch', p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => setTask(minion.id, 'gather')}
            disabled={minion.isIndependent}
            startIcon={<WorkIcon />}
          >
            Gather
          </Button>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => setTask(minion.id, 'explore')}
            disabled={minion.isIndependent}
            startIcon={<ExploreIcon />}
          >
            Explore
          </Button>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => setTask(minion.id, 'train')}
            disabled={minion.isIndependent}
            startIcon={<FitnessCenterIcon />}
          >
            Train
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button 
            size="small" 
            color="primary" 
            variant={minion.task === 'assist' ? 'contained' : 'outlined'} 
            onClick={() => setTask(minion.id, 'assist')}
            disabled={minion.isIndependent}
          >
            Assist Me
          </Button>
          
          <FormControlLabel
            control={
              <Switch
                checked={minion.isIndependent}
                onChange={() => toggleIndependence(minion.id, !minion.isIndependent)}
                color="warning"
              />
            }
            label="Act Independently"
          />
        </Box>
      </CardActions>
    </Card>
  );
};

export default MinionCard;