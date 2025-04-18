/**
 * @file RightColumn.tsx
 * @description Right sidebar component for the incremental RPG game interface.
 *
 * This component provides a flexible layout for the right side of the game interface,
 * displaying auxiliary game information and interaction panels such as:
 * 
 * - Inventory management
 * - Faction reputation and relationships
 * - Character traits and abilities
 * - Quest logs and objectives
 * - Other supplementary game information
 * 
 * Features:
 * - Collapsible/expandable sections with interactive headers
 * - Component configuration panels
 * - Section maximization for focused interaction
 * - Consistent styling and layout across different panels
 * - Dynamic component rendering based on game state
 * 
 * The component uses a registry pattern to dynamically render component sections
 * based on the provided components prop, allowing for flexible UI composition.
 * 
 * @example
 * // Basic usage with default components
 * <RightColumn 
 *   title="Inventory & Status"
 * />
 * 
 * @example
 * // With specific component selection
 * <RightColumn 
 *   title="Game Info"
 *   components={['InventoryList', 'QuestLog']} 
 * />
 */

import React, { useState, ReactNode, memo, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton,
  Collapse,
  Tooltip,
  Divider,
  useTheme,
  SxProps,
  Theme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import MaximizeIcon from '@mui/icons-material/Maximize';
import MinimizeIcon from '@mui/icons-material/Minimize';

// Fix imports by using correct paths
//import InventoryList from '../../features/Inventory/components/containers/InventoryList';
//import FactionInfo from '../../features/Factions/components/ui/FactionSummaryPanel';
import PlayerTraits from '../../features/Traits/components/containers/CompactTraitPanel';
import styles from './RightColumn.module.css';

/**
 * Component registry item with metadata
 * 
 * Defines the structure for components that can be displayed in the right column.
 * Each component is registered with title, description, and default expansion state.
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
 * Props for the ConfigPanel component
 */
interface ConfigPanelProps {
  /** Title of the section being configured */
  title: string;
  
  /** Function to close the config panel */
  onClose: (event: React.MouseEvent) => void;
}

/**
 * Props for the SectionHeader component
 */
interface SectionHeaderProps {
  /** Title to display in the header */
  title: string;
  
  /** Whether the section is expanded */
  isExpanded: boolean;
  
  /** Whether the section is in configuration mode */
  isConfiguring: boolean;
  
  /** Whether the section is maximized */
  isMaximized: boolean;
  
  /** Function to toggle expanded state */
  onToggleExpand: () => void;
  
  /** Function to toggle configuration mode */
  onToggleConfig: (event: React.MouseEvent) => void;
  
  /** Function to toggle maximized state */
  onToggleMaximize: (event: React.MouseEvent) => void;
}

/**
 * Props for a collapsible section
 * 
 * Defines the properties required for each collapsible section
 * that wraps content panels in the right column.
 */
interface CollapsibleSectionProps {
  /** Unique identifier for the section */
  id: string;
  
  /** Display title shown in the header */
  title: string;
  
  /** React node(s) to display inside the section */
  content: ReactNode;
  
  /** Whether the section is expanded */
  isExpanded: boolean;
  
  /** Whether the section is in configuration mode */
  isConfiguring: boolean;
  
  /** Whether the section is maximized */
  isMaximized: boolean;
  
  /** Function to toggle expanded state */
  onToggleExpand: (id: string) => void;
  
  /** Function to toggle configuration mode */
  onToggleConfig: (id: string, event: React.MouseEvent) => void;
  
  /** Function to toggle maximized state */
  onToggleMaximize: (id: string, event: React.MouseEvent) => void;
  
  /** Optional CSS class name for the section container */
  className?: string;
  
  /** Optional CSS class name for the content area */
  contentClassName?: string;
}

/**
 * Props for the RightColumn component
 * 
 * Defines all available configuration options for the right column layout.
 */
interface RightColumnProps {
  /** Array of component IDs to render from the registry */
  components?: string[];
  
  /** Title displayed at the top of the column */
  title?: string;
  
  /** Additional Material-UI style props to apply to the column */
  sx?: SxProps<Theme>;
}

/**
 * ConfigPanel Component
 * 
 * Displays a configuration overlay for sections with editable options
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
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Configuration options for {title}
        </Typography>
      </Box>
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
 * SectionHeader Component
 * 
 * Displays the header for each collapsible section with controls
 */
const SectionHeader = memo<SectionHeaderProps>(({
  title,
  isExpanded,
  isConfiguring,
  isMaximized,
  onToggleExpand,
  onToggleConfig,
  onToggleMaximize
}) => {
  const theme = useTheme();
  
  return (
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
      onClick={onToggleExpand}
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
        <Tooltip title="Configure">
          <IconButton 
            size="small" 
            onClick={onToggleConfig}
            color={isConfiguring ? "primary" : "default"}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh">
          <IconButton size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={isMaximized ? "Restore" : "Maximize"}>
          <IconButton 
            size="small"
            onClick={onToggleMaximize}
          >
            {isMaximized ? 
              <MinimizeIcon fontSize="small" /> : 
              <MaximizeIcon fontSize="small" />
            }
          </IconButton>
        </Tooltip>
        <IconButton size="small">
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
    </Box>
  );
});

/**
 * CollapsibleSection Component
 * 
 * A reusable section with collapsible content, configuration overlay,
 * and maximization capabilities.
 */
const CollapsibleSection = memo<CollapsibleSectionProps>(({
  id,
  title,
  content,
  isExpanded,
  isConfiguring,
  isMaximized,
  onToggleExpand,
  onToggleConfig,
  onToggleMaximize,
  className = '',
  contentClassName = ''
}) => {
  const theme = useTheme();
  
  // Combine dynamic classes
  const sectionClasses = [
    className,
    isMaximized ? styles['maximized-section'] : ''
  ].filter(Boolean).join(' ');
  
  // Hide other sections if a section is maximized
  if (isMaximized && isMaximized !== id) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        overflow: 'hidden',
        border: isConfiguring 
          ? `2px dashed ${theme.palette.primary.main}` 
          : 'none',
        flex: isMaximized ? 1 : 'none'
      }}
      className={sectionClasses}
    >
      <SectionHeader 
        title={title}
        isExpanded={isExpanded}
        isConfiguring={isConfiguring}
        isMaximized={isMaximized}
        onToggleExpand={() => onToggleExpand(id)}
        onToggleConfig={(e) => onToggleConfig(id, e)}
        onToggleMaximize={(e) => onToggleMaximize(id, e)}
      />
      
      <Collapse in={isExpanded}>
        <Box 
          className={contentClassName}
          sx={{ 
            position: 'relative',
            p: 2,
            height: isMaximized ? 'calc(100% - 48px)' : undefined
          }}
        >
          {isConfiguring && (
            <ConfigPanel 
              title={title}
              onClose={(e) => onToggleConfig(id, e)}
            />
          )}
          {content}
        </Box>
      </Collapse>
    </Paper>
  );
});

