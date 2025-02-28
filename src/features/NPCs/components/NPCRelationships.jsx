import React, { useContext } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { GameStateContext } from '../../../context/GameStateContext';
import RelationshipDisplay from './RelationshipDisplay';
import Panel from '../../../components/common/Panel';

const NPCRelationships = () => {
  const { npcs, player } = useContext(GameStateContext);
  const [tab, setTab] = React.useState('all');
  
  // Filter NPCs that the player has met
  const metNPCs = npcs.filter(npc => player.metNPCs?.includes(npc.id));
  
  // Group NPCs by location
  const npcsByLocation = metNPCs.reduce((acc, npc) => {
    const location = npc.location || 'unknown';
    if (!acc[location]) acc[location] = [];
    acc[location].push(npc);
    return acc;
  }, {});
  
  // Filter based on tab
  const filteredNPCs = tab === 'all' ? metNPCs : npcsByLocation[tab] || [];
  
  // Sort NPCs by relationship value (highest first)
  const sortedNPCs = [...filteredNPCs].sort((a, b) => 
    (b.relationship || 0) - (a.relationship || 0)
  );
  
  const locations = Object.keys(npcsByLocation);
  
  return (
    <Panel title="NPC Relationships">
      <Tabs 
        value={tab} 
        onChange={(e, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        <Tab label="All" value="all" />
        {locations.map((loc) => (
          <Tab key={loc} label={loc.charAt(0).toUpperCase() + loc.slice(1)} value={loc} />
        ))}
      </Tabs>
      
      {sortedNPCs.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
          No NPCs discovered in this area yet.
        </Typography>
      ) : (
        <Box>
          {sortedNPCs.map(npc => (
            <Box key={npc.id} sx={{ mb: 1 }}>
              <RelationshipDisplay npc={npc} />
              <Button 
                component={Link}
                to={`/npc/${npc.id}`}
                size="small"
                variant="outlined"
                sx={{ mt: 0.5, width: '100%' }}
              >
                Visit {npc.name}
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Panel>
  );
};

export default NPCRelationships;