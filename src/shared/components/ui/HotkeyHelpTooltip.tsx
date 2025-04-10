import React from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Typography,
  Paper,
  Divider,
  Grid,
  SxProps,
  Theme
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';

/**
 * Interface for a single hotkey item
 */
interface Hotkey {
  keys: string[];
  description: string;
}

/**
 * Interface for a category of hotkeys
 */
interface HotkeyCategory {
  name: string;
  hotkeys: Hotkey[];
}

/**
 * Props interface for the HotkeyHelpTooltip component
 */
interface HotkeyHelpTooltipProps {
  title?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start' | 'left-end' | 'left-start' | 'right-end' | 'right-start';
  icon?: React.ReactNode;
  triggerElement?: React.ReactNode;
  hotkeyCategories?: HotkeyCategory[];
  sx?: SxProps<Theme>;
}

/**
 * @component HotkeyHelpTooltip
 * @description A customizable tooltip component that displays hotkey information and instructions.
 * Can be configured with different categories of hotkeys and supports visual representation of
 * keyboard combinations.
 * 
 * Features:
 * - Customizable title and icon
 * - Multiple hotkey categories support
 * - Visual keyboard key representations
 * - Support for key combinations (e.g., Shift + 1)
 * - Customizable tooltip placement
 * - Flexible sizing and styling
 * 
 * @example
 * // Basic usage with default hotkey information
 * <HotkeyHelpTooltip />
 * 
 * @example
 * // Custom hotkey categories and placement
 * <HotkeyHelpTooltip 
 *   title="Combat Controls"
 *   placement="bottom"
 *   hotkeyCategories={[
 *     {
 *       name: "Attacks",
 *       hotkeys: [
 *         { keys: ["Q"], description: "Quick attack" },
 *         { keys: ["W"], description: "Strong attack" }
 *       ]
 *     }
 *   ]}
 * />
 * 
 * @example
 * // With custom trigger element instead of default icon button
 * <HotkeyHelpTooltip triggerElement={<Button>Show Hotkeys</Button>} />
 * 
 * @param {HotkeyHelpTooltipProps} props - Component props
 * @returns {JSX.Element} The hotkey help tooltip component
 */
// Remove explicit return type annotation
const HotkeyHelpTooltip: React.FC<HotkeyHelpTooltipProps> = ({ 
  title = "Keyboard Controls", 
  placement = "top",
  icon = <HelpOutlineIcon />,
  triggerElement = null,
  hotkeyCategories = null,
  sx = {}
}) => {
  // Default hotkey categories if none provided
  const defaultHotkeyCategories: HotkeyCategory[] = [
    {
      name: "Navigation",
      hotkeys: [
        { keys: ["←", "→", "↑", "↓"], description: "Move between elements" },
        { keys: ["Tab"], description: "Next interactive element" },
        { keys: ["Shift", "Tab"], description: "Previous interactive element" },
        { keys: ["Esc"], description: "Close panel or cancel" }
      ]
    },
    {
      name: "Trait Slot Controls",
      hotkeys: [
        { keys: ["Drag"], description: "Equip traits to slots" },
        { keys: ["Click"], description: "Unequip traits" },
        { keys: ["Shift", "1-8"], description: "Quick unequip from slots 1-8" }
      ]
    },
    {
      name: "Character Management",
      hotkeys: [
        { keys: ["C"], description: "Open/close character panel" },
        { keys: ["I"], description: "Open/close inventory" },
        { keys: ["Alt", "S"], description: "Save game" }
      ]
    }
  ];

  // Use provided categories or defaults
  const categories = hotkeyCategories || defaultHotkeyCategories;

  /**
   * Renders a keyboard key with appropriate styling
   * @param {string} keyText - The text to display inside the key
   * @param {number} index - The index of this key in the keys array
   * @param {number} total - Total number of keys in the combination
   * @returns {JSX.Element} The styled keyboard key
   */
  // Remove explicit return type annotation
  const renderKeyboardKey = (keyText: string, index: number, total: number) => (
    <React.Fragment key={`${keyText}-${index}`}>
      <Box 
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: keyText.length > 1 ? '36px' : '24px',
          height: '24px',
          bgcolor: 'background.paper',
          color: 'text.primary',
          border: 1,
          borderColor: 'divider',
          borderRadius: '4px',
          px: 0.75,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          mx: 0.25
        }}
      >
        {keyText}
      </Box>
      {index < total - 1 && keyText !== "Drag" && keyText !== "Click" && (
        <Box component="span" sx={{ mx: 0.25, fontSize: '0.75rem', color: 'text.secondary' }}>
          +
        </Box>
      )}
    </React.Fragment>
  );

  /**
   * Renders hotkeys and their descriptions for a category
   * @param {Hotkey[]} hotkeys - Array of hotkey objects with keys and descriptions
   * @returns {JSX.Element} Grid of hotkey information
   */
  // Remove explicit return type annotation
  const renderHotkeys = (hotkeys: Hotkey[]) => (
    <Grid container spacing={1} sx={{ mt: 0.5 }}>
      {hotkeys.map((hotkey, index) => (
        <Grid item xs={12} key={index} sx={{ 
          display: 'flex', 
          alignItems: 'center',
          py: 0.5
        }}>
          <Box sx={{ minWidth: '100px', display: 'flex', alignItems: 'center', mr: 1 }}>
            {hotkey.keys.map((key, keyIndex) => 
              renderKeyboardKey(key, keyIndex, hotkey.keys.length)
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {hotkey.description}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );

  // The content of the tooltip
  const tooltipContent = (
    <Paper sx={{ p: 1.5, maxWidth: 320 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <KeyboardIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="subtitle1" fontWeight="medium">
          {title}
        </Typography>
      </Box>
      
      {categories.map((category, index) => (
        <Box key={category.name} sx={{ mb: index < categories.length - 1 ? 2 : 0 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            {category.name}
          </Typography>
          {renderHotkeys(category.hotkeys)}
          {index < categories.length - 1 && (
            <Divider sx={{ mt: 1.5, mb: 1 }} />
          )}
        </Box>
      ))}
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          Press '?' anywhere to show this help
        </Typography>
      </Box>
    </Paper>
  );

  // Default trigger is an IconButton
  const defaultTrigger = (
    <IconButton 
      size="small" 
      color="primary" 
      aria-label="show keyboard shortcuts" 
      sx={{ ...sx }}
    >
      {icon}
    </IconButton>
  );

  // Use custom trigger or default
  const trigger = triggerElement || defaultTrigger;

  return (
    <Tooltip
      title={tooltipContent}
      arrow
      placement={placement}
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 4,
            p: 0
          }
        }
      }}
    >
      {/* Cast to any to avoid type issues with the tooltip requiring a single DOM element */}
      {React.cloneElement(trigger as React.ReactElement)}
    </Tooltip>
  );
};

export default HotkeyHelpTooltip;
