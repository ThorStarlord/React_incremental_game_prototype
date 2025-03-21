import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CombatantCardProps {
  name: string;
  health: number;
  maxHealth: number;
  mana?: number;
  maxMana?: number;
  level?: number;
  isActive: boolean;
  isPlayer: boolean;
  imageUrl?: string;
}

// Styled health bar
const HealthBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[300],
  },
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.error.main,
  },
}));

// Styled mana bar
const ManaBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[300],
  },
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const CombatantCard: React.FC<CombatantCardProps> = ({
  name,
  health,
  maxHealth,
  mana,
  maxMana,
  level,
  isActive,
  isPlayer,
  imageUrl
}) => {
  const healthPercent = Math.min(100, Math.max(0, (health / maxHealth) * 100));
  const manaPercent = mana && maxMana 
    ? Math.min(100, Math.max(0, (mana / maxMana) * 100))
    : 0;
    
  // Determine health bar color based on health percentage
  const getHealthColor = () => {
    if (healthPercent > 60) return 'success.main';
    if (healthPercent > 30) return 'warning.main';
    return 'error.main';
  };
  
  return (
    <Box 
      sx={{ 
        p: 2,
        border: isActive ? 2 : 1,
        borderColor: isActive ? 'primary.main' : 'divider',
        borderRadius: 2,
        textAlign: 'center',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: isActive ? 3 : 1
      }}
    >
      {/* Combatant image */}
      <Box 
        sx={{
          height: 120,
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            style={{ 
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain'
            }} 
          />
        ) : (
          <Box 
            sx={{ 
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: isPlayer ? 'primary.light' : 'error.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h4" color="white">
              {name.charAt(0)}
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Name and level */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        {name}
        {level && <span style={{ fontSize: '0.8em', marginLeft: 5 }}>Lv.{level}</span>}
      </Typography>
      
      {/* Health bar */}
      <Box sx={{ mb: mana && maxMana ? 1 : 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color={getHealthColor()}>
            HP
          </Typography>
          <Typography variant="caption">
            {health}/{maxHealth}
          </Typography>
        </Box>
        <HealthBar 
          variant="determinate" 
          value={healthPercent} 
          sx={{ 
            '& .MuiLinearProgress-bar': {
              backgroundColor: getHealthColor()
            }
          }}
        />
      </Box>
      
      {/* Mana bar - only shown if mana is provided */}
      {mana !== undefined && maxMana !== undefined && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="primary">
              MP
            </Typography>
            <Typography variant="caption">
              {mana}/{maxMana}
            </Typography>
          </Box>
          <ManaBar variant="determinate" value={manaPercent} />
        </Box>
      )}
    </Box>
  );
};

export default CombatantCard;
