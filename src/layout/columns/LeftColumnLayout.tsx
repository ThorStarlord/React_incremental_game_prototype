import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks'; // Import useAppSelector
import { selectCurrentEssence } from '../../features/Essence/state/EssenceSelectors'; // Import selector
// import { CompactCharacterPanel } from '../../features/Player/components/ui/CompactCharacterPanel'; // Commented out
import { EssenceDisplay } from '../../features/Essence'; // Corrected import path
import { GameControlPanel } from '../../features/GameLoop/components/ui/GameControlPanel';

/**
 * Left column layout component that renders persistent status displays
 * and provides an outlet for dynamic routed content
 */
export const LeftColumnLayout: React.FC = () => {
  const currentEssence = useAppSelector(selectCurrentEssence);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        overflow: 'auto',
        p: 1
      }}
    >
      {/* Static/Persistent Components */}
      {/* <CompactCharacterPanel /> */}
      <EssenceDisplay currentEssence={currentEssence} />
      <GameControlPanel />
      
      {/* Dynamic Content Slot */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
