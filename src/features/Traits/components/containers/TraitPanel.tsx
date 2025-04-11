import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  Divider,
  LinearProgress,
  useTheme
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

/**
 * Interface representing a character trait
 * @interface Trait
 * @property {string} id - Unique identifier for the trait
 * @property {string} name - Display name of the trait
 * @property {number} level - Current level of the trait
 * @property {string} description - Detailed description of what the trait does
 * @property {string} effect - Description of the trait's effect at current level
 * @property {number} cost - Cost in trait points to level up this trait
 * @property {string} [type] - Optional category/type of the trait
 */
interface Trait {
  id: string;
  name: string;
  level: number;
  description: string;
  effect: string;
  cost: number;
  type?: string;
}

/**
 * Interface representing the props for the TraitPanel component
 * @interface TraitPanelProps
 * @property {Trait} trait - The trait object to display
 * @property {Function} onLevelUp - Callback function triggered when the trait is leveled up
 * @property {boolean} canLevelUp - Whether the trait can currently be leveled up
 */
interface TraitPanelProps {
  trait: Trait;
  onLevelUp: () => void;
  canLevelUp: boolean;
}

/**
 * TraitPanel Component
 * 
 * Displays detailed information about a character trait and provides
 * a button to level up the trait if sufficient points are available.
 * 
 * @param {TraitPanelProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const TraitPanel: React.FC<TraitPanelProps> = ({ trait, onLevelUp, canLevelUp }) => {
  const { name, level, description, effect, cost, type } = trait;
  const theme = useTheme();

  /**
   * Handles the click event on the level up button
   * If the trait can be leveled up, calls the onLevelUp callback
   */
  const handleLevelUp = (): void => {
    if (canLevelUp) {
      onLevelUp();
    }
  };

  // Calculate a color based on level (just for visual interest)
  const getProgressColor = () => {
    if (level >= 10) return theme.palette.success.main;
    if (level >= 5) return theme.palette.info.main;
    return theme.palette.primary.main;
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2,
        borderLeft: `4px solid ${getProgressColor()}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="h6" component="h3" gutterBottom={false} sx={{ mb: 0.5 }}>
            {name}
          </Typography>
          
          {type && (
            <Chip 
              label={type} 
              size="small" 
              sx={{ fontSize: '0.75rem', height: 20, mr: 1 }} 
            />
          )}
        </Box>
        
        <Box sx={{ textAlign: 'right' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: getProgressColor(),
              fontWeight: 'bold'
            }}
          >
            Level {level}
          </Typography>
          
          <Box sx={{ width: 60, mt: 0.5 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, (level / 10) * 100)} 
              sx={{ 
                height: 4, 
                borderRadius: 1,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getProgressColor()
                }
              }} 
            />
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
        {description}
      </Typography>
      
      <Box sx={{ 
        p: 1, 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        borderRadius: 1,
        mb: 2
      }}>
        <Typography variant="body2" color="text.primary">
          <Box component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
            Current Effect:
          </Box>
          {effect}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          Cost: <Box component="span" sx={{ fontWeight: 'bold', color: canLevelUp ? 'success.main' : 'error.main' }}>
            {cost} points
          </Box>
        </Typography>
        
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleLevelUp}
          disabled={!canLevelUp}
          startIcon={<ArrowUpwardIcon />}
        >
          Level Up
        </Button>
      </Box>
    </Paper>
  );
};

export default TraitPanel;
