import React, { useMemo, useCallback, Suspense, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Fade, 
  CircularProgress,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Page imports
import CharacterPage from '../../pages/CharacterPage';
import NPCsPage from '../../pages/NPCsPage';
import EssencePage from '../../pages/EssencePage';
import SettingsPage from '../../pages/SettingsPage';
import { DashboardPage } from '../../pages/DashboardPage';

// Shared components
import { PlaceholderPage } from '../../shared/components/PlaceholderPage';

// Types
import type { TabId } from '../types/NavigationTypes';

/**
 * Props for the MainContentArea component
 */
export interface MainContentAreaProps {
  /** Currently active tab identifier */
  activeTabId?: TabId;
  /** Callback when tab should change */
  changeTab?: (tabId: TabId) => void;
  /** Additional styling */
  className?: string;
  /** Whether to use fade transitions */
  enableTransitions?: boolean;
  /** Custom container maxWidth */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  /** Enable debug mode for development */
  debugMode?: boolean;
  /** Custom loading component */
  LoadingComponent?: React.ComponentType<{ text?: string }>;

}

/**
 * Enhanced content configuration for different tabs
 */
interface ContentConfig {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  requiresAuth?: boolean;
  showContainer?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  loadingText?: string;
  enableSuspense?: boolean;
  preloadable?: boolean;
}

/**
 * Loading component for content transitions
 */
const ContentLoadingFallback: React.FC<{ text?: string }> = React.memo(({ text = 'Loading content...' }) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    minHeight="200px"
    gap={2}
  >
    <CircularProgress size={40} />
    <Typography variant="body2" color="text.secondary">
      {text}
    </Typography>
  </Box>
));

ContentLoadingFallback.displayName = 'ContentLoadingFallback';

/**
 * MainContentArea component that handles dynamic content rendering based on active tab
 * 
 * Features:
 * - Dynamic content switching based on activeTabId
 * - Integration with all major game pages and systems
 * - Comprehensive placeholder support for unimplemented features
 * - Performance optimized with advanced memoization
 * - Accessibility compliant with enhanced ARIA attributes
 * - Smooth transitions with loading states
 * - Responsive container management with breakpoint support
 * - Development debugging capabilities
 * - Preloading support for better performance
 */
