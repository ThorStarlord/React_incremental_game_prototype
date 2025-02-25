import React, { useState } from 'react';
import { Card, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Panel = ({ title, children, defaultExpanded = true, sx = {} }) => {
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
        >
          <Typography variant="h6">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: theme.palette.background.default,
            boxShadow: theme.shadows[1],
            width: '100%'
          }}
        >
          {children}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default Panel;