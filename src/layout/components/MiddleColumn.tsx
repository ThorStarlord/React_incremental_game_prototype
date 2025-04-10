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
 *   components={['Inventory']}
 *   selectedTownId="northshire"
 *   onTownSelect={handleTownSelect}
 *   onBackToWorldMap={handleBackToMap}
 * />
 */

import React, { useState, ReactNode, memo, useCallback } from 'react';
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
// Fix WorldMap import by using explicit require with type assertion
const WorldMap = require('../../features/World/components/containers/WorldMap').default as React.FC<WorldMapProps>;
import MainContent from '../../shared/components/layout/MainContent';
import styles from './styles/MiddleColumn.module.css';

/**
 * Component registry item with metadata
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
 * Props for the MiddleColumn component
 */
interface MiddleColumnProps {
  /** Array of component IDs to render from the component registry */
  components?: string[];
  
  /** Title displayed at the top of the column */
  title?: string;
  
  /** ID of currently selected town (for MainContent and related views) */
  selectedTownId?: string;
  
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
 * Props for the config panel component
 */
interface ConfigPanelProps {
  /** Title of the section being configured */
  title: string;
  
  /** Function to close the config panel */
  onClose: (event: React.MouseEvent) => void;
}

/**
 * Props for the section header component
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
  if (isMaximized === false && Boolean(isMaximized)) {
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
          className={[styles['section-content'], contentClassName].filter(Boolean).join(' ')}
          sx={{ 
            position: 'relative',
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
 * MiddleColumn Component
 * 
 * The central layout component for the game interface, displaying the main game content,
 * world map, and other dynamic content sections.
 * 
 * @component
 */
const MiddleColumn: React.FC<MiddleColumnProps> = ({ 
  components = [],
  title = 'Game World',
  selectedTownId, 
  selectedDungeon, 
  isExploring, 
  onTownSelect, 
  onBackToWorldMap,
  sx = {}
}) => {
  const theme = useTheme();
  
  // State for tracking expanded, configuration mode, and maximized sections
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    mainContent: true,
    worldMap: true
  });
  
  const [configMode, setConfigMode] = useState<Record<string, boolean>>({});
  const [maximized, setMaximized] = useState<string | null>(null);

  // Event handlers with useCallback to prevent unnecessary re-renders
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

  // Registry of available components
  const componentRegistry: Record<string, ComponentRegistryItem> = {
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

  // Memoized function to render a registered component
  const renderComponent = useCallback((componentId: string): React.ReactNode => {
    const metadata = componentRegistry[componentId] || {
      title: componentId,
      description: 'Unknown component'
    };

    // Use registry component if available, otherwise return null
    const ComponentToRender = metadata.component;
    if (!ComponentToRender) return null;

    const isExpanded = expanded[componentId.toLowerCase()] !== false;
    const isConfiguring = configMode[componentId.toLowerCase()] || false;
    const isMaximized = maximized === componentId.toLowerCase();

    return (
      <CollapsibleSection
        key={componentId}
        id={componentId.toLowerCase()}
        title={metadata.title}
        className=""
        content={<ComponentToRender />}
        isExpanded={isExpanded}
        isConfiguring={isConfiguring}
        isMaximized={isMaximized}
        onToggleExpand={toggleExpand}
        onToggleConfig={toggleConfig}
        onToggleMaximize={toggleMaximize}
      />
    );
  }, [expanded, configMode, maximized, componentRegistry, toggleExpand, toggleConfig, toggleMaximize]);

  // Prepare props for specific components
  const mainContentProps: MainContentProps = {
    selectedTownId,
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

  // Calculate state values for predefined sections
  const mainContentExpanded = expanded['maincontent'] !== false;
  const mainContentConfiguring = configMode['maincontent'] || false;
  const mainContentMaximized = maximized === 'maincontent';
  
  const worldMapExpanded = expanded['worldmap'] !== false;
  const worldMapConfiguring = configMode['worldmap'] || false;
  const worldMapMaximized = maximized === 'worldmap';

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
          id="maincontent"
          title="Game Content"
          className={styles['main-content-container']}
          isExpanded={mainContentExpanded}
          isConfiguring={mainContentConfiguring}
          isMaximized={mainContentMaximized}
          onToggleExpand={toggleExpand}
          onToggleConfig={toggleConfig}
          onToggleMaximize={toggleMaximize}
          content={
            <Box className={styles['section-content']}>
              <MainContent {...mainContentProps}>
                {/* Render content based on props */}
                <Box>
                  {selectedTownId && <Typography>Selected town: {selectedTownId}</Typography>}
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
          id="worldmap"
          title="World Map"
          className={styles['world-map-wrapper']}
          isExpanded={worldMapExpanded}
          isConfiguring={worldMapConfiguring}
          isMaximized={worldMapMaximized}
          onToggleExpand={toggleExpand}
          onToggleConfig={toggleConfig}
          onToggleMaximize={toggleMaximize}
          content={
            <Box className={styles['section-content']}>
              <WorldMap {...worldMapProps} />
            </Box>
          }
        />

        {/* Render dynamically added components (if any) */}
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

export default memo(MiddleColumn);
