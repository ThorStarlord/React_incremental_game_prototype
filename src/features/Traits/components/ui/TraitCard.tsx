import React from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';

interface TraitCardProps {
  trait: {
    id: string;
    name: string;
    description: string;
    category?: string;
  };
  canEquip: boolean;
  showEquipButton: boolean;
  onEquip: () => void;
  onShowDetails?: () => void;
}

const TraitCard: React.FC<TraitCardProps> = ({ trait, canEquip, showEquipButton, onEquip, onShowDetails }) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box>
        <Typography variant="h6">{trait.name}</Typography>
        <Typography variant="body2" color="text.secondary">{trait.description}</Typography>
        {trait.category && <Chip label={trait.category} size="small" sx={{ mt: 1 }} />}
      </Box>
      {showEquipButton && (
        <Button
          variant="contained"
          color="primary"
          onClick={onEquip}
          disabled={!canEquip}
          sx={{ mt: 2 }}
        >
          Equip
        </Button>
      )}
      {onShowDetails && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={onShowDetails}
          sx={{ mt: 1 }}
        >
          Details
        </Button>
      )}
    </Paper>
  );
};

export default TraitCard;
