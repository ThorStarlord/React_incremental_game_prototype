import React, { useState, useContext } from 'react';
import { GameDispatchContext, GameStateContext } from '../../../../context/GameStateContext';
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
  const { essence } = useContext(GameStateContext);
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

    if (essence < 50) { // Example cost check using Essence
      setErrors(prev => ({
        ...prev,
        form: 'Not enough Essence'
      }));
      return;
    }

    dispatch({
      type: 'SPEND_ESSENCE',
      payload: 50 // Deduct 50 Essence as cost
    });

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