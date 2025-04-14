/**
 * @file RightColumn.tsx
 * @description Right sidebar component for the incremental RPG game interface.
 * Renders child components passed to it dynamically.
 */

import React, { ReactNode, memo } from 'react';
import { 
  Box, 
  useTheme,
  SxProps,
  Theme
} from '@mui/material';
import TraitDisplayContainer from '../../features/Traits/components/containers/TraitDisplayContainer';
import TraitSlots from '../../features/Traits/components/containers/TraitSlots';
import IntegratedTraitsPanel from '../../features/Traits/components/containers/IntegratedTraitsPanel';
import TraitAcquisitionPanel from '../../features/Traits/components/containers/TraitAcquisitionPanel';
import TraitsPage from '../../pages/TraitsPage'; // Pf3f0
import AvailableTraitList from '../../features/Traits/components/containers/AvailableTraitList'; // Import AvailableTraitList
import TraitListContainer from '../../features/Traits/components/containers/TraitListContainer'; // Add import for TraitListContainer

/**
 * Props for the RightColumn component
 */
interface RightColumnProps {
  /** Child components to render within the column */
  children?: ReactNode;
  /** Additional Material-UI style props to apply to the column */
  sx?: SxProps<Theme>;
}

/**
 * RightColumn Component
 * 
 * A flexible side panel. Renders dynamically provided children.
 * 
 * @component
 */
const RightColumn: React.FC<RightColumnProps> = ({ 
  children,
  sx = {}
}) => {
  const theme = useTheme();

  return (
    <Box 
      id="right-column"
      sx={{ 
        ...sx,
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2,
        width: { xs: '100%', md: '25%', lg: '20%' }, // Example responsive widths
        minWidth: { md: 280 }, // Example minimum width for medium screens and up
        flexShrink: 0, // Prevent shrinking below minWidth
        overflowY: 'auto', // Allow scrolling if content overflows
        p: 1, // Add some padding
        borderLeft: { md: '1px solid' }, // Add divider on larger screens
        borderColor: { md: 'divider' }
      }}
    >
      {/* Add the TraitDisplayContainer */}
      <TraitListContainer /> {/* Add TraitListContainer */}
      <AvailableTraitList /> {/* Add AvailableTraitList here */}
      <TraitDisplayContainer /> 
      <TraitSlots />
      <IntegratedTraitsPanel onClose={() => {}} />
      <TraitAcquisitionPanel />
      
      <TraitsPage /> {/* Pbabb */}
      
      {/* Render children passed from MainGameLayout */}
      {children}
    </Box>
  );
};

export default memo(RightColumn);
