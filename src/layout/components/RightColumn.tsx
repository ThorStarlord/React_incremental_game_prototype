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

import React, { useState, ReactNode } from 'react';
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
import InventoryList from '../../features/Inventory/components/containers/InventoryList';
import FactionInfo from '../../features/Factions/components/ui/FactionSummaryPanel';
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
 * RightColumn Component
 * 
 * A flexible side panel for displaying inventory, faction information, player traits,
 * and other supplementary game information. Each section is wrapped in a collapsible
 * panel with interactive controls for configuration and maximization.
 * 
 * The component dynamically renders requested components based on game state
 * and player progression, adapting to show relevant information at each stage.
 * 
 * @component
 */
const RightColumn: React.FC<RightColumnProps> = ({ 
  components = ['InventoryList', 'FactionInfo', 'PlayerTraits'], 
  title = 'Inventory & Traits',
  sx = {}
}) => {
  const theme = useTheme();
  
  /**
   * State for tracking which sections are expanded/collapsed
   * Default to all sections being expanded
   */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    inventoryList: true,
    factionInfo: true,
    playerTraits: true
  });
  
  /**
   * State for tracking which sections are in configuration mode
   */
  const [configMode, setConfigMode] = useState<Record<string, boolean>>({});
  
  /**
   * State for tracking which section (if any) is maximized to fill the column
   */
  const [maximized, setMaximized] = useState<string | null>(null);

  /**
   * Toggle the expanded/collapsed state of a section
   * 
   * @param sectionId - ID of the section to toggle
   */
  const toggleExpand = (sectionId: string): void => {
    setExpanded(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  /**
   * Toggle configuration mode for a section
   * 
   * @param sectionId - ID of the section to configure
   * @param event - Click event (stopped from propagating to prevent toggling expand)
   */
  const toggleConfig = (sectionId: string, event: React.MouseEvent): void => {
    event.stopPropagation();
    setConfigMode(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  /**
   * Toggle maximized state for a section
   * 
   * @param sectionId - ID of the section to maximize/restore
   * @param event - Click event (stopped from propagating to prevent toggling expand)
   */
  const toggleMaximize = (sectionId: string, event: React.MouseEvent): void => {
    event.stopPropagation();
    setMaximized(prev => prev === sectionId ? null : sectionId);
  };

  /**
   * Registry of available components that can be rendered in the column
   * Each component is registered with metadata for rendering and behavior
   */
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

  /**
   * CollapsibleSection Component
   * 
   * Inner component that wraps each content section with a collapsible header
   * and provides functionality like expand/collapse, configure, and maximize.
   * 
   * @param props - CollapsibleSection props
   * @returns JSX for the collapsible section
   */
  const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
    id, 
    title, 
    content, 
    className = '', 
    contentClassName = '' 
  }) => {
    const isExpanded = expanded[id] !== false;
    const isConfiguring = configMode[id] || false;
    const isMaximized = maximized === id;
    
    // Combine dynamic classes
    const sectionClasses = [
      className,
      isMaximized ? 'maximized-section' : ''
    ].filter(Boolean).join(' ');
    
    // Hide other sections if a section is maximized
    if (maximized && maximized !== id) {
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
          onClick={() => toggleExpand(id)}
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
                onClick={(e) => toggleConfig(id, e)}
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
                onClick={(e) => toggleMaximize(id, e)}
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
        
        {/* Section content */}
        <Collapse in={isExpanded}>
          <Box 
            className={contentClassName}
            sx={{ 
              position: 'relative',
              p: 2,
              height: isMaximized ? 'calc(100% - 48px)' : undefined
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
                    onClick={(e) => toggleConfig(id, e)}
                  >
                    Done
                  </IconButton>
                </Box>
              </Box>
            )}
            {content}
          </Box>
        </Collapse>
      </Paper>
    );
  };

  /**
   * Renders a component based on its ID
   * 
   * Looks up the component in the registry and renders it with appropriate
   * metadata and wrapper components.
   * 
   * @param componentId - ID of the component to render
   * @returns JSX for the rendered component or null if not found
   */
  const renderComponent = (componentId: string): React.ReactNode => {
    const metadata = componentRegistry[componentId] || {
      title: componentId,
      description: 'Unknown component',
      defaultExpanded: true
    };

    // Use registry component if available, otherwise return null
    const ComponentToRender = metadata.component;
    if (!ComponentToRender) return null;

    return (
      <CollapsibleSection
        key={componentId}
        id={componentId.toLowerCase()}
        title={metadata.title}
        className={componentId === 'FactionInfo' ? styles['faction-info'] : 
                 componentId === 'PlayerTraits' ? styles['player-traits'] : ''}
        content={<ComponentToRender />}
      />
    );
  };

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
        
        {/* Render components from the registry */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {components.map((componentId) => renderComponent(componentId))}
        </Box>
      </Paper>
    </Box>
  );
};

export default RightColumn;
