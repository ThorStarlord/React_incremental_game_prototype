import React, { useContext } from 'react';
import { Box, Typography, LinearProgress, Tooltip, Chip, Divider } from '@mui/material';
import { GameStateContext } from '../../../../context/GameStateContext';
import Panel from '../../../components/panel/Panel';
import useThemeUtils from '../../../hooks/useThemeUtils';
import useTraitEffects from '../../../hooks/useTraitEffects';

const StatDisplay = ({ label, value, bonus }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="body2">
      {label}: {value}
    </Typography>
    {bonus > 0 && (
      <Typography variant="caption" color="success.main">
        (+{bonus})
      </Typography>
    )}
  </Box>
);

const PlayerStats = () => {
  const { player } = useContext(GameStateContext);
  const { getProgressColor } = useThemeUtils();
  const { activeEffects, modifiers, calculatedStats } = useTraitEffects();
  
  // Calculate stat bonuses from traits
  const attackBonus = calculatedStats.attack - player.attack;
  const defenseBonus = calculatedStats.defense - player.defense;

  return (
    <Panel title="Player Stats">
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {player.name} - Level {player.level}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          HP: {player.hp}/{player.maxHp}
        </Typography>
        <Tooltip title={`${player.hp}/{player.maxHp} HP`} arrow>
          <LinearProgress
            variant="determinate"
            value={(player.hp / player.maxHp) * 100}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getProgressColor(player.hp, player.maxHp)
              }
            }}
          />
        </Tooltip>
      </Box>

      <Box sx={{ mb: 2 }}>
        <StatDisplay label="Attack" value={player.attack} bonus={attackBonus} />
        <StatDisplay label="Defense" value={player.defense} bonus={defenseBonus} />
        {modifiers.essenceSiphonChance > 0 && (
          <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
            {Math.round(modifiers.essenceSiphonChance * 100)}% chance to gain essence on hit
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="primary">
            Gold: {player.gold}
          </Typography>
          {modifiers.shopDiscount > 0 && (
            <Tooltip title="Shop discount from traits" arrow>
              <Typography variant="caption" color="success.main">
                ({Math.round(modifiers.shopDiscount * 100)}% cheaper)
              </Typography>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color="secondary">
            XP: {player.experience}
          </Typography>
          {modifiers.xpMultiplier > 1 && (
            <Tooltip title="XP bonus from traits" arrow>
              <Typography variant="caption" color="success.main">
                ({Math.round((modifiers.xpMultiplier - 1) * 100)}% bonus)
              </Typography>
            </Tooltip>
          )}
        </Box>
      </Box>

      {player.statPoints > 0 && (
        <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
          Stat Points Available: {player.statPoints}
          {modifiers.statPointBonus > 0 && (
            <Tooltip title="Additional stat points from traits" arrow>
              <Typography component="span" sx={{ ml: 1 }} color="success.light">
                (+{modifiers.statPointBonus} on level up)
              </Typography>
            </Tooltip>
          )}
        </Typography>
      )}

      {activeEffects.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Active Traits ({activeEffects.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {activeEffects.map(effect => (
              <Tooltip 
                key={effect.id}
                title={effect.effect}
                arrow
              >
                <Chip
                  label={effect.name}
                  size="small"
                  color={effect.type === 'Knowledge' ? 'primary' : 'secondary'}
                  variant="outlined"
                />
              </Tooltip>
            ))}
          </Box>
        </>
      )}
    </Panel>
  );
};

export default PlayerStats;