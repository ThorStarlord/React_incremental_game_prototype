import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Drawer, 
  Box, 
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Tooltip,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PersonIcon from '@mui/material/Icon/Person';
import SportsKabaddiIcon from '@mui/material/Icon/SportsKabaddi';
import AutoFixHighIcon from '@mui/material/Icon/AutoFixHigh';
import IntegratedTraitsPanel from '../../../features/Traits/components/containers/IntegratedTraitsPanel';
import NPCPanel from './npcs/NPCPanel';
import CharactersPanel from '../../../features/Minions/components/ui/CharactersPanel';
import { GameStateContext } from '../../../context/GameStateContext';
import CharacterTabBar from './CharacterTabBar';
import Panel from './Panel';

/**
 * @component CharacterManagementDrawer
 * @description An enhanced slide-out drawer component that provides access to character management features
 * using the CharacterTabBar component for navigation and Panel component for consistent styling.
 * 
 * Features:
 * - Integrated CharacterTabBar for tab navigation with animations and notifications
 * - Responsive design that adapts to different screen sizes
 * - Animated transitions for smooth user experience
 * - Accessible keyboard navigation
 * - Integration with game state context for real-time data
 * - Consistent styling using the Panel component with collapsible sections
 * - Tab-specific icons and notifications
 * 
 * Integration Notes:
 * - Panel component is used as a container with conditional collapsibility
 * - CharacterTabBar handles all tab navigation with custom configuration
 * - Drawer responsively adapts based on screen size
 * 
 * @example
 * // Basic usage
 * <CharacterManagementDrawer 
 *   open={drawerOpen}
 *   onClose={() => setDrawerOpen(false)}
 * />
 * 
 * @example
 * // With initial tab selection
 * <CharacterManagementDrawer 
 *   open={drawerOpen}
 *   onClose={() => setDrawerOpen(false)}
 *   initialTab="npcs" // Opens to NPCs tab
 * />
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the drawer is open
 * @param {Function} props.onClose - Callback function called when the drawer should close
 * @param {string} [props.initialTab="characters"] - The initial active tab key
 * @returns {JSX.Element} The character management drawer component
 */
const CharacterManagementDrawer = ({ open, onClose, initialTab = "characters" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { player, discoveryProgress } = useContext(GameStateContext);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [panelExpanded, setPanelExpanded] = useState(true);
  
  // Reset tab when drawer opens or initialTab changes
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      // Always expand the panel when drawer opens
      setPanelExpanded(true);
    }
  }, [open, initialTab]);
  
  /**
   * Handles tab change events
   * @param {string} tabValue - The new selected tab key
   */
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  /**
   * Handles keyboard navigation
   * @param {React.KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = (event) => {
    // Close drawer on Escape key
    if (event.key === 'Escape') {
      onClose();
    }
  };
  
  // Get counts for badges
  const controlledCharacterCount = player?.controlledCharacters?.length || 0;
  const metNPCCount = discoveryProgress?.metNPCCount || 0;
  const traitCount = player?.acquiredTraits?.length || 0;

  // Configure notifications for CharacterTabBar
  const notifications = {
    characters: controlledCharacterCount > 0 ? controlledCharacterCount : 0,
    npcs: metNPCCount > 0 ? metNPCCount : 0,
    traits: traitCount > 0 ? traitCount : 0
  };

  /**
   * Gets the current tab title for the header
   * @returns {string} The current tab title
   */
  const getCurrentTabTitle = () => {
    const tabTitles = {
      characters: 'Characters',
      npcs: 'NPCs',
      traits: 'Character Traits'
    };
    
    return tabTitles[activeTab] || 'Character Management';
  };
  
  /**
   * Gets the appropriate icon for the current tab
   * @returns {JSX.Element} Icon component for the current tab
   */
  const getCurrentTabIcon = () => {
    const tabIcons = {
      characters: <SportsKabaddiIcon />,
      npcs: <PersonIcon />,
      traits: <AutoFixHighIcon />
    };
    
    return tabIcons[activeTab];
  };
  
  /**
   * Tab configuration with content components
   */
  const tabContent = {
    characters: <CharactersPanel />,
    npcs: <NPCPanel />,
    traits: <IntegratedTraitsPanel />
  };

  /**
   * CharacterTabBar configuration with enhanced features
   */
  const tabBarConfig = {
    defaultTab: activeTab,
    onTabChange: handleTabChange,
    notifications: notifications,
    disabledTabs: [], // All tabs are enabled
    showLabels: true,
    showLoadingIndicators: true,
    tabs: [
      { 
        key: "characters", 
        label: "Characters", 
        icon: <SportsKabaddiIcon />, 
        tooltip: "Manage your characters and minions" 
      },
      { 
        key: "npcs", 
        label: "NPCs", 
        icon: <PersonIcon />, 
        tooltip: "View discovered NPCs and their information" 
      },
      { 
        key: "traits", 
        label: "Traits", 
        icon: <AutoFixHighIcon />, 
        tooltip: "Browse and manage character traits" 
      }
    ]
  };
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { 
          width: { xs: '100%', sm: '450px', md: '500px' }, 
          maxWidth: '100%',
          boxShadow: theme.shadows[8],
        },
        'aria-label': 'Character management panel'
      }}
      SlideProps={{
        timeout: 300
      }}
      onKeyDown={handleKeyDown}
      keepMounted={false}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        bgcolor: 'background.paper',
      }}>
        {/* Header with title and close button */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: theme.palette.mode === 'dark' ? 
            'rgba(255,255,255,0.05)' : 
            'rgba(0,0,0,0.03)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isSmallScreen && (
              <Tooltip title="Close panel">
                <IconButton 
                  onClick={onClose} 
                  aria-label="close panel"
                  edge="start"
                  sx={{ mr: 1 }}
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>
              </Tooltip>
            )}
            <Zoom in={true} style={{ transitionDelay: '100ms' }}>
              <Typography variant="h6" component="h2">
                {getCurrentTabTitle()}
              </Typography>
            </Zoom>
          </Box>
          <Tooltip title="Close panel">
            <IconButton 
              onClick={onClose} 
              aria-label="close character management panel"
              edge="end"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Main content area with CharacterTabBar and tab panels */}
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Use Panel component with enhanced integration */}
          <Panel
            title={getCurrentTabTitle()}
            icon={getCurrentTabIcon()}
            defaultExpanded={panelExpanded}
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              m: 0,
              borderRadius: 0,
              boxShadow: 'none',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Use CharacterTabBar with enhanced configuration */}
              <CharacterTabBar 
                defaultTab={activeTab}
                onTabChange={handleTabChange}
                notifications={notifications}
                disabledTabs={[]}
                showLabels={true}
                showLoadingIndicators={true}
                customTabs={tabBarConfig.tabs}
              />
              
              {/* Content area */}
              <Box sx={{ 
                flexGrow: 1, 
                overflow: 'auto',
                p: 2
              }}>
                <Fade in={true} timeout={300}>
                  <Box>
                    {tabContent[activeTab] || (
                      <Typography color="text.secondary">
                        No content available for this tab.
                      </Typography>
                    )}
                  </Box>
                </Fade>
              </Box>
            </Box>
          </Panel>
        </Box>
        
        {/* Footer with counts */}
        <Box 
          sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
            bgcolor: theme.palette.mode === 'dark' ? 
              'rgba(255,255,255,0.03)' : 
              'rgba(0,0,0,0.02)',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {notifications[activeTab] || 0} {getCurrentTabTitle()} available
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

CharacterManagementDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialTab: PropTypes.string,
};

export default CharacterManagementDrawer;