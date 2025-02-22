import React, { useState } from 'react';
import { Card, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Panel = ({ title, children, defaultExpanded = true, sx = {} }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card sx={{ width: '100%', height: '100%', ...sx }}>
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
          sx={{
            backgroundColor: 'lightblue',
            color: 'white'
          }}
        >
          <Typography variant="h6">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            boxShadow: 1,
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