import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

/**
 * Interface for relationship tier
 */
interface RelationshipTier {
  name: string;
  threshold: number;
  color: string;
  description: string;
}

/**
 * Interface for minion data
 */
interface Minion {
  id: string;
  name: string;
  type: string;
  level: number;
  experience: number;
  traits: string[];
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    endurance: number;
    [key: string]: number;
  };
  skills: {
    [key: string]: number;
  };
  tasks: string[];
  relationship: number;
  maturity: number;
  happiness: number;
  energy: number;
  lastFed?: number;
  createdAt: number;
}

/**
 * Interface for MinionCard props
 */
interface MinionCardProps {
  minion: Minion;
  relationshipTier: RelationshipTier;
  assignedTasks: string[];
  isImmature?: boolean;
  onAssignTask: (taskId: string) => void;
  onShareTrait: (traitId: string) => void;
  onRemoveTrait: (traitId: string) => void;
  onAssignTrait: (minionId: string) => void;
  onShareSlot: (sourceId: string, targetId: string) => void;
  onDelete: () => void;
}

/**
 * MinionCard component to display a minion's information and actions
 */
const MinionCard: React.FC<MinionCardProps> = ({
  minion,
  relationshipTier,
  assignedTasks,
  isImmature = false,
  onAssignTask,
  onShareTrait,
  onRemoveTrait,
  onAssignTrait,
  onShareSlot,
  onDelete
}) => {
  // Calculate days since creation
  const daysSinceCreation = Math.floor((Date.now() - minion.createdAt) / (1000 * 60 * 60 * 24));
  
  // Get formatted stats
  const statsList = Object.entries(minion.stats).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));
  
  return (
    <Card 
      sx={{ 
        position: 'relative',
        borderTop: `3px solid ${relationshipTier.color}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }
      }}
    >
      {isImmature && (
        <Chip 
          label="Immature" 
          color="warning" 
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10,
            opacity: 0.8
          }} 
        />
      )}
      
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {minion.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Level {minion.level} {minion.type}
            </Typography>
          </Box>
          
          <Chip 
            label={relationshipTier.name} 
            sx={{ 
              backgroundColor: relationshipTier.color,
              color: '#000'
            }} 
          />
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Maturity
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={minion.maturity} 
            sx={{ 
              height: 10, 
              borderRadius: 1,
              mb: 0.5
            }} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">
              {minion.maturity}%
            </Typography>
            <Typography variant="caption">
              Age: {daysSinceCreation} days
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Energy
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={minion.energy} 
            color={minion.energy > 70 ? "success" : minion.energy > 30 ? "warning" : "error"}
            sx={{ 
              height: 10, 
              borderRadius: 1,
              mb: 0.5
            }} 
          />
          <Typography variant="caption">
            {minion.energy}/100
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Happiness
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={minion.happiness} 
            color={minion.happiness > 70 ? "success" : minion.happiness > 30 ? "warning" : "error"}
            sx={{ 
              height: 10, 
              borderRadius: 1,
              mb: 0.5
            }} 
          />
          <Typography variant="caption">
            {minion.happiness}/100
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body2" gutterBottom>
          Stats
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {statsList.map(stat => (
            <Chip 
              key={stat.name}
              label={`${stat.name}: ${stat.value}`}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
        
        <Typography variant="body2" gutterBottom>
          Traits
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {minion.traits.length > 0 ? (
            minion.traits.map(trait => (
              <Chip 
                key={trait}
                label={trait}
                size="small"
                onDelete={() => onRemoveTrait(trait)}
              />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary">
              No traits assigned
            </Typography>
          )}
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => onAssignTrait(minion.id)} 
            sx={{ ml: 1 }}
          >
            <AddCircleIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="body2" gutterBottom>
          Current Tasks
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {assignedTasks.length > 0 ? (
            assignedTasks.map(task => (
              <Chip 
                key={task}
                label={task}
                size="small"
              />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary">
              No tasks assigned
            </Typography>
          )}
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <Button 
          size="small" 
          startIcon={<SwapHorizIcon />}
          onClick={() => {/* Implement share functionality */}}
        >
          Share
        </Button>
        <Box>
          <Tooltip title="Edit Minion">
            <IconButton size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Minion">
            <IconButton size="small" color="error" onClick={onDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default MinionCard;
