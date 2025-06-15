/**
 * @file EssencePanel.tsx
 * @description Container component for displaying essence resources and related actions.
 * 
 * This component connects to Redux to get essence data and provides controls for interacting
 * with essence, such as gaining essence through buttons and displaying current essence levels.
 */
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useAppSelector } from '../../../../app/hooks';
import { selectEssenceState } from '../../state/EssenceSelectors';
// Corrected: Import UI components from the component barrel file
import { EssenceDisplayUI, ConfigurableEssenceButton, EssenceGenerationTimer } from '../';

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
  // Get data from Redux store using the correct selector
  const essenceState = useAppSelector(selectEssenceState);
  const essenceAmount = essenceState.currentEssence;
  const totalCollected = essenceState.totalCollected || 0;
  const maxEssence = 1000; // Default max since maxAmount doesn't exist in state
  const generationRate = essenceState.generationRate || 0; // Use 0 as default if undefined
  
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      
      {/* Display current essence and max */}
      <EssenceDisplayUI 
        currentEssence={essenceAmount}
        maxEssence={maxEssence}
        essenceRate={generationRate}
      />
      
      {/* Show timer if enabled */}
      {showTimer && <EssenceGenerationTimer />}
      
      {/* Action buttons */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
        <ConfigurableEssenceButton 
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