import React from 'react';
import { Box, Typography, LinearProgress, Chip, Stack, useTheme } from '@mui/material';

// Define interface for the component props - making required props non-optional
interface EssenceDisplayProps {
  currentEssence: number;
  maxEssence: number;
  essenceTypes?: Array<{
    id: string;
    name: string;
    amount: number;
    color?: string;
  }>;
  onEssenceClick?: (essenceId: string) => void;
  essenceRate?: number;
}

/**
 * EssenceDisplay Component
 * 
 * Displays the player's essence amounts and types using Material UI components.
 * Pure presentational component that receives all data via props.
 * 
 * @returns {JSX.Element} - Rendered component
 */
const EssenceDisplay: React.FC<EssenceDisplayProps> = ({
  currentEssence,
  maxEssence = 1000,
  essenceTypes = [],
  onEssenceClick,
  essenceRate
}) => {
  const theme = useTheme();
  const progress = Math.min(100, (currentEssence / maxEssence) * 100);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle1" fontWeight="medium">Essence</Typography>
        <Typography variant="body2" color="text.secondary">
          {currentEssence.toLocaleString()} / {maxEssence.toLocaleString()}
        </Typography>
      </Box>
      
      {/* Progress bar for essence */}
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 10, 
          borderRadius: 1,
          mb: 1,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#3a7ca5',
          }
        }} 
      />
      
      {/* Essence generation rate */}
      {essenceRate !== undefined && (
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'right', mb: 1 }}
        >
          +{essenceRate}/min
        </Typography>
      )}
      
      {/* Essence types */}
      {essenceTypes.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
          {essenceTypes.map(essence => (
            <Chip
              key={essence.id}
              label={`${essence.name}: ${essence.amount}`}
              onClick={() => onEssenceClick && onEssenceClick(essence.id)}
              size="small"
              sx={{ 
                backgroundColor: essence.color || theme.palette.primary.main,
                color: '#fff',
                '&:hover': {
                  backgroundColor: essence.color ? `${essence.color}dd` : theme.palette.primary.dark,
                }
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default EssenceDisplay;
