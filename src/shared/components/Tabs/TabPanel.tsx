import React from 'react';
import { Box, Fade } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface TabPanelProps {
  children: React.ReactNode;
  tabId: string;
  activeTab: string;
  sx?: SxProps<Theme>;
  fadeTransition?: boolean;
  keepMounted?: boolean;
}

/**
 * Tab panel component that works with StandardTabs
 * Provides proper accessibility attributes and optional fade transitions
 */
export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  tabId,
  activeTab,
  sx,
  fadeTransition = true,
  keepMounted = false,
}) => {
  const isActive = activeTab === tabId;
  const shouldRender = isActive || keepMounted;

  if (!shouldRender) {
    return null;
  }

  const content = (
    <Box
      role="tabpanel"
      hidden={!isActive}
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      sx={{
        width: '100%',
        height: '100%',
        ...sx,
      }}
    >
      {children}
    </Box>
  );

  if (fadeTransition && isActive) {
    return (
      <Fade in={isActive} timeout={200}>
        {content}
      </Fade>
    );
  }

  return content;
};
