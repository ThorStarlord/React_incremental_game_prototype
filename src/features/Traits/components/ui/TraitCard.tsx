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
  Add as AddIcon,
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';
import { Trait } from '../../state/TraitsTypes';

interface TraitCardProps {
  trait: Trait;
  isEquipped?: boolean; // ADDED
  isPermanent?: boolean; // ADDED
  showUnequipButton?: boolean;
  canUnequip?: boolean;
  unequipButtonText?: string;
  unequipButtonColor?: 'primary' | 'secondary' | 'error';
  showMakePermanentButton?: boolean;
  currentEssence: number;
  permanenceCost?: number;
  onUnequip?: (traitId: string) => void;
  onMakePermanent?: (traitId: string) => void;
  className?: string;
  sx?: SxProps<Theme>;
}

const TraitCard: React.FC<TraitCardProps> = ({
  trait,
  isEquipped = false, // ADDED default value
  isPermanent = false, // ADDED default value
  showUnequipButton = false,
  canUnequip = true,
  unequipButtonText = "Unequip",
  unequipButtonColor = "secondary",
  showMakePermanentButton = false,
  currentEssence,
  permanenceCost = 150,
  onUnequip,
  onMakePermanent,
  className,
  sx
}) => {
  const handleAction = () => {
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

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'default';
      case 'rare': return 'primary';
      case 'epic': return 'secondary';
      case 'legendary': return 'warning';
      case 'mythic': return 'error';
      default: return 'default';
    }
  };

  const formatEffects = () => {
    if (!trait.effects) return null;
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
        border: isPermanent ? '2px solid' : (isEquipped ? '1px solid' : '1px solid'),
        borderColor: isPermanent ? 'success.main' : (isEquipped ? 'primary.main' : 'divider'),
        ...sx
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="h3" noWrap>{trait.name}</Typography>
          <Chip
            label={trait.rarity}
            color={getRarityColor(trait.rarity) as any}
            size="small"
            icon={<StarIcon />}
          />
        </Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>{trait.category}</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>{trait.description}</Typography>
        <Box>
          <Typography variant="subtitle2" gutterBottom>Effects:</Typography>
          {formatEffects()}
        </Box>
      </CardContent>

      {(showUnequipButton || showMakePermanentButton) && (
        <CardActions>
          {showUnequipButton && (
            <Button
              size="small"
              startIcon={unequipButtonText === "Equip" ? <AddIcon /> : <RemoveIcon />}
              onClick={handleAction}
              color={unequipButtonColor}
              disabled={!canUnequip}
            >
              {unequipButtonText}
            </Button>
          )}

          {showMakePermanentButton && (
            <Tooltip
              title={canAffordPermanence ? `Make permanent for ${permanenceCost} Essence` : `Need ${permanenceCost} Essence`}
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