import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  Badge, 
  useTheme, 
  useMediaQuery, 
  Tooltip, 
  Typography,
  Paper,
  Divider,
  Chip,
  Fade,
  CircularProgress,
  Button,
  FormControlLabel,
  Switch,
  ButtonGroup,
  Card,
  CardContent
} from '@mui/material';
import PersonIcon from '@mui/material/Icon/Person';
import InventoryIcon from '@mui/material/Icon/Inventory';
import FitnessCenterIcon from '@mui/material/Icon/FitnessCenter';
import ShieldIcon from '@mui/material/Icon/Shield';
import AssignmentIcon from '@mui/material/Icon/Assignment';
import MenuBookIcon from '@mui/material/Icon/MenuBook';
import StarIcon from '@mui/material/Icon/Star';
import BugReportIcon from '@mui/material/Icon/BugReport';

/**
 * @component TabPanel
 * @description A container for tab content that handles accessibility attributes
 * and animations during tab transitions.
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current active tab value
 * @param {string} props.tabKey - This tab panel's key
 * @param {React.ReactNode} props.children - Tab content
 * @param {boolean} [props.animateHeight=true] - Whether to animate height changes
 * @returns {JSX.Element|null} The tab panel component or null if inactive
 */
const TabPanel = ({ value, tabKey, children, animateHeight = true }) => {
  // Only render the tab panel if it's the active tab or was recently active
  const [render, setRender] = useState(value === tabKey);
  const [visible, setVisible] = useState(value === tabKey);
  
  useEffect(() => {
    // If this tab becomes active, ensure it's rendered and visible
    if (value === tabKey) {
      setRender(true);
      // Small delay to ensure the DOM element exists before showing it
      setTimeout(() => setVisible(true), 50);
    } else {
      // If this tab becomes inactive, hide it first, then stop rendering after animation
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300); // Match the fade duration
      return () => clearTimeout(timer);
    }
  }, [value, tabKey]);
  
  if (!render) return null;
  
  return (
    <Fade in={visible} timeout={250}>
      <Box
        role="tabpanel"
        hidden={value !== tabKey}
        id={`character-tabpanel-${tabKey}`}
        aria-labelledby={`character-tab-${tabKey}`}
        sx={{
          transition: animateHeight ? 'max-height 0.3s ease-in-out' : 'none',
          p: 3,
        }}
      >
        {children}
      </Box>
    </Fade>
  );
};

/**
 * @component CharacterTabBar
 * @description A tabbed navigation component for character-related sections in the game.
 * Provides an intuitive interface for switching between different aspects of character
 * management with smooth tab transitions and content loading.
 * 
 * Features:
 * - Responsive design that adapts to screen size
 * - Icon and text labels for better recognition
 * - Badge support for notifications (new items, skill points, etc.)
 * - Custom styling with hover effects
 * - Optional disabled tabs for locked content
 * - Animated tab transitions with loading states
 * - Keyboard navigation support
 * - Content lazy loading
 * - Test mode for previewing different configurations
 * - Support for custom tab configurations
 * 
 * @example
 * // Basic usage
 * <CharacterTabBar onTabChange={(tabValue) => console.log(`Tab changed to ${tabValue}`)} />
 * 
 * @example
 * // With custom initial tab and notifications
 * <CharacterTabBar 
 *   defaultTab="inventory" 
 *   notifications={{
 *     inventory: 3,
 *     skills: 2
 *   }}
 * />
 * 
 * @example
 * // With custom tab configuration
 * <CharacterTabBar
 *   customTabs={[
 *     { key: "profile", label: "Profile", icon: <PersonIcon /> },
 *     { key: "settings", label: "Settings", icon: <SettingsIcon /> }
 *   ]}
 * />
 * 
 * @param {Object} props - Component props
 * @param {string} [props.defaultTab="stats"] - The initial active tab
 * @param {Function} [props.onTabChange] - Callback function when tab changes
 * @param {Object} [props.notifications={}] - Object with tab keys and notification counts
 * @param {Array<string>} [props.disabledTabs=[]] - Array of tab keys that should be disabled
 * @param {boolean} [props.showLabels=true] - Whether to show text labels on larger screens
 * @param {boolean} [props.showLoadingIndicators=true] - Whether to show loading states when changing tabs
 * @param {boolean} [props.testMode=false] - Enable test mode with sample configurations
 * @param {Array<Object>} [props.customTabs] - Custom tab configuration array
 * @returns {JSX.Element} The character tab bar component
 */
