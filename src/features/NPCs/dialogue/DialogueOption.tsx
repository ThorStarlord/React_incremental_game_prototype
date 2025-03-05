import React from 'react';
import { Button, Box, Typography, Chip } from '@mui/material';
import { getRelationshipTier } from '../utils/relationshipUtils';

/**
 * Interface for dialogue option data
 */
interface DialogueOptionData {
  /** Display text for this dialogue option */
  text: string;
  /** Action type to perform when selected */
  action?: string;
  /** Next dialogue ID to navigate to */
  nextDialogue?: string;
  /** Cost in essence for trait-related options */
  essenceCost?: number;
  /** Any additional properties */
  [key: string]: any;
}

/**
 * Interface for trait status information
 */
interface TraitStatus {
  /** Type of status (e.g., "insufficient_essence", "available", "owned") */
  type: string;
  /** Optional message explaining the status */
  message?: string;
}

/**
 * Interface for DialogueOption component props
 */
interface DialogueOptionProps {
  /** The dialogue option data */
  option: DialogueOptionData;
  /** Callback when option is selected */
  onSelect: (option: DialogueOptionData) => void;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Player's current essence amount */
  playerEssence?: number;
  /** Status information for trait-related options */
  traitStatus?: TraitStatus;
  /** Whether this option was just made available */
  isNewlyAvailable?: boolean;
}

/**
 * Component for a single dialogue response option
 * 
 * @param option - The dialogue option data
 * @param onSelect - Callback when option is selected
 * @param disabled - Whether this option is disabled
 * @param playerEssence - Player's current essence amount
 * @param traitStatus - Status information for trait-related options
 * @param isNewlyAvailable - Whether this option was just made available
 * @returns A button component representing the dialogue option
 */
const DialogueOption: React.FC<DialogueOptionProps> = ({
  option,
  onSelect,
  disabled = false,
  playerEssence = 0,
  traitStatus,
  isNewlyAvailable = false
}) => {
  /**
   * Calculate styling based on trait status
   * @returns Object with CSS-in-JS styles
   */
  const getBorderStyles = () => {
    if (disabled) return {};
    
    if (isNewlyAvailable) {
      return {
        borderColor: 'success.main',
        borderWidth: '2px',
        boxShadow: '0 0 12px rgba(46, 125, 50, 0.6)',
        animation: 'pulse 1.5s infinite ease-in-out',
        '@keyframes pulse': {
          '0%': { boxShadow: `0 0 0 0 rgba(46, 125, 50, 0.4)` },
          '70%': { boxShadow: `0 0 0 8px rgba(46, 125, 50, 0)` },
          '100%': { boxShadow: `0 0 0 0 rgba(46, 125, 50, 0)` }
        }
      };
    }
    
    if (traitStatus?.type === "insufficient_essence") {
      return {
        borderColor: 'error.main'
      };
    }
    
    if (option.action === "copyTrait" || option.nextDialogue === "aboutTraits") {
      return {
        borderColor: 'primary.main',
        borderWidth: '2px',
        boxShadow: '0 0 8px rgba(25, 118, 210, 0.4)'
      };
    }
    
    return {};
  };
  
  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={() => onSelect(option)}
      disabled={disabled}
      sx={{ 
        my: 1, 
        textAlign: 'left', 
        justifyContent: 'flex-start', 
        whiteSpace: 'normal', 
        height: 'auto', 
        p: 1.5,
        position: 'relative',
        ...getBorderStyles(),
        '&:hover': {
          ...getBorderStyles(),
          opacity: 0.9
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <Typography>{option.text}</Typography>
        
        {option.action === "copyTrait" && (
          <Chip 
            size="small" 
            label={`${option.essenceCost} Essence`}
            color={traitStatus?.type === "insufficient_essence" ? "error" : 
                  isNewlyAvailable ? "success" : "primary"}
            sx={{ ml: 1 }}
          />
        )}
        
        {isNewlyAvailable && (
          <Chip
            size="small"
            label="New!"
            color="success"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        )}
      </Box>
      
      {traitStatus?.type === "insufficient_essence" && (
        <Typography 
          variant="caption" 
          color="error"
          sx={{ display: 'block', mt: 0.5 }}
        >
          Not enough essence
        </Typography>
      )}
    </Button>
  );
};

export default DialogueOption;
