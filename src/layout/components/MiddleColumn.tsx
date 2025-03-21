/**
 * @file MiddleColumn.tsx
 * @description Central column layout component for the incremental RPG game interface.
 *
 * This component provides a flexible and interactive layout for the main game content,
 * rendering various game panels in a configurable, collapsible format. It serves as
 * a container for primary game interfaces like:
 * 
 * - Main game content area (interactions, dialogs, etc.)
 * - World map for navigation and exploration
 * - Battle interface for combat encounters
 * - Other dynamic game components
 * 
 * Features:
 * - Collapsible/expandable sections with headers
 * - Section configuration panels
 * - Section maximization (focus on single section)
 * - Drag handles for potential future drag-and-drop reorganization
 * - Consistent styling and layout management
 * 
 * The component uses a registry pattern where components are registered with metadata
 * and rendered dynamically based on the components prop.
 * 
 * @example
 * // Basic usage with default components
 * <MiddleColumn 
 *   title="Game World"
 *   onTownSelect={handleTownSelect} 
 * />
 * 
 * @example
 * // With specific components and active content
 * <MiddleColumn 
 *   components={['Battle', 'Inventory']}
 *   selectedTownId="northshire"
 *   onTownSelect={handleTownSelect}
 *   onBackToWorldMap={handleBackToMap}
 * />
 */

