import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  IconButton, 
  Collapse, 
  List,
  ListItem,
  ListItemText,
  useTheme,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import PlayerStats from '../../features/player/components/PlayerStats';
import InventoryList from '../InventoryList';
import EssenceDisplay from '../EssenceDisplay';
import CompactCharacterPanel from '../characters/CompactCharacterPanel';

/**
 * LeftColumn Component
 * 
 * @component
 * @description
 * A flexible column layout component for the left side of the game interface.
 * Supports various component sections that can be dynamically rendered, collapsed,
 * and configured.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.components - Array of component IDs to render
 * @param {String} props.title - Title of the column
 * @param {Object} props.sx - Additional MUI styles
 */
const LeftColumn = ({ 
  components = ['PlayerStats'], 
  title = 'Character',
  sx = {}
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState({});
  const [configMode, setConfigMode] = useState({});

  // Toggle section expansion state
  const toggleExpand = (componentId) => {
    setExpanded(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  };

  // Toggle configuration mode for a component
  const toggleConfig = (componentId, event) => {
    event.stopPropagation();
    setConfigMode(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  };

  // Component registry with metadata
  const componentRegistry = {
    PlayerStats: {
      component: PlayerStats,
      title: 'Player Stats',
      description: 'Shows player statistics and attributes',
      defaultExpanded: true
    },
    InventoryList: {
      component: InventoryList,
      title: 'Inventory',
      description: 'Displays player inventory items',
      defaultExpanded: true
    },
    EssenceDisplay: {
      component: EssenceDisplay,
      title: 'Essence',
      description: 'Shows accumulated essence and generation rate',
      defaultExpanded: true
    },
    CompactCharacterPanel: {
      component: CompactCharacterPanel,
      title: 'Characters',
      description: 'Shows brief overview of characters',
      defaultExpanded: true
    }
  };

  /**
   * Renders a component based on its ID
   * @param {string} componentId - ID of component to render
   * @param {number} index - Index position of component in array
   */
  const renderComponent = (componentId, index) => {
    const metadata = componentRegistry[componentId] || {
      title: componentId,
      description: 'Unknown component',
      defaultExpanded: true
    };

    // Use registry component if available, otherwise return null
    const ComponentToRender = metadata.component;
    if (!ComponentToRender) return null;

    // Initialize expansion state if not already set
    if (expanded[componentId] === undefined) {
      setExpanded(prev => ({
        ...prev,
        [componentId]: metadata.defaultExpanded
      }));
    }

    const isExpanded = expanded[componentId] !== false;
    const isConfiguring = configMode[componentId] || false;

    return (
      <Paper
        key={`${componentId}-${index}`}
        elevation={2}
        sx={{
          mb: 2,
          overflow: 'hidden',
          border: isConfiguring 
            ? `2px dashed ${theme.palette.primary.main}` 
            : 'none'
        }}
      >
        {/* Component header */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            bgcolor: theme.palette.mode === 'dark' 
              ? 'background.paper' 
              : 'grey.100',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' 
                ? 'action.hover' 
                : 'grey.200',
            }
          }}
          onClick={() => toggleExpand(componentId)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DragHandleIcon 
              sx={{ 
                color: 'text.secondary', 
                mr: 1,
                cursor: 'grab'
              }} 
            />
            <Typography variant="subtitle1" fontWeight="medium">
              {metadata.title}
            </Typography>
          </Box>
          
          <Box>
            {/* Configuration button */}
            <Tooltip title="Configure">
              <IconButton 
                size="small" 
                onClick={(e) => toggleConfig(componentId, e)}
                color={isConfiguring ? "primary" : "default"}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {/* Refresh button */}
            <Tooltip title="Refresh">
              <IconButton size="small">
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {/* Expand/collapse button */}
            <IconButton size="small">
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
        
        {/* Component content */}
        <Collapse in={isExpanded}>
          <Box 
            sx={{ 
              p: 2,
              position: 'relative'
            }}
          >
            {/* Config panel overlay */}
            {isConfiguring && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'background.paper',
                  opacity: 0.9,
                  zIndex: 1,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h6">Configure {metadata.title}</Typography>
                <Divider sx={{ my: 1 }} />
                <List dense>
                  <ListItem button>
                    <ListItemText 
                      primary="Auto refresh" 
                      secondary="Automatically refresh data" 
                    />
                  </ListItem>
                  <ListItem button>
                    <ListItemText 
                      primary="Show details" 
                      secondary="Display additional information" 
                    />
                  </ListItem>
                  <ListItem button>
                    <ListItemText 
                      primary="Visual style" 
                      secondary="Change how this component looks" 
                    />
                  </ListItem>
                </List>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton 
                    color="primary" 
                    onClick={(e) => toggleConfig(componentId, e)}
                  >
                    Done
                  </IconButton>
                </Box>
              </Box>
            )}
            
            <ComponentToRender />
          </Box>
        </Collapse>
      </Paper>
    );
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        ...sx
      }}
    >
      <Paper
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'auto'
        }}
        elevation={3}
      >
        <Typography 
          variant="h6" 
          align="center" 
          sx={{ 
            mb: 2,
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {components.map((componentId, index) => renderComponent(componentId, index))}
        </Box>
      </Paper>
    </Box>
  );
};

export default LeftColumn;
