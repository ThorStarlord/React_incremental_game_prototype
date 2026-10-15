import React from 'react';
import { Box, Typography, LinearProgress, Chip, Stack, useTheme } from '@mui/material';

// Define interface for the component props - making required props non-optional
interface EssenceDisplayProps {
  currentEssence: number;
  maxEssence?: number; // Supply only when the underlying system has a real capacity
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
  maxEssence,
  essenceTypes = [],
  onEssenceClick,
  essenceRate
}) => {
  const theme = useTheme();
  
  // Ensure values are numbers before calculations/display
  const current = currentEssence ?? 0;
  // The Essence state is uncapped. Do not invent a 1,000-Essence limit for the UI.
  // If a future caller has a genuine cap, retain the familiar progress display.
  const max = typeof maxEssence === 'number' && Number.isFinite(maxEssence) && maxEssence > 0
    ? maxEssence
    : undefined;
  const progress = max !== undefined ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle1" fontWeight="medium">Essence</Typography>
        <Typography variant="body2" color="text.secondary">
          {current.toLocaleString()}{max !== undefined && ` / ${max.toLocaleString()}`}
        </Typography>
      </Box>
      
      {/* Only show a capacity bar when a real maximum is known. */}
      {max !== undefined && <LinearProgress 
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
      />}
      
      {/* Essence generation rate */}
      {essenceRate !== undefined && (
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'right', mb: 1 }}
        >
          {/* Ensure essenceRate is a number before formatting */}
          +{(essenceRate ?? 0).toLocaleString()}/sec 
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
