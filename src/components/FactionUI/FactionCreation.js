import React, { useState, useContext } from 'react';
import { GameDispatchContext } from '../../context/GameStateContext';
import { 
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import './FactionCreation.css';

const FACTION_TYPES = [
  { value: 'Knowledge', label: 'Knowledge - Focus on learning and research' },
  { value: 'Military', label: 'Military - Focus on combat and defense' },
  { value: 'Commerce', label: 'Commerce - Focus on trade and wealth' },
  { value: 'Spirituality', label: 'Spirituality - Focus on mystical powers' }
];

const FactionCreation = ({ onComplete }) => {
  const dispatch = useContext(GameDispatchContext);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Faction name is required';
    }
    if (!formData.type) {
      newErrors.type = 'Faction type is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch({
      type: 'CREATE_FACTION',
      payload: formData
    });

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Paper className="faction-creation">
      <Typography variant="h5" component="h2" gutterBottom>
        Create New Faction
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Faction Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          margin="normal"
        />

        <FormControl fullWidth margin="normal" error={!!errors.type}>
          <InputLabel>Faction Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            label="Faction Type"
          >
            {FACTION_TYPES.map(type => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
          {errors.type && (
            <Typography color="error" variant="caption">
              {errors.type}
            </Typography>
          )}
        </FormControl>

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          margin="normal"
          multiline
          rows={4}
        />

        <Box className="form-actions">
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size="large"
          >
            Create Faction
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default FactionCreation;

import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FactionContainer from './FactionUI/FactionContainer';
import Battle from './Battle';
import NPCEncounter from './NPCEncounter';
import PlayerStats from './PlayerStats';
import PlayerTraits from './PlayerTraits';
import './GameContainer.css';

const GameContainer = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const menuItems = [
    { id: 'stats', label: 'Character Stats', icon: <PersonIcon /> },
    { id: 'traits', label: 'Character Traits', icon: <GroupIcon /> },
    { id: 'faction', label: 'Faction', icon: <BusinessIcon /> },
    { id: 'battle', label: 'Battle', icon: <SportsKabaddiIcon /> },
    { id: 'npcs', label: 'NPCs', icon: <AccountBalanceIcon /> },
    { id: 'shop', label: 'Shop', icon: <StorefrontIcon /> }
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'stats':
        return <PlayerStats />;
      case 'traits':
        return <PlayerTraits />;
      case 'faction':
        return <FactionContainer />;
      case 'battle':
        return <Battle />;
      case 'npcs':
        return <NPCEncounter npcId={1} />;
      case 'shop':
        return <div>Shop Coming Soon</div>;
      default:
        return (
          <Grid container spacing={3}>
            {menuItems.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardActionArea onClick={() => setSelectedSection(item.id)}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                        {item.icon}
                        <Typography variant="h6" component="h2">
                          {item.label}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
    }
  };

  return (
    <Box className="game-container">
      <Box className="content">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default GameContainer;

.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px;
  background-color: #f5f5f5;
}

.content {
  flex-grow: 1;
  overflow-y: auto;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  text-align: center;
}

.card .MuiSvgIcon-root {
  font-size: 3rem;
  margin-bottom: 8px;
}