export const MainContentArea: React.FC<MainContentAreaProps> = React.memo(({
  activeTabId = 'dashboard',
  changeTab,
  className,
  enableTransitions = true,
  maxWidth = 'lg',
  debugMode = process.env.NODE_ENV === 'development',
  LoadingComponent = ContentLoadingFallback
}) => {
  const theme = useTheme();

  // Debug logging for development
  useEffect(() => {
    if (debugMode) {
      console.log(`[MainContentArea] Active tab changed to: ${activeTabId}`);
    }
  }, [activeTabId, debugMode]);

  // Enhanced content configuration mapping
  const contentConfig = useMemo((): Record<TabId, ContentConfig> => ({
    // Dashboard - Main overview page
    dashboard: {
      component: DashboardPage,
      showContainer: true,
      maxWidth: 'xl',
      loadingText: 'Loading dashboard...',
      enableSuspense: true,
      preloadable: true
    },

    // Character Management Section
    character: {
      component: CharacterPage,
      showContainer: true,
      maxWidth: 'lg',
      loadingText: 'Loading character data...',
      enableSuspense: true,
      preloadable: true
    },
    skills: {
      component: PlaceholderPage,
      props: {
        title: 'Skills System',
        message: 'Character skill trees and progression system',
        status: 'planned' as const,
        timeline: 'Phase 3 Development',
        features: [
          'Skill tree visualization',
          'Skill point allocation',
          'Mastery progression',
          'Synergy system'
        ]
      },
      showContainer: true,
      loadingText: 'Loading skills interface...',
      enableSuspense: false
    },

    // World Interaction Section
    npcs: {
      component: NPCsPage,
      showContainer: true,
      maxWidth: 'lg',
      loadingText: 'Loading NPC data...',
      enableSuspense: true,
      preloadable: true
    },
    quests: {
      component: PlaceholderPage,
      props: {
        title: 'Quest System',
        message: 'Quest management and tracking interface',
        status: 'in-development' as const,
        timeline: 'Phase 2 Development',
        features: [
          'Quest log management',
          'Objective tracking',
          'Reward system',
          'NPC quest integration'
        ]
      },
      showContainer: true,
      loadingText: 'Loading quest system...',
      enableSuspense: false
    },
    copies: {
      component: PlaceholderPage,
      props: {
        title: 'Copy Management',
        message: 'Create and manage character copies',
        status: 'planned' as const,
        timeline: 'Phase 3 Development',
        features: [
          'Copy creation system',
          'Growth management',
          'Task assignment',
          'Loyalty tracking'
        ]
      },
      showContainer: true,
      loadingText: 'Loading copy management...',
      enableSuspense: false
    },

    // Resources Section
    essence: {
      component: EssencePage,
      showContainer: true,
      maxWidth: 'md',
      loadingText: 'Loading essence data...',
      enableSuspense: true,
      preloadable: true
    },
    inventory: {
      component: PlaceholderPage,
      props: {
        title: 'Inventory System',
        message: 'Item management and storage interface',
        status: 'planned' as const,
        timeline: 'Phase 2 Development',
        features: [
          'Item organization',
          'Equipment management',
          'Storage expansion',
          'Item crafting'
        ]
      },
      showContainer: true,
      loadingText: 'Loading inventory...',
      enableSuspense: false
    },
    crafting: {
      component: PlaceholderPage,
      props: {
        title: 'Crafting System',
        message: 'Item creation and enhancement interface',
        status: 'planned' as const,
        timeline: 'Phase 3 Development',
        features: [
          'Recipe management',
          'Material collection',
          'Quality enhancement',
          'Advanced crafting'
        ]
      },
      showContainer: true,
      loadingText: 'Loading crafting system...',
      enableSuspense: false
    },

    // System Section
    settings: {
      component: SettingsPage,
      showContainer: true,
      maxWidth: 'md',
      loadingText: 'Loading settings...',
      enableSuspense: true,
      preloadable: false
    },
    saves: {
      component: PlaceholderPage,
      props: {
        title: 'Save Management',
        message: 'Game save and load management interface',
        status: 'in-development' as const,
        timeline: 'Current Development',
        features: [
          'Save slot management',
          'Import/Export functionality',
          'Backup system',
          'Cloud sync (future)'
        ]
      },
      showContainer: true,
      loadingText: 'Loading save management...',
      enableSuspense: false
    },
    'save-load': {
      component: PlaceholderPage,
      props: {
        title: 'Save/Load System',
        message: 'Advanced save and load management',
        status: 'in-development' as const,
        timeline: 'Current Development',
        features: [
          'Multiple save slots',
          'Quick save/load',
          'Export/Import saves',
          'Version compatibility'
        ]
      },
      showContainer: true,
      loadingText: 'Loading save/load system...',
      enableSuspense: false
    }
  }), []);

  // Get configuration for current tab with fallback
  const currentConfig = useMemo(() => {
    // Type guard to ensure activeTabId is a valid TabId
    const isValidTabId = (tabId: string): tabId is TabId => {
      return tabId in contentConfig;
    };

    if (isValidTabId(activeTabId)) {
      return contentConfig[activeTabId];
    }

    if (debugMode) {
      console.warn(`[MainContentArea] No configuration found for tab: ${activeTabId}, falling back to dashboard`);
    }
    return contentConfig.dashboard;
  }, [activeTabId, contentConfig, debugMode]);

  // Enhanced tab change handler with validation
  const handleTabChange = useCallback((tabId: TabId) => {
    if (!changeTab) {
      if (debugMode) {
        console.warn('[MainContentArea] changeTab callback not provided');
      }
      return;
    }

    // This check is now redundant since tabId is already typed as TabId
    // but keeping for additional runtime safety
    if (!(tabId in contentConfig)) {
      if (debugMode) {
        console.error(`[MainContentArea] Invalid tab ID: ${tabId}`);
      }
      return;
    }

    if (debugMode) {
      console.log(`[MainContentArea] Changing tab from ${activeTabId} to ${tabId}`);
    }

    changeTab(tabId);
  }, [changeTab, activeTabId, contentConfig, debugMode]);

  // Content renderer
  const renderContent = useCallback(() => {
    const { component: Component, props: componentProps = {}, enableSuspense } = currentConfig;

    // Add common props to all components
    const enhancedProps = {
      ...componentProps,
      onTabChange: handleTabChange,
      activeTab: activeTabId,
      debugMode
    };

    const content = <Component {...enhancedProps} />;

    // Wrap with Suspense if enabled
    if (enableSuspense) {
      return (
        <Suspense fallback={<LoadingComponent text={currentConfig.loadingText} />}>
          {content}
        </Suspense>
      );
    }

    return content;
  }, [currentConfig, handleTabChange, activeTabId, debugMode, LoadingComponent]);

  // Content wrapper with container logic
  const content = useMemo(() => {
    const renderedContent = renderContent();

    if (currentConfig.showContainer) {
      return (
        <Container 
          maxWidth={currentConfig.maxWidth || maxWidth}
          sx={{ 
            py: 3,
            px: { xs: 2, sm: 3 },
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {renderedContent}
        </Container>
      );
    }

    return renderedContent;
  }, [renderContent, currentConfig, maxWidth]);

  // Main container with improved accessibility
  const mainContainer = useMemo(() => (
    <Box 
      className={className}
      component="main"
      role="main"
      aria-label={`${activeTabId} content area`}
      aria-busy={false}
      tabIndex={-1}
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        // Improve focus management
        '&:focus': {
          outline: 'none'
        }
      }}
    >
      {content}
    </Box>
  ), [className, activeTabId, theme.palette.background.default, content]);

  // Apply transitions
  if (enableTransitions) {
    return (
      <Fade 
        in 
        timeout={theme.transitions.duration.enteringScreen}
        style={{ transformOrigin: '0 0 0' }}
      >
        {mainContainer}
      </Fade>
    );
  }

  return mainContainer;
});

MainContentArea.displayName = 'MainContentArea';

export default MainContentArea;
