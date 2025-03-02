import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Collapse,
  IconButton,
  Tooltip,
  Divider,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import MaximizeIcon from '@mui/icons-material/Maximize';
import MinimizeIcon from '@mui/icons-material/Minimize';
import Battle from '../combat/Battle';
import WorldMap from './panels/WorldMap';
import MainContent from '../MainContent';
import styles from './styles/MiddleColumn.module.css'; // Fixed import path

/**
 * MiddleColumn Component
 * 
 * @component
 * @description
 * Central column layout component displaying the main game content, world map,
 * and battle interface. Supports collapsible sections and configuration panels.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.components - Array of component IDs to render
 * @param {String} props.title - Title of the column
 * @param {String} props.selectedTownId - ID of selected town
 * @param {String} props.selectedNpcId - ID of selected NPC
 * @param {Object} props.selectedDungeon - Selected dungeon data
 * @param {Boolean} props.isExploring - Whether the player is currently exploring
 * @param {Function} props.onTownSelect - Callback when a town is selected
 * @param {Function} props.onBackToWorldMap - Callback to return to world map
 */
const MiddleColumn = ({ 
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
  const [expanded, setExpanded] = useState({
    mainContent: true,
    worldMap: true,
    battle: true
  });
  const [configMode, setConfigMode] = useState({});
  const [maximized, setMaximized] = useState(null);

  // Toggle section expansion state
  const toggleExpand = (sectionId) => {
    setExpanded(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Toggle configuration mode for a section
  const toggleConfig = (sectionId, event) => {
    event.stopPropagation();
    setConfigMode(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Toggle maximized state for a section
  const toggleMaximize = (sectionId, event) => {
    event.stopPropagation();
    setMaximized(prev => prev === sectionId ? null : sectionId);
  };

  // Component registry with metadata
  const componentRegistry = {
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
   * Creates a collapsible section with header
   * @param {string} id - Unique section ID
   * @param {string} title - Section title
   * @param {React.ReactNode} content - Section content
   * @param {string} className - Additional CSS class name for the section
   * @param {string} contentClassName - CSS class name for the content area
   */
  const CollapsibleSection = ({ id, title, content, className = '', contentClassName = '' }) => {
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
   */
  const renderComponent = (componentId) => {
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
  const mainContentProps = {
    selectedTownId,
    selectedNpcId,
    selectedDungeon,
    isExploring,
    onBackToWorldMap
  };

  const worldMapProps = {
    onTownSelect,
    onDungeonSelect: (dungeonId, regionId) => {
      console.log("Dungeon Selected:", dungeonId, regionId);
    }
  };

  return (
    <Box 
      className={styles.column} 
      id="middle-column" // Add ID to match CSS selector
      sx={{ 
        ...sx,
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        flex: 2 // Match the CSS flex value 
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
              <MainContent {...mainContentProps} />
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
