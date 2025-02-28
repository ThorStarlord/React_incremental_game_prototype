import React from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Typography 
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const HotkeyHelpTooltip = () => {
  return (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Trait Slot Controls
          </Typography>
          <Typography variant="body2" component="div">
            • Drag and drop traits to equip them
          </Typography>
          <Typography variant="body2" component="div">
            • Click equipped traits to unequip
          </Typography>
          <Typography variant="body2" component="div">
            • Use Shift + Number (1-8) to quickly unequip traits
          </Typography>
        </Box>
      }
      arrow
      placement="top"
    >
      <IconButton size="small" color="primary" sx={{ ml: 1 }}>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  );
};

export default HotkeyHelpTooltip;