import React from 'react';
import { Box, Paper } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { NavigationTabs } from './NavigationTabs';
import { FeatureTabs } from './FeatureTabs';
import { TabPanel } from './TabPanel';
import { TabConfig } from './StandardTabs';

interface CompleteTabLayoutProps {
  // Primary navigation (sidebar)
  primaryTabs: TabConfig[];
  activePrimaryTab: string;
  onPrimaryTabChange: (tabId: string) => void;
  
  // Secondary navigation (content area tabs)
  secondaryTabsMap: Record<string, TabConfig[]>;
  activeSecondaryTabs: Record<string, string>;
  onSecondaryTabChange: (primaryTabId: string, secondaryTabId: string) => void;
  
  // Content rendering
  children: React.ReactNode;
  
  // Layout customization
  sidebarWidth?: number;
  showSecondaryTabs?: boolean;
  sx?: SxProps<Theme>;
  sidebarSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  secondaryTabsSx?: SxProps<Theme>;
  
  // Accessibility
  'aria-label'?: string;
  'secondary-aria-label'?: string;
}

/**
 * Complete tab layout combining primary navigation and secondary feature tabs
 * Provides the full application tab experience with sidebar navigation and content area tabs
 */
export const CompleteTabLayout: React.FC<CompleteTabLayoutProps> = ({
  primaryTabs,
  activePrimaryTab,
  onPrimaryTabChange,
  secondaryTabsMap,
  activeSecondaryTabs,
  onSecondaryTabChange,
  children,
  sidebarWidth = 280,
  showSecondaryTabs = true,
  sx,
  sidebarSx,
  contentSx,
  secondaryTabsSx,
  'aria-label': ariaLabel,
  'secondary-aria-label': secondaryAriaLabel,
}) => {
  const currentSecondaryTabs = secondaryTabsMap[activePrimaryTab] || [];
  const currentSecondaryTab = activeSecondaryTabs[activePrimaryTab] || '';
  
  const handleSecondaryTabChange = (tabId: string) => {
    onSecondaryTabChange(activePrimaryTab, tabId);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Primary Navigation Sidebar */}
      <Paper
        elevation={2}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          zIndex: 1,
          ...sidebarSx,
        }}
      >
        <NavigationTabs
          tabs={primaryTabs}
          activeTab={activePrimaryTab}
          onTabChange={onPrimaryTabChange}
          aria-label={ariaLabel || 'Primary navigation'}
        />
      </Paper>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'background.default',
          ...contentSx,
        }}
      >
        {/* Secondary Navigation Tabs */}
        {showSecondaryTabs && currentSecondaryTabs.length > 0 && (
          <FeatureTabs
            tabs={currentSecondaryTabs}
            activeTab={currentSecondaryTab}
            onTabChange={handleSecondaryTabChange}
            aria-label={secondaryAriaLabel || `${activePrimaryTab} feature navigation`}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              ...secondaryTabsSx,
            }}
          >
            {/* Content will be rendered below */}
            <Box sx={{ display: 'none' }} />
          </FeatureTabs>
        )}

        {/* Content Panel Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'background.paper',
          }}
        >
          {currentSecondaryTabs.length > 0 ? (
            // Render content with secondary tab panels
            currentSecondaryTabs.map((tab) => (
              <TabPanel
                key={tab.id}
                tabId={tab.id}
                activeTab={currentSecondaryTab}
                sx={{
                  height: '100%',
                  p: 2,
                }}
              >
                {children}
              </TabPanel>
            ))
          ) : (
            // Render content directly if no secondary tabs
            <Box sx={{ height: '100%', p: 2 }}>
              {children}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
