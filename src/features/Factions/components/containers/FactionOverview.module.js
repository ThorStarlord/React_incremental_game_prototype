import React, { useContext } from 'react';
import { GameStateContext } from '../../../../context/GameStateContext';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Paper, Box } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import './FactionOverview.css';

const FactionOverview = () => {
  const { player, factions } = useContext(GameStateContext);
  const faction = factions.find(f => f.id === player.factionId);

  return (
    <Paper className="faction-overview">
      <Box className="faction-header">
        <Typography variant="h5" component="h2">
          {faction.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {faction.type} - Level {faction.level}
        </Typography>
      </Box>

      <Box className="faction-description">
        <Typography>
          {faction.description}
        </Typography>
      </Box>

      <Box className="faction-stats">
        <Typography variant="h6">
          Faction Stats
        </Typography>
        <Box className="stats-grid">
          <Box className="stat-item">
            <Typography variant="body2" color="textSecondary">Members</Typography>
            <Typography><GroupIcon /> {faction.memberCount}</Typography>
          </Box>
          <Box className="stat-item">
            <Typography variant="body2" color="textSecondary">Influence</Typography>
            <Typography>{faction.resources.influence}</Typography>
          </Box>
          <Box className="stat-item">
            <Typography variant="body2" color="textSecondary">Knowledge</Typography>
            <Typography>{faction.resources.knowledge}</Typography>
          </Box>
        </Box>
      </Box>

      <Box className="faction-members">
        <Typography variant="h6">
          Members
        </Typography>
        <List>
          {faction.members.map(member => (
            <ListItem key={member.id}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={member.name}
                secondary={`${member.role} • ${member.type}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default FactionOverview;