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
import TraitsPage from '../../pages/TraitsPage';
import DebugPage from '../../pages/DebugPage'; // Import the new DebugPage

// Shared components
import { PlaceholderPage } from '../../shared/components/PlaceholderPage';

// Types
import type { TabId } from '../types/NavigationTypes';

export interface MainContentAreaProps {
  activeTabId?: TabId;
  changeTab?: (tabId: TabId) => void;
  className?: string;
  enableTransitions?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  debugMode?: boolean;
  LoadingComponent?: React.ComponentType<{ text?: string }>;
}

interface ContentConfig {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  showContainer?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  loadingText?: string;
  enableSuspense?: boolean;
  preloadable?: boolean;
}

const ContentLoadingFallback: React.FC<{ text?: string }> = React.memo(({ text = 'Loading content...' }) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="200px" gap={2}>
    <CircularProgress size={40} />
    <Typography variant="body2" color="text.secondary">{text}</Typography>
  </Box>
));
ContentLoadingFallback.displayName = 'ContentLoadingFallback';


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

  useEffect(() => {
    if (debugMode) {
      console.log(`[MainContentArea] Active tab changed to: ${activeTabId}`);
    }
  }, [activeTabId, debugMode]);

  const contentConfig = useMemo((): Record<TabId, ContentConfig> => ({
    dashboard: { component: DashboardPage, showContainer: true, maxWidth: 'xl', loadingText: 'Loading dashboard...', enableSuspense: true, preloadable: true },
    character: { component: CharacterPage, showContainer: true, maxWidth: 'lg', loadingText: 'Loading character data...', enableSuspense: true, preloadable: true },
    traits: { component: TraitsPage, showContainer: true, maxWidth: 'lg', loadingText: 'Loading traits system...', enableSuspense: true, preloadable: true },
    skills: { component: PlaceholderPage, props: { title: 'Skills System', message: 'Character skill trees and progression system', status: 'planned', timeline: 'Phase 3 Development', features: ['Skill tree visualization', 'Skill point allocation', 'Mastery progression', 'Synergy system'] }, showContainer: true, loadingText: 'Loading skills interface...', enableSuspense: false },
    npcs: { component: NPCsPage, showContainer: true, maxWidth: 'lg', loadingText: 'Loading NPC data...', enableSuspense: true, preloadable: true },
    quests: { component: PlaceholderPage, props: { title: 'Quest System', message: 'Quest management and tracking interface', status: 'in-development', timeline: 'Phase 2 Development', features: ['Quest log management', 'Objective tracking', 'Reward system', 'NPC quest integration'] }, showContainer: true, loadingText: 'Loading quest system...', enableSuspense: false },
    copies: { component: PlaceholderPage, props: { title: 'Copy Management', message: 'Create and manage character copies', status: 'planned', timeline: 'Phase 3 Development', features: ['Copy creation system', 'Growth management', 'Task assignment', 'Loyalty tracking'] }, showContainer: true, loadingText: 'Loading copy management...', enableSuspense: false },
    essence: { component: EssencePage, showContainer: true, maxWidth: 'md', loadingText: 'Loading essence data...', enableSuspense: true, preloadable: true },
    inventory: { component: PlaceholderPage, props: { title: 'Inventory System', message: 'Item management and storage interface', status: 'planned', timeline: 'Phase 2 Development', features: ['Item organization', 'Equipment management', 'Storage expansion', 'Item crafting'] }, showContainer: true, loadingText: 'Loading inventory...', enableSuspense: false },
    crafting: { component: PlaceholderPage, props: { title: 'Crafting System', message: 'Item creation and enhancement interface', status: 'planned', timeline: 'Phase 3 Development', features: ['Recipe management', 'Material collection', 'Quality enhancement', 'Advanced crafting'] }, showContainer: true, loadingText: 'Loading crafting system...', enableSuspense: false },
    settings: { component: SettingsPage, showContainer: true, maxWidth: 'md', loadingText: 'Loading settings...', enableSuspense: true, preloadable: false },
    saves: { component: PlaceholderPage, props: { title: 'Save Management', message: 'Game save and load management interface', status: 'in-development', timeline: 'Current Development', features: ['Save slot management', 'Import/Export functionality', 'Backup system', 'Cloud sync (future)'] }, showContainer: true, loadingText: 'Loading save management...', enableSuspense: false },
    'save-load': { component: PlaceholderPage, props: { title: 'Save/Load System', message: 'Advanced save and load management', status: 'in-development', timeline: 'Current Development', features: ['Multiple save slots', 'Quick save/load', 'Export/Import saves', 'Version compatibility'] }, showContainer: true, loadingText: 'Loading save/load system...', enableSuspense: false },
    debug: { component: DebugPage, showContainer: true, maxWidth: 'lg', loadingText: 'Loading debug tools...', enableSuspense: false, preloadable: false },
  }), []);

  const currentConfig = useMemo(() => {
    const isValidTabId = (tabId: string): tabId is TabId => tabId in contentConfig;
    if (isValidTabId(activeTabId)) return contentConfig[activeTabId];
    if (debugMode) console.warn(`[MainContentArea] No config for tab: ${activeTabId}, falling back to dashboard`);
    return contentConfig.dashboard;
  }, [activeTabId, contentConfig, debugMode]);

  const handleTabChange = useCallback((tabId: TabId) => {
    if (!changeTab) {
      if (debugMode) console.warn('[MainContentArea] changeTab callback not provided');
      return;
    }
    if (!(tabId in contentConfig)) {
      if (debugMode) console.error(`[MainContentArea] Invalid tab ID: ${tabId}`);
      return;
    }
    if (debugMode) console.log(`[MainContentArea] Changing tab from ${activeTabId} to ${tabId}`);
    changeTab(tabId);
  }, [changeTab, activeTabId, contentConfig, debugMode]);

  const renderContent = useCallback(() => {
    const { component: Component, props: componentProps = {}, enableSuspense } = currentConfig;
    const enhancedProps = { ...componentProps, onTabChange: handleTabChange, activeTab: activeTabId, debugMode };
    const content = <Component {...enhancedProps} />;
    if (enableSuspense) {
      return <Suspense fallback={<LoadingComponent text={currentConfig.loadingText} />}>{content}</Suspense>;
    }
    return content;
  }, [currentConfig, handleTabChange, activeTabId, debugMode, LoadingComponent]);

  const content = useMemo(() => {
    const renderedContent = renderContent();
    if (currentConfig.showContainer) {
      return (
        <Container maxWidth={currentConfig.maxWidth || maxWidth} sx={{ py: 3, px: { xs: 2, sm: 3 }, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {renderedContent}
        </Container>
      );
    }
    return renderedContent;
  }, [renderContent, currentConfig, maxWidth]);

  const mainContainer = useMemo(() => (
    <Box className={className} component="main" role="main" aria-label={`${activeTabId} content area`} aria-busy={false} tabIndex={-1} sx={{ flexGrow: 1, overflow: 'auto', backgroundColor: theme.palette.background.default, position: 'relative', '&:focus': { outline: 'none' } }}>
      {content}
    </Box>
  ), [className, activeTabId, theme.palette.background.default, content]);

  if (enableTransitions) {
    return <Fade in timeout={theme.transitions.duration.enteringScreen} style={{ transformOrigin: '0 0 0' }}>{mainContainer}</Fade>;
  }
  return mainContainer;
});

MainContentArea.displayName = 'MainContentArea';
export default MainContentArea;