import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  TextField, 
  InputAdornment,
  Chip,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

import Panel from '../../../../shared/components/layout/Panel';
import { TraitEffect } from '../../state/TraitsTypes';

/**
 * Interface representing the props for the TraitList component
 * @interface TraitListProps
 * @property {Array<Object>} traits - The array of trait objects to display
 * @property {Function} onTraitLevelUp - Callback function triggered when a trait is leveled up
 * @property {number} pointsAvailable - Number of trait points available to spend
 */
interface TraitListProps {
  traits: Array<{
    id: string;
    name: string;
    level: number;
    description: string;
    effect: string;
    cost: number;
    type?: string;
  }>;
  onTraitLevelUp: (traitId: string) => void;
  pointsAvailable: number;
}

/**
 * TraitList Component
 * 
 * Displays a list of traits, allowing interaction like leveling up.
 * Uses the shared Panel component for its container.
 * 
 * @param {TraitListProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const TraitList: React.FC<TraitListProps> = ({ traits, onTraitLevelUp, pointsAvailable }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Extract all unique trait types
  const traitTypes = Array.from(new Set(traits.map(trait => trait.type || 'Unknown')));
  
  // Filter traits based on search query and active filter
  const filteredTraits = traits.filter(trait => {
    const matchesSearch = searchQuery === '' || 
      trait.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trait.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === null || trait.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  // Handle filter click
  const handleFilterClick = (type: string) => {
    if (activeFilter === type) {
      setActiveFilter(null);
    } else {
      setActiveFilter(type);
    }
  };
  
  return (
    <Panel title="Available Traits" defaultExpanded={true}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Available Points: <strong>{pointsAvailable}</strong>
        </Typography>
        
        {/* Search field */}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search traits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        {/* Type filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">Filter:</Typography>
          </Box>
          
          {traitTypes.map(type => (
            <Chip 
              key={type}
              label={type}
              clickable
              color={activeFilter === type ? 'primary' : 'default'}
              onClick={() => handleFilterClick(type)}
              size="small"
            />
          ))}
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Traits list */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2
      }}>
        {filteredTraits.length > 0 ? (
          filteredTraits.map((trait) => (
            <Panel
              key={trait.id}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" component="span">{trait.name}</Typography>
                  <Chip label={trait.type} size="small" sx={{ ml: 1 }} />
                </Box>
              }
              defaultExpanded={false} // Start collapsed
              icon={<AutoFixHighIcon />} // Example icon
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {trait.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Effect: {trait.effect}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Cost: {trait.cost}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Chip
                  label="Level Up"
                  clickable
                  color={pointsAvailable >= trait.cost ? 'primary' : 'default'}
                  onClick={() => pointsAvailable >= trait.cost && onTraitLevelUp(trait.id)}
                  size="small"
                />
              </Box>
            </Panel>
          ))
        ) : (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center', 
            bgcolor: theme.palette.background.default, 
            borderRadius: 1
          }}>
            <Typography variant="body1" color="text.secondary">
              No traits match your search criteria
            </Typography>
          </Box>
        )}
      </Box>
    </Panel>
  );
};

export default TraitList;
