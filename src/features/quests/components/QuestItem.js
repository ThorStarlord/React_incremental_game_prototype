import React from 'react';
import { 
  Box, Typography, Button, Chip, Paper, 
  ListItem, ListItemText, Divider, LinearProgress, 
  Tooltip, Stack, Grid
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoopIcon from '@mui/icons-material/Loop';
import StarIcon from '@mui/icons-material/Star';
import { formatObjective } from '../../NPCs/utils/formatters';
import { getQuestTypeIcon, getQuestDifficultyColor } from '../../NPCs/utils/questHelpers';

const QuestItem = ({
  quest,
  buttonText,
  onAction,
  status = 'available', // 'available', 'active', or 'completed'
  progress = [],
  showRequirements = false,
  showProgress = false,
  showRewards = false,
  currentRelationship = 0,
  essence = 0,
  inventory = {},
  completedDate,
  type = 'generic',
  difficulty = 1
}) => {
  // Calculate overall progress percentage
  const calculateProgress = () => {
    if (!progress || progress.length === 0) return 0;
    const completedCount = progress.filter(obj => obj.completed).length;
    return (completedCount / progress.length) * 100;
  };
  
  // Get icon for quest type
  const TypeIcon = getQuestTypeIcon(type);
  
  // Get color for difficulty
  const difficultyColor = getQuestDifficultyColor(difficulty);
  
  // Format difficulty as stars
  const formattedDifficulty = Array(difficulty).fill(<StarIcon sx={{ fontSize: 14 }} />);
  
  // Check if player has enough inventory space for rewards
  const canAcceptRewards = () => {
    // This is a placeholder - implement proper inventory check
    return true;
  };
  
  // Format completion date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <ListItem
      component={Paper}
      elevation={1}
      sx={{ 
        mb: 2, 
        p: 2,
        flexDirection: 'column',
        alignItems: 'stretch',
        borderLeft: `4px solid ${difficultyColor}`,
      }}
    >
      {/* Quest Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TypeIcon sx={{ mr: 1, color: difficultyColor }} />
          <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold' }}>
            {quest.title}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {/* Quest type */}
          <Chip 
            label={type.charAt(0).toUpperCase() + type.slice(1)} 
            size="small" 
            sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
          />
          
          {/* Difficulty indicator */}
          <Tooltip title={`Difficulty: ${difficulty}/5`}>
            <Chip 
              size="small"
              label={formattedDifficulty}
              sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
            />
          </Tooltip>
          
          {/* Status indicator */}
          {status === 'completed' && (
            <Chip 
              icon={<CheckCircleIcon />} 
              label="Completed" 
              size="small" 
              color="success"
            />
          )}
          
          {status === 'active' && (
            <Chip 
              icon={<LoopIcon />} 
              label="Active" 
              size="small" 
              color="primary"
            />
          )}
        </Stack>
      </Box>
      
      {/* Quest Description */}
      <Typography variant="body2" sx={{ mb: 1.5 }}>
        {quest.description}
      </Typography>
      
      {/* Relationship Requirement */}
      {showRequirements && quest.relationshipRequirement > 0 && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mb: 1, 
            color: currentRelationship >= quest.relationshipRequirement ? 'success.main' : 'error.main'
          }}
        >
          Requires Relationship: {quest.relationshipRequirement}/100
          {currentRelationship < quest.relationshipRequirement && " (not met)"}
        </Typography>
      )}
      
      {/* Prerequisites */}
      {showRequirements && quest.prerequisites && quest.prerequisites.length > 0 && (
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Prerequisites:
          </Typography>
          <Typography variant="caption">
            {quest.prerequisites.join(', ')}
          </Typography>
        </Box>
      )}
      
      {/* Quest Objectives */}
      <Divider sx={{ my: 1.5 }} />
      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        Objectives:
      </Typography>
      
      {status === 'active' && showProgress ? (
        <>
          {progress.map((objective, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              {objective.completed ? 
                <CheckCircleIcon sx={{ fontSize: 18, mr: 1, color: 'success.main' }} /> : 
                <AssignmentIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
              }
              <Typography 
                variant="body2" 
                sx={{ 
                  textDecoration: objective.completed ? 'line-through' : 'none',
                  color: objective.completed ? 'text.secondary' : 'text.primary'
                }}
              >
                {formatObjective(objective)}
              </Typography>
            </Box>
          ))}
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress()} 
            sx={{ mt: 1, mb: 1.5, height: 8, borderRadius: 1 }}
          />
        </>
      ) : (
        <Box sx={{ mb: 1.5 }}>
          {quest.objectives.map((objective, index) => (
            <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
              {formatObjective(objective)}
            </Typography>
          ))}
        </Box>
      )}
      
      {/* Rewards Section */}
      {showRewards && quest.rewards && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocalOfferIcon sx={{ fontSize: 18, mr: 1, color: '#ffc107' }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Rewards:
              </Typography>
            </Box>
            
            <Grid container spacing={1} sx={{ pl: 1.5 }}>
              {quest.rewards.essence && (
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {quest.rewards.essence} Essence
                  </Typography>
                </Grid>
              )}
              
              {quest.rewards.relationship && (
                <Grid item xs={6}>
                  <Typography variant="body2">
                    +{quest.rewards.relationship} Relationship
                  </Typography>
                </Grid>
              )}
              
              {quest.rewards.items && quest.rewards.items.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="body2">
                    {item.quantity}x {item.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
      
      {/* Completed Date */}
      {status === 'completed' && completedDate && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Completed on {formatDate(completedDate)}
          </Typography>
        </Box>
      )}
      
      {/* Action Button */}
      {buttonText && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction} 
          sx={{ alignSelf: 'flex-end', mt: 2 }}
          disabled={
            status === 'available' && 
            showRequirements && 
            quest.relationshipRequirement > currentRelationship
          }
        >
          {buttonText}
        </Button>
      )}
    </ListItem>
  );
};

