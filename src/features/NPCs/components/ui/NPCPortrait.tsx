import React from 'react';
import { Avatar, Typography } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import type { NPC } from '../../state/NPCTypes';

/** Stable offline portrait substitute; replaces unresolved legacy avatar PNGs. */
export const NPCPortrait: React.FC<{ npc: NPC; size?: number }> = ({ npc, size = 52 }) => {
  const tones = [
    ['#3d5b63', '#a3c8bf'], ['#705d74', '#d4b9d0'], ['#76593e', '#d4ad78'],
    ['#475b79', '#b6c9e8'], ['#4e684f', '#c6d6a9'],
  ];
  const hash = npc.id.split('').reduce((n, c) => n + c.charCodeAt(0), 0);
  const [dark, light] = npc.id === 'npc_elder_willow'
    ? ['#315b50', '#8fae87']
    : tones[hash % tones.length];
  const initials = npc.name.trim().split(/\s+/).slice(0, 2).map(word => word[0]?.toUpperCase()).join('');
  return (
    <Avatar aria-hidden="true" sx={{
      position: 'relative', width: size, height: size, background: `linear-gradient(135deg, ${dark}, ${light})`,
      color: '#fff', border: '2px solid', borderColor: 'background.paper',
      boxShadow: '0 2px 9px rgba(0, 0, 0, 0.14)',
    }}>
      {npc.id === 'npc_elder_willow' && (
        <SpaIcon aria-hidden="true" sx={{
          position: 'absolute', top: '4%', right: '4%',
          fontSize: Math.max(12, size * 0.29), opacity: 0.55,
        }} />
      )}
      <Typography variant="subtitle1" component="span" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: Math.max(14, size * 0.31), zIndex: 1 }}>
        {initials}
      </Typography>
    </Avatar>
  );
};
export default NPCPortrait;
