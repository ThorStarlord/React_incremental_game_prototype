import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ExtensionIcon from '@mui/icons-material/Extension';

import type { NpcState } from '../../../state/NpcTypes';

interface NPCOverviewTabProps {
  npc: NpcState;
}

const NPCOverviewTab: React.FC<NPCOverviewTabProps> = ({ npc }) => {
  const visibleTraits = npc.traits ? Object.values(npc.traits).filter(trait => trait.isVisible) : [];
  const totalTraits = npc.traits ? Object.keys(npc.traits).length : 0;

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* Basic Information */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <InfoIcon color="primary" />
            <Typography variant="h6">Basic Information</Typography>
          </Box>
          
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Name" 
                secondary={npc.name}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Location" 
                secondary={npc.location}
              />
            </ListItem>
            {npc.status && (
              <ListItem>
                <ListItemText 
                  primary="Current Status" 
                  secondary={npc.status}
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemText 
                primary="Relationship Level" 
                secondary={`${npc.relationshipValue.toFixed(1)} / 5.0`}
              />
            </ListItem>
            {npc.connectionDepth !== undefined && (
              <ListItem>
                <ListItemText 
                  primary="Connection Depth" 
                  secondary={npc.connectionDepth.toFixed(2)}
                />
              </ListItem>
            )}
            {npc.loyalty !== undefined && (
              <ListItem>
                <ListItemText 
                  primary="Loyalty" 
                  secondary={`${npc.loyalty}%`}
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Available Traits */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ExtensionIcon color="primary" />
            <Typography variant="h6">Traits</Typography>
            <Chip 
              label={`${visibleTraits.length} / ${totalTraits}`} 
              size="small" 
              variant="outlined"
            />
          </Box>
          
          {visibleTraits.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {visibleTraits.map((trait) => (
                <Chip
                  key={trait.id}
                  label={trait.id}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {totalTraits > 0 
                ? 'No traits visible at current relationship level'
                : 'No known traits'
              }
            </Typography>
          )}
          
          {totalTraits > visibleTraits.length && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {totalTraits - visibleTraits.length} additional traits hidden. 
                Improve your relationship to discover more.
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Unlock Requirements */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Interaction Unlocks
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Dialogue" 
                secondary={npc.relationshipValue >= 1 ? "✓ Unlocked" : "Requires relationship level 1+"}
              />
              <Chip 
                label={npc.relationshipValue >= 1 ? "Available" : "Locked"} 
                size="small" 
                color={npc.relationshipValue >= 1 ? "success" : "default"}
                variant="outlined"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Trade" 
                secondary={npc.relationshipValue >= 2 ? "✓ Unlocked" : "Requires relationship level 2+"}
              />
              <Chip 
                label={npc.relationshipValue >= 2 ? "Available" : "Locked"} 
                size="small" 
                color={npc.relationshipValue >= 2 ? "success" : "default"}
                variant="outlined"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Quests" 
                secondary={npc.relationshipValue >= 3 ? "✓ Unlocked" : "Requires relationship level 3+"}
              />
              <Chip 
                label={npc.relationshipValue >= 3 ? "Available" : "Locked"} 
                size="small" 
                color={npc.relationshipValue >= 3 ? "success" : "default"}
                variant="outlined"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Trait Sharing" 
                secondary={npc.relationshipValue >= 4 ? "✓ Unlocked" : "Requires relationship level 4+"}
              />
              <Chip 
                label={npc.relationshipValue >= 4 ? "Available" : "Locked"} 
                size="small" 
                color={npc.relationshipValue >= 4 ? "success" : "default"}
                variant="outlined"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(NPCOverviewTab);
