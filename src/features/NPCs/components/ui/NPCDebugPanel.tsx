import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  IconButton,
  ButtonGroup
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useAppDispatch } from '../../../../app/hooks';
import {
  updateNPCRelationshipThunk,
  updateNPCConnectionDepthThunk
} from '../../';
import type { NPC } from '../../state/NPCTypes';

/**
 * A single row in the debug panel for managing an NPC's stats.
 */
const NPCDebugRow: React.FC<{ npc: NPC }> = ({ npc }) => {
  const dispatch = useAppDispatch();

  const handleRelationshipChange = (amount: number) => {
    dispatch(updateNPCRelationshipThunk({ npcId: npc.id, change: amount, reason: `Debug Panel (${amount > 0 ? '+' : ''}${amount})` }));
  };

  const handleConnectionChange = (amount: number) => {
    const newDepth = Math.max(0, Math.min(10, npc.connectionDepth + amount));
    dispatch(updateNPCConnectionDepthThunk({ npcId: npc.id, newDepth }));
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" sx={{p: 1}}>
        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="subtitle1" fontWeight="medium">{npc.name}</Typography>
        </Grid>
        
        {/* Relationship Controls */}
        <Grid item xs={6} sm={4} md={4.5}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ minWidth: 120 }}>
              Relationship: <strong>{npc.relationshipValue}</strong>
            </Typography>
            <ButtonGroup size="small" variant="outlined">
              <Button onClick={() => handleRelationshipChange(-10)}>-10</Button>
              <Button onClick={() => handleRelationshipChange(-1)}>-1</Button>
              <Button onClick={() => handleRelationshipChange(1)}>+1</Button>
              <Button onClick={() => handleRelationshipChange(10)}>+10</Button>
            </ButtonGroup>
          </Box>
        </Grid>
        
        {/* Connection Depth Controls */}
        <Grid item xs={6} sm={4} md={4.5}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ minWidth: 120 }}>
              Connection: <strong>{npc.connectionDepth.toFixed(1)}</strong>
            </Typography>
            <ButtonGroup size="small" variant="outlined">
                <Button onClick={() => handleConnectionChange(-1)}>-1</Button>
                <Button onClick={() => handleConnectionChange(-0.1)}>-0.1</Button>
                <Button onClick={() => handleConnectionChange(0.1)}>+0.1</Button>
                <Button onClick={() => handleConnectionChange(1)}>+1</Button>
            </ButtonGroup>
          </Box>
        </Grid>

      </Grid>
      <Divider sx={{ my: 1 }} />
    </Box>
  );
};

// The component now accepts the list of NPCs as a prop.
interface NPCDebugPanelProps {
    npcList: NPC[];
}

/**
 * The main debug panel for managing all NPC connections. This is now a "dumb" component.
 */
export const NPCDebugPanel: React.FC<NPCDebugPanelProps> = ({ npcList }) => {
  const sortedNpcList = [...npcList].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>NPC Relationship & Connection Debug</Typography>
        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
          Use these buttons to adjust relationship values. When "Relationship" reaches 100, it will reset and "Connection" will increase by 1, updating the essence generation rate automatically.
        </Typography>
        {sortedNpcList.map(npc => (
          <NPCDebugRow key={npc.id} npc={npc} />
        ))}
      </CardContent>
    </Card>
  );
};

export default NPCDebugPanel;