import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { CompactCharacterPanel } from '../../features/Player/components/ui/CompactCharacterPanel';
import { EssenceDisplay } from '../../features/Essence/components/ui/EssenceDisplay';
import { GameControlPanel } from '../../features/GameLoop/components/ui/GameControlPanel';

/**
 * Left column layout component that renders persistent status displays
 * and provides an outlet for dynamic routed content
 */
export const LeftColumnLayout: React.FC = () => {
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
      <CompactCharacterPanel />
      <EssenceDisplay />
      <GameControlPanel />
      
      {/* Dynamic Content Slot */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
