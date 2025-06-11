import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Star as StarIcon,
  Remove as RemoveIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { Trait } from '../../state/TraitsTypes';

interface TraitCardProps {
  trait: Trait;
  showUnequipButton?: boolean;
  showMakePermanentButton?: boolean;
  currentEssence: number;
  permanenceCost?: number;
  onUnequip?: (traitId: string) => void;
  onMakePermanent?: (traitId: string) => void;
  className?: string;
}

/**
 * TraitCard Component
 * 
 * A standardized, reusable component to display a single trait with action buttons.
 * Displays trait name, description, effects, and provides contextual action buttons.
 */
const TraitCard: React.FC<TraitCardProps> = ({
  trait,
  showUnequipButton = false,
  showMakePermanentButton = false,
  currentEssence,
  permanenceCost = 150,
  onUnequip,
  onMakePermanent,
  className,
}) => {
  const handleUnequip = () => {
    if (onUnequip) {
      onUnequip(trait.id);
    }
  };

  const handleMakePermanent = () => {
    if (onMakePermanent) {
      onMakePermanent(trait.id);
    }
  };

  const canAffordPermanence = currentEssence >= permanenceCost;

  // Determine rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'default';
      case 'rare':
        return 'primary';
      case 'epic':
        return 'secondary';
      case 'legendary':
        return 'warning';
      case 'mythic':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format trait effects for display
  const formatEffects = () => {
    if (Array.isArray(trait.effects)) {
      return trait.effects.map((effect, index) => (
        <Typography key={index} variant="body2" component="div">
          {effect.description || `${effect.type}: ${effect.magnitude}`}
        </Typography>
      ));
    } else if (typeof trait.effects === 'object') {
      return Object.entries(trait.effects).map(([key, value]) => (
        <Typography key={key} variant="body2" component="div">
          {key}: {value}
        </Typography>
      ));
    }
    return null;
  };

  return (
    <Card 
      className={className}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 2,
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header with name and rarity */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="h3" noWrap>
            {trait.name}
          </Typography>
          <Chip
            label={trait.rarity}
            color={getRarityColor(trait.rarity) as any}
            size="small"
            icon={<StarIcon />}
          />
        </Box>

        {/* Category */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {trait.category}
        </Typography>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" paragraph>
          {trait.description}
        </Typography>

        {/* Effects */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Effects:
          </Typography>
          {formatEffects()}
        </Box>

        {/* Essence Cost (if applicable) */}
        {trait.essenceCost && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            Essence Cost: {trait.essenceCost}
          </Typography>
        )}
      </CardContent>

      {/* Action Buttons */}
      {(showUnequipButton || showMakePermanentButton) && (
        <CardActions>
          {showUnequipButton && (
            <Button
              size="small"
              startIcon={<RemoveIcon />}
              onClick={handleUnequip}
              color="secondary"
            >
              Unequip
            </Button>
          )}
          
          {showMakePermanentButton && (
            <Tooltip
              title={
                canAffordPermanence
                  ? `Make permanent for ${permanenceCost} Essence`
                  : `Need ${permanenceCost} Essence (${permanenceCost - currentEssence} more)`
              }
            >
              <span>
                <Button
                  size="small"
                  startIcon={canAffordPermanence ? <StarIcon /> : <LockIcon />}
                  onClick={handleMakePermanent}
                  disabled={!canAffordPermanence}
                  color="warning"
                >
                  Make Permanent
                </Button>
              </span>
            </Tooltip>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default React.memo(TraitCard);
