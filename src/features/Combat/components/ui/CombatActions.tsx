import React from 'react';
import { Button, Grid } from '@mui/material';
import useThemeUtils from '../../hooks/useThemeUtils';

interface CombatActionsProps {
  isPlayerTurn: boolean;
  isActive: boolean;
  onAttack: () => void;
  onUseSkill: () => void;
  onUseItem: () => void;
}

export const CombatActions: React.FC<CombatActionsProps> = ({
  isPlayerTurn,
  isActive,
  onAttack,
  onUseSkill,
  onUseItem
}) => {
  const { theme } = useThemeUtils();
  
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6} md={4}>
        <Button 
          variant="contained" 
          onClick={onAttack}
          disabled={!isPlayerTurn || !isActive}
          fullWidth
          sx={{ 
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            '&:disabled': {
              bgcolor: theme.palette.action.disabledBackground,
            }
          }}
        >
          Attack
        </Button>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Button 
          variant="outlined" 
          disabled={!isPlayerTurn || !isActive}
          fullWidth
          onClick={onUseSkill}
        >
          Skill
        </Button>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Button 
          variant="outlined" 
          fullWidth
          disabled={!isActive}
          onClick={onUseItem}
        >
          Item
        </Button>
      </Grid>
    </Grid>
  );
};
