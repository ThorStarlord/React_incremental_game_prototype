/**
 * @file LeftColumn.tsx
 * @description Left sidebar component for the incremental RPG game interface.
 *
 * This component provides a flexible container for character-related panels and
 * information that appears on the left side of the game interface.
 * 
 * This component renders various sub-components in a configurable, collapsible format, including:
 * - Player statistics and attributes
 * - Resource displays (essence, currencies)
 * - Other character-related functionality
 * 
 * Features:
 * - Dynamic component rendering from a registry
 * - Collapsible/expandable sections with headers
 * - Configuration panels for each component
 * - Consistent styling across all components
 * - Drag handles for potential future reorganization
 * 
 * The component uses a component registry pattern to allow for flexible
 * configuration of which components to display and in what order.
 * 
 * @example
 * // Basic usage with default components
 * <LeftColumn 
 *   title="Character" 
 * />
 * 
 * @example
 * // With custom component selection
 * <LeftColumn 
 *   title="My Character" 
 *   components={['PlayerStats', 'EssenceDisplay']} 
 * />
 */

import React, { useState, ReactNode, memo, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  IconButton, 
  Collapse, 
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  Tooltip,
  SxProps,
  Theme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import PlayerStats from '../../features/Player/components/containers/PlayerStats';
import EssenceDisplay from '../../features/Essence/components/ui/EssenceDisplay';

/**
 * Component registry item with metadata
 * 
 * Defines the structure for components that can be displayed in the left column.
 * Each component is registered with a title, description, and default expanded state.
 */
interface ComponentRegistryItem {
  /** React component to render */
  component: React.ComponentType<any>;
  
  /** Display title for the component section */
  title: string;
  
  /** Descriptive text explaining the component's purpose */
  description: string;
  
  /** Whether the component should be expanded by default */
  defaultExpanded: boolean;
}

/**
 * Props for the LeftColumn component
 * 
 * Defines all available configuration options for the left column layout.
 */
interface LeftColumnProps {
  /** Array of component IDs to render from the component registry */
  components?: string[];
  
  /** Title displayed at the top of the column */
  title?: string;
  
  /** Additional Material-UI style props to apply to the column */
  sx?: SxProps<Theme>;
}

/**
 * Props for the ConfigPanel component
 */
interface ConfigPanelProps {
  /** Component title being configured */
  title: string;
  /** Function to call when closing the config panel */
  onClose: (event: React.MouseEvent) => void;
}

/**
 * Props for the CollapsibleSection component
 */
interface CollapsibleSectionProps {
  /** Unique component ID */
  componentId: string;
  /** Component title */
  title: string;
  /** Description of the component */
  description: string;
  /** Whether the section should be expanded */
  isExpanded: boolean;
  /** Whether the section is in configuration mode */
  isConfiguring: boolean;
  /** Function to toggle expand state */
  onToggleExpand: (componentId: string) => void;
  /** Function to toggle configuration mode */
  onToggleConfig: (componentId: string, event: React.MouseEvent) => void;
  /** Component to render inside the section */
  children: ReactNode;
}

/**
 * ConfigPanel Component
 * 
 * Displays configuration options for a component in an overlay panel
 */
const ConfigPanel = memo<ConfigPanelProps>(({ title, onClose }) => {
  return (
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
      <Typography variant="h6">Configure {title}</Typography>
      <Divider sx={{ my: 1 }} />
      <List dense>
        <ListItemButton>
          <ListItemText 
            primary="Auto refresh" 
            secondary="Automatically refresh data" 
          />
        </ListItemButton>
        
        <ListItemButton>
          <ListItemText 
            primary="Show details" 
            secondary="Display additional information" 
          />
        </ListItemButton>
        
        <ListItemButton>
          <ListItemText 
            primary="Visual style" 
            secondary="Change how this component looks" 
          />
        </ListItemButton>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton 
          color="primary" 
          onClick={onClose}
        >
          Done
        </IconButton>
      </Box>
    </Box>
  );
});

/**
 * CollapsibleSection Component
 * 
 * Renders an individual collapsible section with header controls
 * and configuration overlay
 */
const CollapsibleSection = memo<CollapsibleSectionProps>(({
  componentId,
  title,
  description,
  isExpanded,
  isConfiguring,
  onToggleExpand,
  onToggleConfig,
  children
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        overflow: 'hidden',
        border: isConfiguring 
          ? `2px dashed ${theme.palette.primary.main}` 
          : 'none'
      }}
    >
      {/* Section header */}
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
        onClick={() => onToggleExpand(componentId)}
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
            {title}
          </Typography>
        </Box>
        
        <Box>
          {/* Configuration button */}
          <Tooltip title="Configure">
            <IconButton 
              size="small" 
              onClick={(e) => onToggleConfig(componentId, e)}
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
      
      {/* Section content */}
      <Collapse in={isExpanded}>
        <Box 
          sx={{ 
            p: 2,
            position: 'relative'
          }}
        >
          {/* Config panel overlay */}
          {isConfiguring && (
            <ConfigPanel 
              title={title} 
              onClose={(e) => onToggleConfig(componentId, e)} 
            />
          )}
          
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
});

/**
 * LeftColumn Component
 * 
 * A flexible side panel for displaying character information, player stats,
 * and essence display.
 * 
 * @component
 */
const LeftColumn: React.FC<LeftColumnProps> = ({ 
  components = ['PlayerStats', 'EssenceDisplay'], 
  title = 'Character',
  sx = {}
}) => {
  const theme = useTheme();
  
  /**
   * State for tracking which components are expanded/collapsed
   */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
  /**
   * State for tracking which components are in configuration mode
   */
  const [configMode, setConfigMode] = useState<Record<string, boolean>>({});

  /**
   * Toggle the expanded/collapsed state of a component
   */
  const toggleExpand = useCallback((componentId: string): void => {
    setExpanded(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  }, []);

  /**
   * Toggle configuration mode for a component
   */
  const toggleConfig = useCallback((componentId: string, event: React.MouseEvent): void => {
    event.stopPropagation();
    setConfigMode(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  }, []);

  /**
   * Registry of available components that can be rendered in the column
   */
  const componentRegistry: Record<string, ComponentRegistryItem> = {
    PlayerStats: {
      component: PlayerStats,
      title: 'Player Stats',
      description: 'Shows player statistics and attributes',
      defaultExpanded: true
    },
    EssenceDisplay: {
      component: EssenceDisplay,
      title: 'Essence',
      description: 'Shows accumulated essence and generation rate',
      defaultExpanded: true
    }
  };

  /**
   * Renders a component based on its ID
   */
  const renderComponent = useCallback((componentId: string, index: number): React.ReactNode => {
    // Get component metadata or use default values if not found
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
      <CollapsibleSection
        key={`${componentId}-${index}`}
        componentId={componentId}
        title={metadata.title}
        description={metadata.description}
        isExpanded={isExpanded}
        isConfiguring={isConfiguring}
        onToggleExpand={toggleExpand}
        onToggleConfig={toggleConfig}
      >
        <ComponentToRender />
      </CollapsibleSection>
    );
  }, [expanded, configMode, componentRegistry, toggleExpand, toggleConfig]);

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

export default memo(LeftColumn);
