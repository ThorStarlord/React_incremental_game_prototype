import React, { useState } from 'react';
import { Card, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './Panel.module.css';

/**
 * Panel Component
 * 
 * A collapsible container with a header that can be expanded or collapsed.
 * Used to organize and section content in the UI.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title displayed in the panel header
 * @param {React.ReactNode} [props.icon] - Optional icon to display before the title
 * @param {React.ReactNode} props.children - Content to display inside the panel
 * @param {boolean} [props.defaultExpanded=true] - Whether the panel is expanded by default
 * @param {Object} [props.sx={}] - Additional MUI styling to apply to the Card component
 * @returns {React.ReactElement} Rendered Panel component
 */
const Panel = ({ title, icon, children, defaultExpanded = true, sx = {} }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        ...sx 
      }}
      className={styles.panel}
    >
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          background: 'transparent',
          '&:before': {
            display: 'none',
          },
        }}
        className={expanded ? styles.expanded : styles.collapsed}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: theme.palette.primary.contrastText,
            },
          }}
          className={styles.panelHeader}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }} className={styles.panelHeaderIcon}>
            {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
            <Typography variant="h6">{title}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: theme.palette.background.default,
            boxShadow: theme.shadows[1],
            width: '100%'
          }}
          className={styles.panelContent}
        >
          {children}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default Panel;