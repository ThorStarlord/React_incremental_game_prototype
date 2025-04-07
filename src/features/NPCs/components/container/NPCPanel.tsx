import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper, Card, CardContent, Avatar, Chip, IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Import from Redux store
import { RootState } from '../../../../app/store';
import { toggleFavoriteNpc } from '../../state/NPCsSlice';
import { selectNpcsAsArray, selectFavoriteNpcs } from '../../state/NPCsSelectors';

// Import NPC types
import { NPC } from '../../state/NPCsTypes';

// Define props for the NPCPanel component
interface NPCPanelProps {
  /** Whether to show a compact version of the panel */
  compact?: boolean;
  /** Callback when an NPC is selected */
  onSelectNPC?: (npcId: string) => void;
  /** Whether to only show favorite NPCs */
  favoritesOnly?: boolean;
  /** Filter NPCs by location */
  locationFilter?: string;
  /** Custom styling */
  sx?: React.CSSProperties;
}

/**
 * NPCPanel component that displays a list of NPCs
 * Can be filtered by favorites and location
 */
const NPCPanel: React.FC<NPCPanelProps> = ({
  compact = false,
  onSelectNPC,
  favoritesOnly = false,
  locationFilter,
  sx = {}
}) => {
  // Get NPC data from Redux
  const allNpcs = useSelector(selectNpcsAsArray);
  const favoriteNpcIds = useSelector((state: RootState) => 
    state.npcs?.playerInteractions?.favoriteNpcs || []
  );
  const dispatch = useDispatch();
  
  // Local state
  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);
  
  // Filter NPCs based on props
  const filteredNpcs = allNpcs.filter(npc => {
    // Filter by unlocked status
    if (!npc.unlocked) return false;
    
    // Filter by favorites if needed
    if (favoritesOnly && !favoriteNpcIds.includes(npc.id)) return false;
    
    // Filter by location if specified
    if (locationFilter && npc.location !== locationFilter) return false;
    
    return true;
  });
  
  // Handle NPC selection
  const handleSelectNPC = (npcId: string) => {
    if (onSelectNPC) {
      onSelectNPC(npcId);
    }
  };
  
  // Handle toggling favorite status
  const handleToggleFavorite = (npcId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    dispatch(toggleFavoriteNpc({ npcId }));
  };
  
  // Render compact version
  if (compact) {
    return (
      <Paper sx={{ p: 2, ...sx }}>
        <Typography variant="h6" gutterBottom>
          {favoritesOnly ? 'Favorite NPCs' : 'Available NPCs'}
        </Typography>
        
        {filteredNpcs.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            {favoritesOnly ? 'No favorite NPCs yet.' : 'No NPCs available.'}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filteredNpcs.map(npc => (
              <Chip
                key={npc.id}
                avatar={npc.portrait ? <Avatar src={npc.portrait} /> : undefined}
                label={npc.name}
                onClick={() => handleSelectNPC(npc.id)}
                sx={{ cursor: 'pointer' }}
                color={favoriteNpcIds.includes(npc.id) ? 'primary' : 'default'}
              />
            ))}
          </Box>
        )}
      </Paper>
    );
  }
  
  // Render full version
  return (
    <Paper sx={{ p: 2, ...sx }}>
      <Typography variant="h6" gutterBottom>
        {favoritesOnly ? 'Favorite NPCs' : 'Available NPCs'}
      </Typography>
      
      {filteredNpcs.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
          {favoritesOnly ? 'No favorite NPCs yet.' : 'No NPCs available.'}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredNpcs.map(npc => (
            <Card 
              key={npc.id}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => handleSelectNPC(npc.id)}
              onMouseEnter={() => setHoveredNpc(npc.id)}
              onMouseLeave={() => setHoveredNpc(null)}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar 
                    src={npc.portrait || npc.image} 
                    alt={npc.name}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1">{npc.name}</Typography>
                        {npc.title && (
                          <Typography variant="body2" color="text.secondary">
                            {npc.title}
                          </Typography>
                        )}
                      </Box>
                      
                      <Tooltip title={favoriteNpcIds.includes(npc.id) ? "Remove from favorites" : "Add to favorites"}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleToggleFavorite(npc.id, e)}
                          color={favoriteNpcIds.includes(npc.id) ? "primary" : "default"}
                        >
                          {favoriteNpcIds.includes(npc.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Box sx={{ mt: 1 }}>
                      {/* Display location as a chip */}
                      {npc.location && (
                        <Chip 
                          label={npc.location} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      )}
                      
                      {/* Display relationship level if significant */}
                      {npc.relationship && npc.relationship.value !== 0 && (
                        <Chip
                          label={`${npc.relationship.level} (${npc.relationship.value})`}
                          size="small"
                          color={npc.relationship.value > 0 ? "success" : "error"}
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      )}
                      
                      {/* Show tags if available and hovered */}
                      {hoveredNpc === npc.id && npc.tags && npc.tags.map(tag => (
                        <Chip 
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
                
                {/* Show description on hover */}
                {hoveredNpc === npc.id && npc.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {npc.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default NPCPanel;
