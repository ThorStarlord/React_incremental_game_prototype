import React from 'react';
import { Box, Typography, Avatar, LinearProgress, Stack } from '@mui/material';

/**
 * Interface for a character to display in the panel
 */
interface Character {
  /** Unique identifier for the character */
  id: string;
  /** Display name of the character */
  name: string;
  /** Character's current level */
  level: number;
  /** Current health points */
  health: number;
  /** Maximum health points */
  maxHealth: number;
  /** Optional portrait/avatar image URL */
  portrait?: string;
}

/**
 * Props for the CompactCharacterPanel component
 */
interface CompactCharacterPanelProps {
  /** Array of characters to display */
  characters: Character[];
  /** Optional click handler */
  onCharacterClick?: (characterId: string) => void;
}

/**
 * CompactCharacterPanel Component
 * 
 * Displays a compact list of characters with basic stats
 * 
 * @param props - Component props
 * @returns React component
 */
const CompactCharacterPanel: React.FC<CompactCharacterPanelProps> = ({
  characters = [],
  onCharacterClick
}) => {
  return (
    <Stack spacing={2}>
      {characters.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          No characters available
        </Typography>
      ) : (
        characters.map(character => (
          <Box 
            key={character.id}
            sx={{
              display: 'flex', 
              alignItems: 'center',
              p: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              cursor: onCharacterClick ? 'pointer' : 'default',
              '&:hover': onCharacterClick ? {
                bgcolor: 'action.hover'
              } : {}
            }}
            onClick={() => onCharacterClick && onCharacterClick(character.id)}
          >
            <Avatar 
              src={character.portrait} 
              alt={character.name}
              sx={{ width: 40, height: 40, mr: 1.5 }}
            >
              {character.name.charAt(0)}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2">{character.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Lv. {character.level}
                </Typography>
              </Box>
              
              <Box sx={{ width: '100%', mt: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">HP</Typography>
                  <Typography variant="caption">
                    {character.health}/{character.maxHealth}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(character.health / character.maxHealth) * 100}
                  color="error"
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>
        ))
      )}
    </Stack>
  );
};

export default CompactCharacterPanel;
