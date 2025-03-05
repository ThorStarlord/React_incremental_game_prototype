import React from 'react';
import { Grid } from '@mui/material';
import NPCCard from './NPCCard';

/**
 * Interface for an NPC object
 */
interface NPC {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Other NPC properties */
  [key: string]: any;
}

/**
 * Interface for NPCList component props
 */
interface NPCListProps {
  /** Array of NPC objects to display */
  npcs: NPC[];
}

/**
 * Component that displays a grid of NPC cards
 * 
 * @param props - Component props
 * @returns Grid of NPC cards
 */
const NPCList: React.FC<NPCListProps> = ({ npcs }) => {
  return (
    <Grid container spacing={2}>
      {npcs.map(npc => (
        <Grid item xs={12} sm={6} md={4} key={npc.id}>
          <NPCCard npc={npc} />
        </Grid>
      ))}
    </Grid>
  );
};

export default NPCList;
