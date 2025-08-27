import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Chip,
  Tooltip,
  Stack
} from '@mui/material';
import { ElectricBolt as EssenceIcon } from '@mui/icons-material';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentEssence, selectGenerationRate } from '../../features/Essence/state/EssenceSelectors';
import { selectResonanceETAs } from '../../features/Traits/state/TraitsSelectors';

/**
 * Props for the Header component
 */
interface HeaderProps {
  /** Title displayed in the header */
  title?: string;
}

/**
 * Minimalist Header Component
 * 
 * @component
 * @description
 * Displays only the game title as per REQ-UI-013.
 * 
 * @example
 * return (
 *   <Header title="My Game" />
 * )
 */
const Header: React.FC<HeaderProps> = ({ title = 'Incremental RPG' }) => {
  // Essence HUD data
  const essence = useAppSelector(selectCurrentEssence);
  const ratePerSec = useAppSelector(selectGenerationRate);
  const resonanceEtas = useAppSelector(selectResonanceETAs);

  const nextResonance = resonanceEtas[0];

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar variant="dense" sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}
        >
          {title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={`Passive rate: ${(ratePerSec || 0).toFixed(2)}/s`} arrow>
            <Chip
              color="primary"
              icon={<EssenceIcon />}
              label={`${essence.toLocaleString()} Essence`}
              size="small"
            />
          </Tooltip>
          {nextResonance && (
            <Tooltip
              title={`ETA to resonate '${nextResonance.traitName}': ${nextResonance.etaSeconds.toFixed(0)}s`}
              arrow
            >
              <Chip
                variant="outlined"
                color="secondary"
                label={`Next Resonance: ${nextResonance.etaSeconds < 9999 ? `${nextResonance.etaSeconds.toFixed(0)}s` : '—'}`}
                size="small"
              />
            </Tooltip>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
