import React, { useState } from 'react';
import { Breadcrumbs, Link, Typography, Box, useTheme, useMediaQuery, Chip, Button, SxProps, Theme } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// Import icons correctly from @mui/icons-material
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PersonIcon from '@mui/icons-material/Person';
import BugReportIcon from '@mui/icons-material/BugReport';

/**
 * Interface for a town data object
 */
interface Town {
  id: string;
  name: string;
}

/**
 * Interface for a sample path with description
 */
interface SamplePath {
  path: string;
  description: string;
}

/**
 * Interface for breadcrumb name mapping
 */
interface BreadcrumbNameMap {
  [key: string]: {
    name: string;
    icon: React.ReactNode;
  };
}

/**
 * Props interface for BreadcrumbNav
 */
interface BreadcrumbNavProps {
  testMode?: boolean;
}

// Sample town data since the modules/data import doesn't exist
const towns: Town[] = [
  { id: 'windhelm', name: 'Windhelm' },
  { id: 'riverwood', name: 'Riverwood' },
  { id: 'whiterun', name: 'Whiterun' },
  { id: 'solitude', name: 'Solitude' }
];

/**
 * @component BreadcrumbNav
 * @description An enhanced navigation breadcrumb component that shows the current location path
 * in the application as a series of clickable links with custom styling and icons.
 * 
 * Features:
 * - Hierarchical navigation with clickable links
 * - Custom icons for different route types
 * - Responsive design for different screen sizes
 * - Visual indicators for current location
 * - Hover effects for interactive elements
 * - Test mode for previewing different breadcrumb paths
 *
 * @example
 * // Basic usage in a parent component:
 * <BreadcrumbNav />
 * 
 * @example
 * // With test mode enabled:
 * <BreadcrumbNav testMode={true} />
 *
 * @param {BreadcrumbNavProps} props - Component props
 * @returns {JSX.Element} The styled breadcrumb navigation component
 */