/**
 * RightColumn Component
 * 
 * A flexible side panel for displaying inventory, faction information, player traits,
 * and other supplementary game information.
 * 
 * @component
 */
const RightColumn: React.FC<RightColumnProps> = ({ 
  components = ['InventoryList', 'FactionInfo', 'PlayerTraits'], 
  title = 'Inventory & Traits',
  sx = {}
}) => {
  const theme = useTheme();
  
  // State management with hooks
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    inventoryList: true,
    factionInfo: true,
    playerTraits: true
  });
  
  const [configMode, setConfigMode] = useState<Record<string, boolean>>({});
  const [maximized, setMaximized] = useState<string | null>(null);

  // Event handlers with useCallback
  const toggleExpand = useCallback((sectionId: string): void => {
    setExpanded(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const toggleConfig = useCallback((sectionId: string, event: React.MouseEvent): void => {
    event.stopPropagation();
    setConfigMode(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const toggleMaximize = useCallback((sectionId: string, event: React.MouseEvent): void => {
    event.stopPropagation();
    setMaximized(prev => prev === sectionId ? null : sectionId);
  }, []);

  // Component registry
  const componentRegistry: Record<string, ComponentRegistryItem> = {
    InventoryList: {
      component: InventoryList,
      title: 'Inventory',
      description: 'Displays player inventory items',
      defaultExpanded: true
    },
    FactionInfo: {
      component: FactionInfo,
      title: 'Faction Status',
      description: 'Shows faction relationships and reputation',
      defaultExpanded: true
    },
    PlayerTraits: {
      component: PlayerTraits,
      title: 'Character Traits',
      description: 'Displays active traits and abilities',
      defaultExpanded: true
    }
  };

  // Render component from registry
  const renderComponent = useCallback((componentId: string): React.ReactNode => {
    const metadata = componentRegistry[componentId] || {
      title: componentId,
      description: 'Unknown component',
      defaultExpanded: true
    };

    // Use registry component if available
    const ComponentToRender = metadata.component;
    if (!ComponentToRender) return null;

    // Initialize expansion state if not already set
    if (expanded[componentId.toLowerCase()] === undefined) {
      setExpanded(prev => ({
        ...prev,
        [componentId.toLowerCase()]: metadata.defaultExpanded
      }));
    }

    const id = componentId.toLowerCase();
    const isExpanded = expanded[id] !== false;
    const isConfiguring = configMode[id] || false;
    const isMaximized = maximized === id;

    const className = componentId === 'FactionInfo' ? styles['faction-info'] : 
                      componentId === 'PlayerTraits' ? styles['player-traits'] : '';

    return (
      <CollapsibleSection
        key={componentId}
        id={id}
        title={metadata.title}
        content={<ComponentToRender />}
        isExpanded={isExpanded}
        isConfiguring={isConfiguring}
        isMaximized={isMaximized}
        onToggleExpand={toggleExpand}
        onToggleConfig={toggleConfig}
        onToggleMaximize={toggleMaximize}
        className={className}
      />
    );
  }, [expanded, configMode, maximized, componentRegistry, toggleExpand, toggleConfig, toggleMaximize]);

  return (
    <Box 
      className={styles.column}
      id="right-column"
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        flex: 1,
        ...sx
      }}
    >
      <Paper 
        className={styles['column-paper']}
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
          {components.map((componentId) => renderComponent(componentId))}
        </Box>
      </Paper>
    </Box>
  );
};

export default memo(RightColumn);