import React, { useState, ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Collapse,
  IconButton,
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
// Fix imports by using type assertions
import Battle from '../../features/Combat/components/containers/Battle';
// Fix WorldMap import by using explicit require with type assertion
const WorldMap = require('../../features/World/components/containers/WorldMap').default as React.FC<WorldMapProps>;
import MainContent from '../../shared/components/layout/MainContent';
import styles from './styles/MiddleColumn.module.css';

/**
 * Component registry item with metadata
 * 
 * Defines the structure for components that can be displayed in the middle column.
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
 * Props for a collapsible section
 * 
 * Defines the interface for the inner CollapsibleSection component
 * that wraps each main content area.
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
 * Props for the MiddleColumn component
 * 
 * Defines all available configuration options for the middle column layout.
 */
interface MiddleColumnProps {
  /** Array of component IDs to render from the component registry */
  components?: string[];
  
  /** Title displayed at the top of the column */
  title?: string;
  
  /** ID of currently selected town (for MainContent and related views) */
  selectedTownId?: string;
  
  /** ID of currently selected NPC (for dialogue and interaction) */
  selectedNpcId?: string;
  
  /** Currently selected dungeon data (for dungeon exploration) */
  selectedDungeon?: any;
  
  /** Whether the player is currently in exploration mode */
  isExploring?: boolean;
  
  /** Callback function triggered when a town is selected on the map */
  onTownSelect?: (townId: string) => void;
  
  /** Callback function to exit town/dungeon view and return to world map */
  onBackToWorldMap?: () => void;
  
  /** Additional Material-UI style props to apply to the column */
  sx?: SxProps<Theme>;
}

/**
 * Props for the MainContent component
 */
interface MainContentProps {
  /** ID of currently selected town */
  selectedTownId?: string;
  
  /** ID of currently selected NPC */
  selectedNpcId?: string;
  
  /** Selected dungeon data */
  selectedDungeon?: any;
  
  /** Whether the player is currently exploring */
  isExploring?: boolean;
  
  /** Callback to return to world map */
  onBackToWorldMap?: () => void;
  
  /** Content to display in the component */
  children?: React.ReactNode;
}

/**
 * Props for the WorldMap component
 */
interface WorldMapProps {
  /** Callback when a town is selected */
  onTownSelect?: (townId: string) => void;
  
  /** Callback when a dungeon is selected */
  onDungeonSelect?: (dungeonId: string, regionId: string) => void;
}

/**
 * MiddleColumn Component
 * 
 * The central layout component for the game interface, displaying the main game content,
 * world map, battle interface, and other dynamic content sections. Supports collapsible 
 * panels, configuration options, and responsive layout.
 * 
 * Each section (MainContent, WorldMap, Battle, etc.) is wrapped in a collapsible panel
 * with a standard header providing expand/collapse, configure, refresh, and maximize
 * functionality.
 * 
 * @component
 */
const MiddleColumn: React.FC<MiddleColumnProps> = ({ 
  components = ['Battle'],
  title = 'Game World',
  selectedTownId, 
  selectedNpcId, 
  selectedDungeon, 
  isExploring, 
  onTownSelect, 
  onBackToWorldMap,
  sx = {}
}) => {
  const theme = useTheme();
  
  /**
   * State for tracking which sections are expanded/collapsed
   * Default to all sections being expanded
   */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    mainContent: true,
    worldMap: true,
    battle: true
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
   * Each component is registered with metadata like title and description
   */
  const componentRegistry: Record<string, ComponentRegistryItem> = {
    Battle: {
      component: Battle,
      title: 'Battle',
      description: 'Combat interface for engaging enemies',
      defaultExpanded: true
    },
    MainContent: {
      component: MainContent,
      title: 'Game Content',
      description: 'Main game interaction area',
      defaultExpanded: true
    },
    WorldMap: {
      component: WorldMap,
      title: 'World Map',
      description: 'Map of the game world',
      defaultExpanded: true
    }
  };

  /**
   * CollapsibleSection Component
   * 
   * Inner component that wraps each content section with a collapsible header
   * and provides functionality like expand/collapse, configure, etc.
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
      isMaximized ? styles['maximized-section'] : ''
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
          className={styles['section-header']}
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
            className={[styles['section-content'], contentClassName].filter(Boolean).join(' ')}
            sx={{ 
              position: 'relative',
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
   * Renders a registered component based on its ID
   * 
   * Looks up the component in the registry and renders it with
   * appropriate metadata and wrapper.
   * 
   * @param componentId - ID of the component to render
   * @returns JSX for the rendered component or null if not found
   */
  const renderComponent = (componentId: string): React.ReactNode => {
    const metadata = componentRegistry[componentId] || {
      title: componentId,
      description: 'Unknown component'
    };

    // Use registry component if available, otherwise return null
    const ComponentToRender = metadata.component;
    if (!ComponentToRender) return null;

    return (
      <CollapsibleSection
        key={componentId}
        id={componentId.toLowerCase()}
        title={metadata.title}
        className={styles['battle-module']}
        content={<ComponentToRender />}
      />
    );
  };

  // Prepare props for specific components
  const mainContentProps: MainContentProps = {
    selectedTownId,
    selectedNpcId,
    selectedDungeon,
    isExploring,
    onBackToWorldMap
  };

  const worldMapProps: WorldMapProps = {
    onTownSelect,
    onDungeonSelect: (dungeonId, regionId) => {
      console.log("Dungeon Selected:", dungeonId, regionId);
    }
  };

  return (
    <Box 
      className={styles.column} 
      id="middle-column"
      sx={{ 
        ...sx,
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        flex: 2
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
        
        {/* Game Content Section */}
        <CollapsibleSection
          id="mainContent"
          title="Game Content"
          className={styles['main-content-container']}
          content={
            <Box className={styles['section-content']}>
              <MainContent>
                {/* Render content based on props */}
                <Box>
                  {selectedTownId && <Typography>Selected town: {selectedTownId}</Typography>}
                  {selectedNpcId && <Typography>Speaking with: {selectedNpcId}</Typography>}
                  {selectedDungeon && <Typography>Exploring dungeon</Typography>}
                  {isExploring && <Typography>Exploring area...</Typography>}
                  {onBackToWorldMap && (
                    <Box sx={{ mt: 2 }}>
                      <button onClick={onBackToWorldMap}>Return to World Map</button>
                    </Box>
                  )}
                </Box>
              </MainContent>
            </Box>
          }
        />

        {/* World Map Section */}
        <CollapsibleSection
          id="worldMap"
          title="World Map"
          className={styles['world-map-wrapper']}
          content={
            <Box className={styles['section-content']}>
              <WorldMap {...worldMapProps} />
            </Box>
          }
        />

        {/* Battle and other components */}
        <Box 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            mt: maximized ? 0 : 2
          }}
        >
          {components.map((componentId) => renderComponent(componentId))}
        </Box>
      </Paper>
    </Box>
  );
};

export default MiddleColumn;
