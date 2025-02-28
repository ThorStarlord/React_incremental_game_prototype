import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  LinearProgress,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LockIcon from '@mui/icons-material/Lock';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { 
  getRelationshipTier, 
  getRelationshipColor, 
  getNextRelationshipMilestone,
  getAvailableTraits 
} from '../utils/relationshipUtils';
import TraitCard from '../../traits/TraitCard';

const RelationshipTab = ({ 
  npc, 
  playerRelationship, 
  playerTraits = [],
  onRelationshipChange,
  dispatch,
  tutorial,
  traits
}) => {
  // Get relationship information
  const relationshipTier = getRelationshipTier(playerRelationship);
  const relationshipColor = getRelationshipColor(playerRelationship);
  const nextMilestone = getNextRelationshipMilestone(npc, playerRelationship);
  
  // Calculate progress to next tier
  const calculateProgress = () => {
    // Define tier thresholds
    const tiers = [0, 20, 40, 60, 80];
    
    // Find current tier threshold
    let currentTierThreshold = 0;
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (playerRelationship >= tiers[i]) {
        currentTierThreshold = tiers[i];
        break;
      }
    }
    
    // Find next tier threshold
    let nextTierThreshold = 100;
    for (let i = 0; i < tiers.length; i++) {
      if (tiers[i] > currentTierThreshold) {
        nextTierThreshold = tiers[i];
        break;
      }
    }
    
    // Calculate progress percentage within current tier
    const tierRange = nextTierThreshold - currentTierThreshold;
    const progress = ((playerRelationship - currentTierThreshold) / tierRange) * 100;
    
    return {
      progress,
      currentTier: currentTierThreshold,
      nextTier: nextTierThreshold,
      remaining: nextTierThreshold - playerRelationship
    };
  };
  
  const progress = calculateProgress();
  
  // Get traits that can be learned from the NPC
  const availableTraits = getAvailableTraits(npc, playerRelationship, playerTraits);
  const unlockedTraits = availableTraits.filter(trait => trait.relationshipMet);
  const lockedTraits = availableTraits.filter(trait => !trait.relationshipMet);
  
  // Define relationship benefits for each tier
  const relationshipBenefits = [
    {
      tier: "Stranger",
      threshold: 0,
      benefits: [
        "Basic dialogue options",
        "Limited quest opportunities"
      ]
    },
    {
      tier: "Acquaintance",
      threshold: 20,
      benefits: [
        "More dialogue options",
        "Access to basic quests",
        "Small discounts on trades"
      ]
    },
    {
      tier: "Friend",
      threshold: 40,
      benefits: [
        "Personal dialogue topics",
        "Access to friendship quests",
        "Better trade offers",
        "Occasional gifts"
      ]
    },
    {
      tier: "Close Friend",
      threshold: 60,
      benefits: [
        "Confidential dialogue options",
        "Access to important quests",
        "Significant trade discounts",
        "Regular gifts"
      ]
    },
    {
      tier: "Trusted Ally",
      threshold: 80,
      benefits: [
        "All dialogue options available",
        "Access to exclusive quests",
        "Best trade prices",
        "Special items and opportunities"
      ]
    }
  ];

  // Add state for trait dialog
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [showTraitDialog, setShowTraitDialog] = useState(false);

  // Find traits this NPC can offer
  const availableTrait = traits?.copyableTraits?.[npc.traitId];
  
  // Function to handle trait acquisition
  const handleAcquireTrait = () => {
    if (selectedTrait) {
      // Add trait to player's acquired traits
      dispatch({
        type: 'ACQUIRE_TRAIT',
        payload: selectedTrait.id
      });
      
      // Update tutorial if this was part of it
      if (tutorial?.active && tutorial.step === 'acquireFirstTrait') {
        dispatch({ 
          type: 'TUTORIAL_PROGRESS', 
          payload: { step: 'acquireFirstTrait', completed: true }
        });
        
        // Move to combat tutorial step
        dispatch({
          type: 'SET_TUTORIAL_STEP',
          payload: 'findFirstMonster'
        });
      }
      
      setShowTraitDialog(false);
    }
  };
  
  return (
    <Box>
      {/* Relationship Overview */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Relationship with {npc.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <FavoriteIcon sx={{ color: relationshipColor, mr: 1.5 }} />
          <Typography sx={{ fontWeight: 'bold' }}>
            {relationshipTier} ({playerRelationship}/100)
          </Typography>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress.progress} 
          sx={{ 
            height: 10, 
            borderRadius: 1,
            mb: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: relationshipColor
            }
          }}
        />
        
        {nextMilestone ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Next milestone at {nextMilestone.level} relationship: {nextMilestone.description}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ mt: 1 }}>
            You have reached maximum relationship level with {npc.name}!
          </Typography>
        )}
      </Paper>
      
      {/* Traits Section */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Traits & Knowledge
      </Typography>
      
      {/* Unlocked Traits */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '4px 4px 0 0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <PsychologyIcon sx={{ mr: 1 }} />
            Available Traits
          </Typography>
        </Box>
        
        <Divider />
        
        <List disablePadding>
          {unlockedTraits.length > 0 ? (
            unlockedTraits.map((trait) => (
              <ListItem key={trait.id} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PsychologyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={trait.name} 
                  secondary={trait.description}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
                {playerTraits.includes(trait.id) ? (
                  <Chip label="Learned" color="success" size="small" />
                ) : (
                  <Chip 
                    label="Can Learn" 
                    color="primary" 
                    size="small" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      // Add action to learn trait
                      console.log(`Learning trait: ${trait.id}`);
                    }}
                  />
                )}
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText 
                primary="No traits available yet"
                secondary="Improve your relationship to unlock traits"
              />
            </ListItem>
          )}
        </List>
      </Paper>
      
      {/* Locked Traits */}
      {lockedTraits.length > 0 && (
        <Paper elevation={1} sx={{ mb: 3 }}>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '4px 4px 0 0' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <LockIcon sx={{ mr: 1 }} />
              Locked Traits
            </Typography>
          </Box>
          
          <Divider />
          
          <List disablePadding>
            {lockedTraits.map((trait) => (
              <ListItem key={trait.id} sx={{ py: 1.5, opacity: 0.6 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={trait.name} 
                  secondary={`Requires ${trait.relationshipRequirement} relationship`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      
      {/* Relationship Benefits */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Relationship Benefits
      </Typography>
      
      <Paper elevation={1}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '4px 4px 0 0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ mr: 1 }} />
            Benefits By Tier
          </Typography>
        </Box>
        
        <Divider />
        
        <Grid container sx={{ p: 0 }}>
          {relationshipBenefits.map((benefit, index) => (
            <React.Fragment key={benefit.tier}>
              <Grid item xs={12} sx={{ 
                p: 2, 
                bgcolor: benefit.threshold <= playerRelationship ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                position: 'relative'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: benefit.threshold <= playerRelationship ? 'bold' : 'normal',
                      color: benefit.threshold <= playerRelationship ? getRelationshipColor(benefit.threshold) : 'text.primary',
                    }}
                  >
                    {benefit.tier} ({benefit.threshold}+)
                  </Typography>
                  
                  {benefit.threshold <= playerRelationship && (
                    <Chip 
                      label="Unlocked" 
                      size="small" 
                      color="success"
                      sx={{ ml: 1.5 }}
                    />
                  )}
                </Box>
                
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {benefit.benefits.map((item, i) => (
                    <Typography 
                      component="li" 
                      key={i} 
                      variant="body2" 
                      sx={{ 
                        opacity: benefit.threshold <= playerRelationship ? 1 : 0.7,
                        mb: 0.5
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Grid>
              
              {index < relationshipBenefits.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Grid>
      </Paper>

      {/* Special Traits Section */}
      {npc.hasTrait && availableTrait && !playerTraits.includes(npc.traitId) && (
        <Paper elevation={1} sx={{ mt: 3, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <AutoFixHighIcon sx={{ mr: 1, color: 'secondary.main' }} />
              Special Ability
            </Typography>
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AutoFixHighIcon />}
              onClick={() => {
                setSelectedTrait({
                  id: npc.traitId,
                  ...availableTrait
                });
                setShowTraitDialog(true);
              }}
            >
              Learn Special Ability
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ my: 1 }}>
            {npc.name} has a special ability they can teach you.
          </Typography>
          
          {tutorial?.active && tutorial.step === 'acquireFirstTrait' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This NPC has knowledge to share. Learning this ability will help you on your journey.
            </Alert>
          )}
        </Paper>
      )}
      
      {/* Trait Acquisition Dialog */}
      <Dialog 
        open={showTraitDialog}
        onClose={() => setShowTraitDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Acquire New Trait</DialogTitle>
        <DialogContent>
          {selectedTrait && (
            <Box sx={{ p: 1 }}>
              <Typography variant="body1" paragraph>
                {npc.name} offers to teach you a special ability called "{selectedTrait.name}".
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <TraitCard trait={selectedTrait} />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Would you like to learn this trait?
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTraitDialog(false)}>
            Not Now
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<AutoFixHighIcon />}
            onClick={handleAcquireTrait}
          >
            Learn Trait
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RelationshipTab;