const CharacterTabBar = ({
  defaultTab = "stats",
  onTabChange,
  notifications = {},
  disabledTabs = [],
  showLabels = true,
  showLoadingIndicators = true,
  testMode = false,
  customTabs = null
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [previousTab, setPreviousTab] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tabHistory, setTabHistory] = useState([defaultTab]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Test mode state
  const [testCaseIndex, setTestCaseIndex] = useState(0);
  const [testShowLabels, setTestShowLabels] = useState(true);
  const [testLoadingIndicators, setTestLoadingIndicators] = useState(true);
  const [forceViewport, setForceViewport] = useState(null); // null, 'mobile', 'tablet', 'desktop'

  /**
   * Test case configurations to demonstrate different scenarios
   * @type {Array<{name: string, description: string, defaultTab: string, notifications: Object, disabledTabs: Array<string>}>}
   */
  const testCases = [
    {
      name: "Basic",
      description: "Default configuration with no notifications",
      defaultTab: "stats",
      notifications: {},
      disabledTabs: []
    },
    {
      name: "With Notifications",
      description: "Shows notification badges on multiple tabs",
      defaultTab: "inventory",
      notifications: {
        inventory: 3,
        skills: 2,
        quests: 5
      },
      disabledTabs: []
    },
    {
      name: "Locked Content",
      description: "Some tabs are disabled/locked",
      defaultTab: "stats",
      notifications: {
        skills: 1
      },
      disabledTabs: ["character", "quests"]
    },
    {
      name: "New Player",
      description: "Only basic tabs available for new players",
      defaultTab: "stats",
      notifications: {},
      disabledTabs: ["skills", "equipment", "quests", "character"]
    },
    {
      name: "All Features",
      description: "Combines notifications, disabled tabs, and default selection",
      defaultTab: "skills",
      notifications: {
        inventory: 2,
        quests: 1,
        skills: 3
      },
      disabledTabs: ["character"]
    }
  ];

  // Get current test case configuration
  const currentTestCase = testMode ? testCases[testCaseIndex] : {
    defaultTab,
    notifications,
    disabledTabs
  };

  // Use test case values if in test mode, otherwise use props
  const effectiveNotifications = testMode ? currentTestCase.notifications : notifications;
  const effectiveDisabledTabs = testMode ? currentTestCase.disabledTabs : disabledTabs;
  
  /**
   * Simulated viewport detection for test mode
   * @returns {boolean} Whether the current view is considered mobile
   */
  const effectiveIsMobile = testMode && forceViewport ? 
    forceViewport === 'mobile' : 
    isMobile;
  
  /**
   * Simulated viewport detection for test mode
   * @returns {boolean} Whether the current view is considered tablet
   */
  const effectiveIsTablet = testMode && forceViewport ? 
    forceViewport === 'tablet' || forceViewport === 'mobile' : 
    isTablet;

  // Reset active tab when test case changes
  useEffect(() => {
    if (testMode) {
      setActiveTab(currentTestCase.defaultTab);
      setTabHistory([currentTestCase.defaultTab]);
      setPreviousTab(null);
    }
  }, [testCaseIndex, testMode, currentTestCase.defaultTab]);

  /**
   * Default tabs configuration with icons and labels
   * @type {Array<{key: string, label: string, icon: React.ReactNode, tooltip: string}>}
   */
  const defaultTabs = [
    { 
      key: "stats", 
      label: "Statistics", 
      icon: <PersonIcon />, 
      tooltip: "View and manage character attributes and stats" 
    },
    { 
      key: "inventory", 
      label: "Inventory", 
      icon: <InventoryIcon />, 
      tooltip: "Manage items, resources, and currency" 
    },
    { 
      key: "skills", 
      label: "Skills", 
      icon: <FitnessCenterIcon />, 
      tooltip: "View and upgrade character skills and abilities" 
    },
    { 
      key: "equipment", 
      label: "Equipment", 
      icon: <ShieldIcon />, 
      tooltip: "Manage equipped weapons, armor, and accessories" 
    },
    { 
      key: "quests", 
      label: "Quests", 
      icon: <AssignmentIcon />, 
      tooltip: "Track active and completed quests" 
    },
    { 
      key: "character", 
      label: "Character", 
      icon: <MenuBookIcon />, 
      tooltip: "View character background, reputation, and relationships" 
    },
  ];

  // Use custom tabs if provided, otherwise use defaults
  const tabs = customTabs || defaultTabs;

  /**
   * Simulated tab content for demonstration
   * In a real application, this would likely be separate components
   * @type {Object.<string, React.ReactNode>}
   */
  const tabContent = {
    stats: (
      <>
        <Typography variant="h6" gutterBottom>Character Statistics</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"].map(stat => (
            <Paper key={stat} elevation={1} sx={{ p: 2, width: 150 }}>
              <Typography variant="subtitle2" color="text.secondary">{stat}</Typography>
              <Typography variant="h5">{Math.floor(Math.random() * 10) + 10}</Typography>
            </Paper>
          ))}
        </Box>
      </>
    ),
    inventory: (
      <>
        <Typography variant="h6" gutterBottom>Inventory Items</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
          {["Health Potion", "Mana Potion", "Iron Sword", "Leather Armor", "Gold Coins", "Magic Scroll"].map(item => (
            <Paper key={item} elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 30, height: 30, bgcolor: 'primary.main', borderRadius: '4px' }} />
              <Typography>{item}</Typography>
            </Paper>
          ))}
        </Box>
      </>
    ),
    skills: (
      <>
        <Typography variant="h6" gutterBottom>Character Skills</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {["Swordsmanship", "Archery", "Magic", "Stealth", "Persuasion"].map(skill => (
            <Paper key={skill} elevation={1} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{skill}</Typography>
                <Typography variant="subtitle2">Level {Math.floor(Math.random() * 5) + 1}</Typography>
              </Box>
              <Box sx={{ width: '100%', bgcolor: 'background.paper', height: 8, mt: 1, borderRadius: 1 }}>
                <Box sx={{ width: `${Math.random() * 100}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 1 }} />
              </Box>
            </Paper>
          ))}
        </Box>
      </>
    )
  };

  /**
   * Simulate loading time for tab changes to demonstrate loading state
   * @param {string} newTabKey - The tab being switched to
   * @returns {Promise<void>}
   */
  const simulateTabLoading = async (newTabKey) => {
    // Only show loading state if enabled and not the initial load
    const effectiveShowLoadingIndicators = testMode ? testLoadingIndicators : showLoadingIndicators;
    
    if (effectiveShowLoadingIndicators && previousTab !== null) {
      setIsLoading(true);
      // Random delay between 300-800ms to simulate varying load times
      const delay = Math.random() * 500 + 300;
      await new Promise(resolve => setTimeout(resolve, delay));
      setIsLoading(false);
    }
  };

  /**
   * Handles tab change events with loading simulation and history tracking
   * @param {React.SyntheticEvent} event - The event source of the callback
   * @param {string} newValue - The new selected tab value
   */
  const handleTabChange = async (event, newValue) => {
    // Don't proceed if already loading or trying to go to the same tab
    if (isLoading || newValue === activeTab) return;
    
    // Store previous tab for animation purposes
    setPreviousTab(activeTab);
    
    // Update tab history for potential "back" navigation
    setTabHistory(prev => [...prev, newValue]);
    
    // Simulate a network request or data loading
    await simulateTabLoading(newValue);
    
    // Update the active tab
    setActiveTab(newValue);
    
    // Call the external change handler if provided
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  /**
   * Cycles to the next test case
   */
  const nextTestCase = () => {
    setTestCaseIndex((prevIndex) => 
      prevIndex >= testCases.length - 1 ? 0 : prevIndex + 1
    );
  };

  /**
   * Cycles to the previous test case
   */
  const prevTestCase = () => {
    setTestCaseIndex((prevIndex) => 
      prevIndex <= 0 ? testCases.length - 1 : prevIndex - 1
    );
  };

  /**
   * Changes the simulated viewport for testing responsive behavior
   * @param {string|null} viewport - The viewport to simulate ('mobile', 'tablet', 'desktop', or null for auto)
   */
  const changeViewport = (viewport) => {
    setForceViewport(viewport);
  };

  /**
   * Navigate back to the previous tab in history
   */
  const handleBackNavigation = () => {
    if (tabHistory.length > 1) {
      // Remove current tab and get the previous one
      const newHistory = [...tabHistory];
      newHistory.pop();
      const previousTab = newHistory[newHistory.length - 1];
      
      setTabHistory(newHistory);
      setActiveTab(previousTab);
      
      if (onTabChange) {
        onTabChange(previousTab);
      }
    }
  };

  /**
   * Handle keyboard navigation for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = (event) => {
    // Support left/right arrow keys for tab navigation
    const currentIndex = tabs.findIndex(tab => tab.key === activeTab);
    
    if (event.key === 'ArrowRight') {
      // Find the next non-disabled tab
      for (let i = currentIndex + 1; i < tabs.length; i++) {
        if (!disabledTabs.includes(tabs[i].key)) {
          handleTabChange(event, tabs[i].key);
          break;
        }
      }
    } else if (event.key === 'ArrowLeft') {
      // Find the previous non-disabled tab
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (!disabledTabs.includes(tabs[i].key)) {
          handleTabChange(event, tabs[i].key);
          break;
        }
      }
    } else if (event.key === 'Backspace' && event.altKey) {
      // Alt+Backspace for back navigation
      handleBackNavigation();
    }
  };

  /**
   * Renders the appropriate tab label based on screen size and configuration
   * @param {Object} tab - Tab configuration object
   * @returns {React.ReactNode} - The rendered tab label
   */
  const renderTabLabel = (tab) => {
    // For mobile, only show icons
    if (effectiveIsMobile) {
      return tab.icon;
    }
    
    // For tablets, show icons with notification badges
    const effectiveShowLabels = testMode ? testShowLabels : showLabels;
    if (effectiveIsTablet || !effectiveShowLabels) {
      return tab.icon;
    }
    
    // For larger screens, show both icon and text
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {tab.icon}
        <span>{tab.label}</span>
      </Box>
    );
  };

  /**
   * Wraps tab content with notification badge if needed
   * @param {Object} tab - Tab configuration object
   * @param {React.ReactNode} content - Tab content to wrap
   * @returns {React.ReactNode} - The tab content with or without badge
   */
  const withNotificationBadge = (tab, content) => {
    const notificationCount = effectiveNotifications[tab.key] || 0;
    
    if (notificationCount > 0) {
      return (
        <Badge 
          badgeContent={notificationCount} 
          color="error"
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.675rem',
              height: '18px',
              minWidth: '18px',
            }
          }}
        >
          {content}
        </Badge>
      );
    }
    
    return content;
  };

  return (
    <Box>
      {/* Test Mode Controls */}
      {testMode && (
        <Card sx={{ mb: 2, border: `1px dashed ${theme.palette.warning.main}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                icon={<BugReportIcon />}
                label="Test Mode" 
                color="warning"
                variant="outlined"
                size="small"
                sx={{ mr: 2 }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {currentTestCase.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {currentTestCase.description}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <ButtonGroup size="small">
                <Button onClick={prevTestCase}>Previous</Button>
                <Button variant="outlined" disabled>
                  Case {testCaseIndex + 1} of {testCases.length}
                </Button>
                <Button onClick={nextTestCase}>Next</Button>
              </ButtonGroup>
              
              <ButtonGroup size="small">
                <Button 
                  onClick={() => changeViewport(null)} 
                  variant={forceViewport === null ? 'contained' : 'outlined'}
                >
                  Auto
                </Button>
                <Button 
                  onClick={() => changeViewport('desktop')} 
                  variant={forceViewport === 'desktop' ? 'contained' : 'outlined'}
                >
                  Desktop
                </Button>
                <Button 
                  onClick={() => changeViewport('tablet')} 
                  variant={forceViewport === 'tablet' ? 'contained' : 'outlined'}
                >
                  Tablet
                </Button>
                <Button 
                  onClick={() => changeViewport('mobile')} 
                  variant={forceViewport === 'mobile' ? 'contained' : 'outlined'}
                >
                  Mobile
                </Button>
              </ButtonGroup>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={testShowLabels}
                    onChange={(e) => setTestShowLabels(e.target.checked)}
                    size="small"
                  />
                }
                label="Show Labels"
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={testLoadingIndicators}
                    onChange={(e) => setTestLoadingIndicators(e.target.checked)}
                    size="small"
                  />
                }
                label="Loading Indicators"
              />
            </Box>
            
            <Divider sx={{ mb: 1 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" sx={{ mr: 1 }}>Configuration:</Typography>
              
              {Object.entries(currentTestCase.notifications).length > 0 && (
                <Chip 
                  label={`${Object.values(currentTestCase.notifications).reduce((a, b) => a + b, 0)} Notifications`} 
                  size="small" 
                  color="error" 
                  variant="outlined" 
                />
              )}
              
              {currentTestCase.disabledTabs.length > 0 && (
                <Chip 
                  label={`${currentTestCase.disabledTabs.length} Disabled Tabs`} 
                  size="small" 
                  color="default" 
                  variant="outlined" 
                />
              )}
              
              <Chip 
                label={`Default: ${currentTestCase.defaultTab}`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
              
              <Chip 
                label={forceViewport || 'Auto Viewport'} 
                size="small" 
                color="secondary" 
                variant="outlined" 
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Main Component */}
      <Paper 
        elevation={2} 
        sx={{ 
          mb: 3,
          borderRadius: 1,
          border: testMode ? `1px solid ${theme.palette.warning.light}` : 'none',
        }}
        onKeyDown={handleKeyDown}
        tabIndex="0" // Make the container focusable for keyboard navigation
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={effectiveIsMobile ? "scrollable" : "fullWidth"}
            scrollButtons={effectiveIsMobile ? "auto" : false}
            aria-label="character tabs"
            sx={{
              minHeight: effectiveIsMobile ? 48 : 72,
              '& .MuiTab-root': {
                minHeight: effectiveIsMobile ? 48 : 72,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              },
              '& .Mui-selected': {
                fontWeight: 'bold',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '30%',
                  height: '3px',
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '3px 3px 0 0',
                }
              },
            }}
          >
            {tabs.map((tab) => (
              <Tooltip 
                key={tab.key} 
                title={effectiveDisabledTabs.includes(tab.key) ? "Locked" : tab.tooltip}
                placement="bottom"
                arrow
              >
                <span> {/* Wrapper needed for disabled Tooltips */}
                  <Tab
                    value={tab.key}
                    disabled={effectiveDisabledTabs.includes(tab.key) || isLoading}
                    icon={withNotificationBadge(
                      tab,
                      renderTabLabel(tab)
                    )}
                    label={!effectiveIsMobile && !effectiveIsTablet && (testMode ? testShowLabels : showLabels) ? tab.label : undefined}
                    id={`character-tab-${tab.key}`}
                    aria-controls={`character-tabpanel-${tab.key}`}
                    sx={{
                      opacity: effectiveDisabledTabs.includes(tab.key) ? 0.5 : 1,
                    }}
                  />
                </span>
              </Tooltip>
            ))}
          </Tabs>
        </Box>
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2">
            {tabs.find(tab => tab.key === activeTab)?.label || ''}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isLoading && (
              <CircularProgress size={16} thickness={5} />
            )}
            
            {activeTab === "stats" && (
              <Chip 
                icon={<StarIcon fontSize="small" />}
                label="Level 5" 
                color="primary"
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        
        <Divider />
        
        {/* Tab content container with transition effects */}
        <Box 
          sx={{ 
            position: 'relative',
            minHeight: 200, // Prevent layout shift during tab changes
          }}
        >
          {/* Render each tab panel - they handle their own visibility */}
          {tabs.map(tab => (
            <TabPanel key={tab.key} value={activeTab} tabKey={tab.key}>
              {/* Display tab content if available, otherwise show placeholder */}
              {tabContent[tab.key] || (
                <Box 
                  sx={{ 
                    height: 200, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px dashed', 
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography>
                    {tab.label} Content
                  </Typography>
                </Box>
              )}
            </TabPanel>
          ))}
        </Box>
      </Paper>
      
      {/* Test Mode Documentation */}
      {testMode && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>CharacterTabBar Test Documentation</Typography>
          <Typography variant="body2" paragraph>
            This component is currently in test mode, showcasing various tab configurations without requiring
            actual implementation. Use the controls above to switch between different test cases and viewport sizes.
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>Available Test Cases:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {testCases.map((testCase, index) => (
              <Box component="li" key={index} sx={{ mb: 0.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: index === testCaseIndex ? 'bold' : 'normal',
                    color: index === testCaseIndex ? 'primary.main' : 'text.primary'
                  }}
                >
                  <strong>{testCase.name}</strong>: {testCase.description}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>Usage in Code:</Typography>
          <Box 
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              p: 1.5,
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              overflowX: 'auto'
            }}
          >
            <pre style={{ margin: 0 }}>
              {'// Enable test mode\n<CharacterTabBar testMode={true} />\n\n// Normal usage with notifications\n<CharacterTabBar\n  defaultTab="inventory"\n  notifications={{\n    inventory: 3,\n    skills: 2\n  }}\n  disabledTabs={["character"]}\n/>'}
            </pre>
          </Box>
          
          <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>Keyboard Navigation:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Chip label="← → Arrow Keys" size="small" variant="outlined" />
            <Chip label="Alt+Backspace (Go Back)" size="small" variant="outlined" />
            <Chip label="Tab (Focus Next Element)" size="small" variant="outlined" />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CharacterTabBar;