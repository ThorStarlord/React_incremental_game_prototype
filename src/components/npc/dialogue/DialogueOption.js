import React from 'react';
import { Tooltip, Box, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LockIcon from '@mui/icons-material/Lock';
import { getRelationshipTier } from '../utils/relationshipUtils';

/**
 * Component for a single dialogue response option
 */
const DialogueOption = ({
  text,
  relationshipImpact,
  requiredRelationship = 0,
  requiredTraits = [],
  playerRelationship,
  playerTraits = [],
  type = 'neutral', // 'friendly', 'neutral', 'aggressive'
  onClick,
  disabled = false,
  tooltip = ''
}) => {
  // Check if option is available based on relationship level
  const isRelationshipSufficient = playerRelationship >= requiredRelationship;
  
  // Check if player has all required traits
  const hasRequiredTraits = requiredTraits.every(trait => 
    playerTraits.includes(trait)
  );

  // Determine if option should be disabled
  const isDisabled = disabled || !isRelationshipSufficient || !hasRequiredTraits;
  
  // Set style based on dialogue type and availability
  const getOptionStyle = () => {
    const baseStyle = {
      padding: '8px 16px',
      margin: '6px 0',
      borderRadius: '4px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.6 : 1,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid #ccc',
    };
    
    if (isDisabled) return baseStyle;
    
    // Style based on dialogue type
    switch(type) {
      case 'friendly':
        return { ...baseStyle, backgroundColor: '#e8f5e9', borderColor: '#81c784' };
      case 'aggressive':
        return { ...baseStyle, backgroundColor: '#ffebee', borderColor: '#e57373' };
      case 'neutral':
      default:
        return { ...baseStyle, backgroundColor: '#f5f5f5', borderColor: '#bdbdbd' };
    }
  };

  // Generate requirement message if option is locked
  const getRequirementMessage = () => {
    const requirements = [];
    
    if (!isRelationshipSufficient) {
      requirements.push(`Requires ${getRelationshipTier(requiredRelationship)} relationship`);
    }
    
    if (requiredTraits.length > 0 && !hasRequiredTraits) {
      const missingTraits = requiredTraits.filter(trait => !playerTraits.includes(trait));
      requirements.push(`Required traits: ${missingTraits.join(', ')}`);
    }
    
    return requirements.join(' • ');
  };
  
  const handleClick = () => {
    if (!isDisabled) {
      onClick();
    }
  };
  
  const tooltipText = isDisabled ? getRequirementMessage() : tooltip;

  return (
    <Tooltip title={tooltipText} placement="top" arrow>
      <Box
        sx={getOptionStyle()}
        onClick={handleClick}
      >
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          {text}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          {isDisabled && <LockIcon fontSize="small" sx={{ color: 'text.disabled', mr: 1 }} />}
          
          {relationshipImpact > 0 && (
            <ArrowUpwardIcon fontSize="small" sx={{ color: 'success.main' }} />
          )}
          
          {relationshipImpact < 0 && (
            <ArrowDownwardIcon fontSize="small" sx={{ color: 'error.main' }} />
          )}
          
          {relationshipImpact !== 0 && (
            <Typography variant="caption" sx={{ 
              color: relationshipImpact > 0 ? 'success.main' : 'error.main',
              ml: 0.5
            }}>
              {Math.abs(relationshipImpact)}
            </Typography>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default DialogueOption;