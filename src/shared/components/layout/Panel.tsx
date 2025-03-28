import React, { ReactNode, useState } from 'react';
import { Box, Paper, Typography, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

/**
 * Props for Panel component
 */
interface PanelProps {
  /** Panel title */
  title?: string;
  /** Panel content */
  children: ReactNode;
  /** Whether the panel should be expanded by default */
  defaultExpanded?: boolean;
  /** Icon to display alongside the title */
  icon?: ReactNode;
  /** Additional styling */
  sx?: any;
}

/**
 * Panel component for consistent UI containers
 */
const Panel: React.FC<PanelProps> = ({ title, children, defaultExpanded = true, icon, sx = {} }) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  return (
    <Paper 
      elevation={2}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      {title && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2, 
          borderBottom: '1px solid', 
          borderColor: 'divider', 
          pb: 1 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon && icon}
            <Typography 
              variant="h6" 
              component="h2" 
            >
              {title}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={toggleExpand}
            aria-expanded={expanded}
            aria-label={expanded ? "collapse" : "expand"}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      )}
      <Collapse in={expanded} timeout="auto" sx={{ flexGrow: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default Panel;