export default QuestItem;import React from 'react';
import { 
  Box, Typography, Button, Chip, Paper, 
  ListItem, ListItemText, Divider, LinearProgress, 
  Tooltip, Stack, Grid
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoopIcon from '@mui/icons-material/Loop';
import StarIcon from '@mui/icons-material/Star';
import { formatObjective } from '../../NPCs/utils/formatters';
import { getQuestTypeIcon, getQuestDifficultyColor } from '../../NPCs/utils/questHelpers';

const QuestItem = ({
  quest,
  buttonText,
  onAction,
  status = 'available', // 'available', 'active', or 'completed'
  progress = [],
  showRequirements = false,
  showProgress = false,
  showRewards = false,
  currentRelationship = 0,
  essence = 0,
  inventory = {},
  completedDate,
  type = 'generic',
  difficulty = 1
}) => {
  // Calculate overall progress percentage
  const calculateProgress = () => {
    if (!progress || progress.length === 0) return 0;
    const completedCount = progress.filter(obj => obj.completed).length;
    return (completedCount / progress.length) * 100;
  };
  
  // Get icon for quest type
  const TypeIcon = getQuestTypeIcon(type);
  
  // Get color for difficulty
  const difficultyColor = getQuestDifficultyColor(difficulty);
  
  // Format difficulty as stars
  const formattedDifficulty = Array(difficulty).fill(<StarIcon sx={{ fontSize: 14 }} />);
  
  // Check if player has enough inventory space for rewards
  const canAcceptRewards = () => {
    // This is a placeholder - implement proper inventory check
    return true;
  };
  
  // Format completion date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <ListItem
      component={Paper}
      elevation={1}
      sx={{ 
        mb: 2, 
        p: 2,
        flexDirection: 'column',
        alignItems: 'stretch',
        borderLeft: `4px solid ${difficultyColor}`,
      }}
    >
      {/* Quest Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TypeIcon sx={{ mr: 1, color: difficultyColor }} />
          <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold' }}>
            {quest.title}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {/* Quest type */}
          <Chip 
            label={type.charAt(0).toUpperCase() + type.slice(1)} 
            size="small" 
            sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
          />
          
          {/* Difficulty indicator */}
          <Tooltip title={`Difficulty: ${difficulty}/5`}>
            <Chip 
              size="small"
              label={formattedDifficulty}
              sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
            />
          </Tooltip>
          
          {/* Status indicator */}
          {status === 'completed' && (
            <Chip 
              icon={<CheckCircleIcon />} 
              label="Completed" 
              size="small" 
              color="success"
            />
          )}
          
          {status === 'active' && (
            <Chip 
              icon={<LoopIcon />} 
              label="Active" 
              size="small" 
              color="primary"
            />
          )}
        </Stack>
      </Box>
      
      {/* Quest Description */}
      <Typography variant="body2" sx={{ mb: 1.5 }}>
        {quest.description}
      </Typography>
      
      {/* Relationship Requirement */}
      {showRequirements && quest.relationshipRequirement > 0 && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mb: 1, 
            color: currentRelationship >= quest.relationshipRequirement ? 'success.main' : 'error.main'
          }}
        >
          Requires Relationship: {quest.relationshipRequirement}/100
          {currentRelationship < quest.relationshipRequirement && " (not met)"}
        </Typography>
      )}
      
      {/* Prerequisites */}
      {showRequirements && quest.prerequisites && quest.prerequisites.length > 0 && (
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Prerequisites:
          </Typography>
          <Typography variant="caption">
            {quest.prerequisites.join(', ')}
          </Typography>
        </Box>
      )}
      
      {/* Quest Objectives */}
      <Divider sx={{ my: 1.5 }} />
      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        Objectives:
      </Typography>
      
      {status === 'active' && showProgress ? (
        <>
          {progress.map((objective, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              {objective.completed ? 
                <CheckCircleIcon sx={{ fontSize: 18, mr: 1, color: 'success.main' }} /> : 
                <AssignmentIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
              }
              <Typography 
                variant="body2" 
                sx={{ 
                  textDecoration: objective.completed ? 'line-through' : 'none',
                  color: objective.completed ? 'text.secondary' : 'text.primary'
                }}
              >
                {formatObjective(objective)}
              </Typography>
            </Box>
          ))}
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress()} 
            sx={{ mt: 1, mb: 1.5, height: 8, borderRadius: 1 }}
          />
        </>
      ) : (
        <Box sx={{ mb: 1.5 }}>
          {quest.objectives.map((objective, index) => (
            <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
              {formatObjective(objective)}
            </Typography>
          ))}
        </Box>
      )}
      
      {/* Rewards Section */}
      {showRewards && quest.rewards && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocalOfferIcon sx={{ fontSize: 18, mr: 1, color: '#ffc107' }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Rewards:
              </Typography>
            </Box>
            
            <Grid container spacing={1} sx={{ pl: 1.5 }}>
              {quest.rewards.essence && (
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {quest.rewards.essence} Essence
                  </Typography>
                </Grid>
              )}
              
              {quest.rewards.relationship && (
                <Grid item xs={6}>
                  <Typography variant="body2">
                    +{quest.rewards.relationship} Relationship
                  </Typography>
                </Grid>
              )}
              
              {quest.rewards.items && quest.rewards.items.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="body2">
                    {item.quantity}x {item.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
      
      {/* Completed Date */}
      {status === 'completed' && completedDate && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Completed on {formatDate(completedDate)}
          </Typography>
        </Box>
      )}
      
      {/* Action Button */}
      {buttonText && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction} 
          sx={{ alignSelf: 'flex-end', mt: 2 }}
          disabled={
            status === 'available' && 
            showRequirements && 
            quest.relationshipRequirement > currentRelationship
          }
        >
          {buttonText}
        </Button>
      )}
    </ListItem>
  );
};

export default QuestItem;