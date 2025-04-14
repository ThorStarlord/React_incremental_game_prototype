import React from 'react';
import { Box, Typography, Button, Paper, Chip, ChipProps } from '@mui/material';
import { Trait } from '../../state/TraitsTypes';

// Helper function to get color based on category
const getCategoryColor = (category?: string): ChipProps['color'] => {
  switch (category?.toLowerCase()) {
    case 'combat': return 'error';
    case 'magic': return 'secondary';
    case 'social': return 'success';
    case 'knowledge': return 'info';
    case 'physical': return 'warning';
    default: return 'default';
  }
};

// Helper function to get color based on rarity
const getRarityColor = (rarity?: string): ChipProps['color'] => {
  switch (rarity?.toLowerCase()) {
    case 'common': return 'default';
    case 'uncommon': return 'success';
    case 'rare': return 'primary';
    case 'epic': return 'secondary';
    case 'legendary': return 'warning';
    default: return 'default';
  }
};

interface TraitCardProps {
  trait: Trait;
  canEquip?: boolean;
  showEquipButton?: boolean;
  showUnequipButton?: boolean;
  showDetailsButton?: boolean;
  isEquipped?: boolean;
  isPermanent?: boolean;
  onEquip?: () => void;
  onUnequip?: () => void;
  onShowDetails?: () => void;
}

const TraitCard: React.FC<TraitCardProps> = ({
  trait,
  canEquip = false,
  showEquipButton = false,
  showUnequipButton = false,
  showDetailsButton = false,
  isEquipped = false,
  isPermanent = false,
  onEquip,
  onUnequip,
  onShowDetails
}) => {
  return (
    <Paper
      elevation={isPermanent ? 4 : (isEquipped ? 3 : 1)}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: isPermanent
          ? '5px solid gold'
          : (isEquipped ? '5px solid' : '1px solid'),
        borderColor: isPermanent ? 'gold' : (isEquipped ? 'primary.main' : 'divider'),
        bgcolor: isPermanent
          ? 'rgba(255, 215, 0, 0.1)'
          : (isEquipped ? 'action.hover' : 'background.paper'),
        opacity: isPermanent ? 0.95 : 1,
        transition: 'border 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: 3,
        }
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>{trait.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {trait.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 2, flexWrap: 'wrap' }}>
          {trait.category && (
            <Chip
              label={trait.category}
              size="small"
              color={getCategoryColor(trait.category)}
            />
          )}
          {trait.rarity && (
            <Chip
              label={trait.rarity}
              size="small"
              color={getRarityColor(trait.rarity)}
              variant="outlined"
            />
          )}
          {isPermanent && <Chip label="Permanent" color="secondary" size="small" variant="filled" />}
          {isEquipped && !isPermanent && <Chip label="Equipped" color="primary" size="small" variant="filled" />}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 1 }}>
        {showEquipButton && onEquip && (
          <Button
            variant="contained"
            color="primary"
            onClick={onEquip}
            disabled={!canEquip}
            size="small"
          >
            Equip
          </Button>
        )}
        {showUnequipButton && onUnequip && (
          <Button
            variant="outlined"
            color="error"
            onClick={onUnequip}
            size="small"
          >
            Unequip
          </Button>
        )}
        {showDetailsButton && onShowDetails && (
          <Button
            variant="text"
            color="info"
            onClick={onShowDetails}
            size="small"
          >
            Details
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default TraitCard;