const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ testMode = false }): JSX.Element => {
  // Always call hooks at the top level of your component
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [testPathIndex, setTestPathIndex] = useState<number>(0);
  
  /**
   * Sample test paths to demonstrate different breadcrumb configurations
   * @type {Array<SamplePath>}
   */
  const samplePaths: SamplePath[] = [
    { path: '/game', description: 'Simple single level' },
    { path: '/game/town/windhelm', description: 'Town example with dynamic name' },
    { path: '/game/npc/merchant', description: 'NPC example' },
    { path: '/settings/audio', description: 'Settings submenu' },
    { path: '/game/town/windhelm/npc/blacksmith/quest/fetch', description: 'Deep nested path' },
  ];

  /**
   * Split the current path into segments, removing empty strings
   * @type {string[]}
   */
  const pathnames: string[] = testMode 
    ? samplePaths[testPathIndex].path.split('/').filter(x => x) 
    : location.pathname.split('/').filter((x) => x);

  /**
   * Maps route paths to user-friendly display names
   * @type {BreadcrumbNameMap}
   */
  const breadcrumbNameMap: BreadcrumbNameMap = {
    'game': { name: 'Game World', icon: <HomeIcon fontSize="small" /> },
    'settings': { name: 'Settings', icon: <SettingsIcon fontSize="small" /> },
    'town': { name: 'Town', icon: <LocationCityIcon fontSize="small" /> },
    'npc': { name: 'NPC', icon: <PersonIcon fontSize="small" /> },
    'audio': { name: 'Audio Settings', icon: null },
    'quest': { name: 'Quest', icon: null },
    'fetch': { name: 'Fetch Quest', icon: null },
    'merchant': { name: 'Merchant', icon: <PersonIcon fontSize="small" /> },
    'blacksmith': { name: 'Blacksmith', icon: <PersonIcon fontSize="small" /> },
  };

  /**
   * Handler for hover animation state
   * @param {string} id - The breadcrumb item id
   * @returns {SxProps<Theme>} - Style object with hover settings
   */
  const getBreadcrumbItemStyle = (id: string): SxProps<Theme> => ({
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      textDecoration: 'none',
    },
    backgroundColor: id === pathnames[pathnames.length - 1] ? 
      'rgba(255, 255, 255, 0.1)' : 'transparent',
    padding: '4px 8px',
    borderRadius: '4px',
  });

  /**
   * Gets the appropriate icon for a route segment
   * @param {string} value - The route segment
   * @returns {React.ReactNode|null} - The icon component or null
   */
  const getRouteIcon = (value: string): React.ReactNode | null => {
    const mapEntry = breadcrumbNameMap[value];
    return mapEntry?.icon || null;
  };

  /**
   * Determines if breadcrumb should be shown based on screen size
   * @param {number} index - Index of the breadcrumb item
   * @returns {boolean} - Whether to display the breadcrumb
   */
  const shouldShowBreadcrumb = (index: number): boolean => {
    // On mobile, only show the first and last two breadcrumbs if there are more than 3
    if (isMobile && pathnames.length > 3) {
      return index === 0 || index >= pathnames.length - 2;
    }
    return true;
  };

  /**
   * Cycles to the next test path in the sample paths array
   */
  const cycleTestPath = (): void => {
    setTestPathIndex((prevIndex) => 
      prevIndex >= samplePaths.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box>
      {testMode && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1,
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Chip 
            icon={<BugReportIcon />}
            label="Test Mode" 
            color="warning"
            variant="outlined"
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            Showing test path: {samplePaths[testPathIndex].description}
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={cycleTestPath}
            sx={{ ml: 'auto' }}
          >
            Next Test Path
          </Button>
        </Box>
      )}
      
      <Box 
        sx={{
          p: 1.5, 
          backgroundColor: testMode ? 'rgba(255, 244, 229, 0.2)' : 'rgba(0, 0, 0, 0.05)', 
          borderRadius: 1,
          boxShadow: 1,
          mb: 3,
          border: testMode ? `1px dashed ${theme.palette.warning.main}` : 'none',
        }}
      >
        <Breadcrumbs 
          aria-label="game navigation breadcrumb" 
          separator="›"
          sx={{ 
            '& .MuiBreadcrumbs-separator': { 
              mx: 0.5, 
              color: theme.palette.primary.main,
              fontWeight: 'bold'
            }
          }}
        >
          <Link 
            component={testMode ? 'span' : RouterLink}
            to={testMode ? undefined : "/"} 
            color="inherit"
            sx={getBreadcrumbItemStyle('home')}
            onClick={testMode ? undefined : undefined}
          >
            <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
            {!isMobile && <Typography variant="body2">Main Menu</Typography>}
          </Link>
          
          {pathnames.map((value, index) => {
            if (!shouldShowBreadcrumb(index)) {
              return index === 1 && <Typography key="ellipsis" color="textSecondary">...</Typography>;
            }

            /**
             * Determines if this segment is the last item in the breadcrumb path
             * @type {boolean}
             */
            const last = index === pathnames.length - 1;

            /**
             * Constructs the navigation path for this breadcrumb item
             * @type {string}
             */
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            /**
             * Determine the display name for this path segment
             * First check if it's in our mapping, otherwise use the raw segment
             */
            let displayName = breadcrumbNameMap[value]?.name || value;
            const icon = getRouteIcon(value);
            
            /**
             * Special case for town IDs - look up the town name from data
             */
            const town = towns.find(t => t.id === value);
            if (town) {
              displayName = town.name;
            }

            return last ? (
              <Box 
                key={to} 
                sx={{
                  ...getBreadcrumbItemStyle(value),
                  fontWeight: 'bold',
                }}
              >
                {icon && <Box sx={{ mr: 0.5 }}>{icon}</Box>}
                <Typography 
                  color="text.primary" 
                  variant="body2"
                  sx={{ fontWeight: 'bold' }}
                >
                  {displayName}
                </Typography>
              </Box>
            ) : (
              <Link
                component={testMode ? 'span' : RouterLink}
                to={testMode ? undefined : to}
                key={to}
                color="inherit"
                sx={getBreadcrumbItemStyle(value)}
                underline="none"
              >
                {icon && <Box sx={{ mr: 0.5 }}>{icon}</Box>}
                <Typography variant="body2">
                  {displayName}
                </Typography>
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>
      
      {testMode && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Breadcrumb Test Documentation</Typography>
          <Typography variant="body2" paragraph>
            This component is currently in test mode, displaying sample breadcrumb paths to demonstrate
            various configurations without requiring actual navigation.
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>Available Test Paths:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {samplePaths.map((path, index) => (
              <Box component="li" key={index} sx={{ mb: 0.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: index === testPathIndex ? 'bold' : 'normal',
                    color: index === testPathIndex ? 'primary.main' : 'text.primary'
                  }}
                >
                  {path.path} - {path.description}
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
              {'// Enable test mode\n<BreadcrumbNav testMode={true} />\n\n// Normal usage\n<BreadcrumbNav />'}
            </pre>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BreadcrumbNav;
