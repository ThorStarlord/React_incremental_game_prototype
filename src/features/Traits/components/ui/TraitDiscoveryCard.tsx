import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export interface TraitDiscoveryCardProps {
  traitId: string;
  discoveryHint?: string;
  onDiscover?: (traitId: string) => void;
}

/**
 * A placeholder card for a trait that has not yet been discovered by the player.
 */
export const TraitDiscoveryCard: React.FC<TraitDiscoveryCardProps> = React.memo(({
  traitId,
  discoveryHint,
  onDiscover
}) => {
  return (
    <Card
      sx={{
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
        border: '2px dashed',
        borderColor: 'grey.400',
        textAlign: 'center',
        p: 2,
      }}
    >
      <Box>
        <HelpOutlineIcon sx={{ fontSize: 40, color: 'grey.500', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          Undiscovered Trait
        </Typography>
        {discoveryHint && (
          <Typography variant="body2" color="text.secondary">
            {discoveryHint}
          </Typography>
        )}
        {onDiscover && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onDiscover(traitId)}
            sx={{ mt: 2 }}
          >
            Discover Now (Debug)
          </Button>
        )}
      </Box>
    </Card>
  );
});

TraitDiscoveryCard.displayName = 'TraitDiscoveryCard';

export default TraitDiscoveryCard;