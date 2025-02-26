// Add import for the icon
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// In your component function:
const NPCList = () => {
  const { npcs, player } = useContext(GameStateContext);
  const hasGrowingAffinity = player.equippedTraits.includes('GrowingAffinity');
  
  // Rest of your component...
  
  return (
    <Paper sx={{ p: 2 }}>
      {/* ... */}
      <List>
        {npcs.map(npc => {
          const relationship = npc.relationship || 0;
          const isGrowing = hasGrowingAffinity && relationship < 100;
          
          return (
            <ListItem key={npc.id} divider>
              {/* ... existing NPC info ... */}
              
              {/* Add relationship info with growth indicator */}
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption">
                    Relationship: {relationship}
                  </Typography>
                  
                  {isGrowing && (
                    <Tooltip title="Growing due to Growing Affinity trait">
                      <Box component="span" sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        color: 'success.main',
                        ml: 1
                      }}>
                        <ArrowUpwardIcon fontSize="small" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          +1/min
                        </Typography>
                      </Box>
                    </Tooltip>
                  )}
                </Box>
                
                {/* Relationship progress bar */}
                <LinearProgress 
                  variant="determinate" 
                  value={(relationship + 100) / 2}
                  sx={{ 
                    height: 5,
                    borderRadius: 2,
                    bgcolor: 'grey.300',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: relationshipTier.color
                    }
                  }}
                />
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};