/**
 * @file EssencePanel.tsx
 * @description Container component for displaying essence resources and related actions.
 * 
 * This component connects to Redux to get essence data and provides controls for interacting
 * with essence, such as gaining essence through buttons and displaying current essence levels.
 */
import React, { useCallback } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectEssenceAmount, selectTotalCollected } from '../../state/EssenceSelectors';
import EssenceDisplay from '../ui/EssenceDisplay';
import EssenceButton from '../ui/EssenceButton';
import EssenceGenerationTimer from './EssenceGenerationTimer';

/**
 * Props for the EssencePanel component
 */
interface EssencePanelProps {
  /** Optional title override */
  title?: string;
  /** Whether to show the essence generation timer */
  showTimer?: boolean;
}

/**
 * Container component for displaying and managing essence
 * 
 * Connects to Redux store for essence data and provides UI for essence interaction
 * 
 * @returns Essence panel component
 */
const EssencePanel: React.FC<EssencePanelProps> = ({
  title = 'Essence',
  showTimer = true
}) => {
  // Get data from Redux store using typed selectors
  const essenceAmount = useAppSelector(selectEssenceAmount);
  const totalCollected = useAppSelector(selectTotalCollected);
  const maxEssence = useAppSelector(state => state.essence.maxAmount) || 1000;
  const generationRate = useAppSelector(state => state.essence.generationRate) || 1;
  const dispatch = useAppDispatch();
  
  // Calculate the percentage of essence to max
  const essencePercentage = Math.min(100, (essenceAmount / maxEssence) * 100);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      
      {/* Display current essence and max */}
      <EssenceDisplay 
        currentEssence={essenceAmount}
        maxEssence={maxEssence}
        essenceRate={generationRate}
      />
      
      {/* Show timer if enabled */}
      {showTimer && <EssenceGenerationTimer rate={generationRate} />}
      
      {/* Action buttons */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
        <EssenceButton 
          amount={25}
          text="Focus Mind"
          tooltip="Concentrate to gather more essence"
          cooldown={3000}
          variant="contained"
          color="primary"
        />
      </Box>
      
      {/* Additional stats */}
      <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(125,125,125,0.2)' }}>
        <Typography variant="caption" color="text.secondary">
          Total collected: {totalCollected.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default EssencePanel;