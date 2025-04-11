/**
 * @file MainContent.tsx
 * @description Flexible main content container component for the RPG game interface.
 *
 * This component provides a standardized container for the main content sections
 * of the application. It handles proper spacing, scrolling behavior, and consistent
 * styling across different content types.
 * 
 * Features:
 * - Configurable padding and margin
 * - Optional paper/card background with elevation
 * - Header/title with optional actions
 * - Managed scrolling behavior
 * - Responsive sizing
 * 
 * @example
 * // Basic usage
 * <MainContent>
 *   <Typography>Content goes here</Typography>
 * </MainContent>
 * 
 * @example
 * // With title and background styling
 * <MainContent 
 *   title="Quest Information" 
 *   elevation={2}
 *   actions={<Button>Accept Quest</Button>}
 * >
 *   <QuestDetails quest={activeQuest} />
 * </MainContent>
 */
import React, { ReactNode } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  SxProps, 
  Theme,
  useTheme
} from '@mui/material';

interface MainContentProps {
  /** Main content to display */
  children: ReactNode;
  /** Optional title to display at the top */
  title?: string | ReactNode;
  /** Action component(s) to display in the header next to the title */
  actions?: ReactNode;
  /** Whether to wrap the content in a Paper component with elevation */
  elevation?: number;
  /** Custom styles to apply to the root element */
  sx?: SxProps<Theme>;
  /** Custom styles for the content area */
  contentSx?: SxProps<Theme>;
  /** Whether to show a divider below the header */
  divider?: boolean;
  /** Whether to apply padding to the container */
  padding?: boolean | number | string;
  /** Whether the content should fill the available height */
  fullHeight?: boolean;
}

/**
 * MainContent component - Container for main content sections with consistent styling
 */
const MainContent: React.FC<MainContentProps> = ({
  children,
  title,
  actions,
  elevation = 0,
  sx = {},
  contentSx = {},
  divider = true,
  padding = true,
  fullHeight = false
}) => {
  const theme = useTheme();
  
  // Convert boolean/number padding to appropriate spacing value
  const paddingValue = (() => {
    if (padding === false) return 0;
    if (padding === true) return 3;
    return padding;
  })();
  
  // Content to render
  const content = (
    <>
      {/* Title area if provided */}
      {(title || actions) && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: divider ? 1 : 2,
          px: paddingValue,
          pt: paddingValue,
          pb: divider ? 1 : undefined
        }}>
          {typeof title === 'string' ? (
            <Typography variant="h5" component="h2">{title}</Typography>
          ) : (
            title
          )}
          
          {actions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
      
      {/* Divider between title and content if needed */}
      {divider && (title || actions) && (
        <Divider sx={{ mb: 2 }} />
      )}
      
      {/* Main content area */}
      <Box 
        sx={{ 
          px: paddingValue, 
          pb: paddingValue,
          pt: (title || actions) ? (divider ? 0 : 1) : paddingValue,
          overflow: 'auto',
          ...contentSx
        }}
      >
        {children}
      </Box>
    </>
  );
  
  // Decide whether to wrap in Paper or not
  if (elevation > 0) {
    return (
      <Paper
        elevation={elevation}
        sx={{
          height: fullHeight ? '100%' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ...sx
        }}
      >
        {content}
      </Paper>
    );
  }
  
  // No paper wrapper
  return (
    <Box 
      sx={{
        height: fullHeight ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...sx
      }}
    >
      {content}
    </Box>
  );
};

export default MainContent;
