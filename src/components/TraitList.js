import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Zoom,
  Badge
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import useTraitEffects from '../hooks/useTraitEffects';
import Panel from './Panel';
import ParticleEffect from './ParticleEffect';

const TraitCard = ({ id, trait, onAcquire, essence, isAcquired }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { activeEffects } = useTraitEffects();
  const activeEffect = activeEffects.find(effect => effect.id === id);
  const [showParticles, setShowParticles] = useState(false);
  const [particlePos, setParticlePos] = useState({ x: 0, y: 0 });

  const handleConfirm = (e) => {
    setShowConfirm(false);
    // Store click position for particle effect
    const rect = e.currentTarget.getBoundingClientRect();
    setParticlePos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setShowParticles(true);
    onAcquire(id, trait.essenceCost);
  };

  return (
    <>
      {showParticles && (
        <ParticleEffect 
          x={particlePos.x}
          y={particlePos.y}
          onComplete={() => setShowParticles(false)}
        />
      )}

      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
      >
        {isAcquired && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              bgcolor: 'success.main',
              opacity: 0.1,
              zIndex: 0
            }}
          />
        )}
        <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {trait.name}
              </Typography>
              {isAcquired && (
                <Tooltip title="Acquired">
                  <CheckCircleIcon color="success" fontSize="small" />
                </Tooltip>
              )}
            </Box>
            <Chip
              label={trait.type}
              size="small"
              color={trait.type === 'Knowledge' ? 'primary' : 'secondary'}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {trait.description}
          </Typography>
          {isAcquired && activeEffect && (
            <Box sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AutoAwesomeIcon fontSize="small" />
                Active Effect: {activeEffect.effect}
              </Typography>
            </Box>
          )}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="body2" color="primary">
              {trait.essenceCost} Essence
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            fullWidth
            variant={isAcquired ? "outlined" : "contained"}
            onClick={() => setShowConfirm(true)}
            disabled={essence < trait.essenceCost || isAcquired}
            color={isAcquired ? "success" : "primary"}
            startIcon={isAcquired && <CheckCircleIcon />}
          >
            {isAcquired ? "Acquired" : "Acquire"}
          </Button>
        </CardActions>
      </Card>

      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        TransitionComponent={Zoom}
      >
        <DialogTitle>Confirm Trait Acquisition</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to acquire {trait.name} for {trait.essenceCost} essence?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Effect: {trait.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const TraitList = () => {
  const { essence, traits, player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const [showAcquireEffect, setShowAcquireEffect] = useState(false);
  const [acquiredTraitName, setAcquiredTraitName] = useState('');
  const { activeEffects } = useTraitEffects();

  const handleAcquire = (traitId, cost) => {
    if (essence >= cost) {
      dispatch({ 
        type: 'COPY_TRAIT', 
        payload: { traitId, essenceCost: cost } 
      });

      // Show acquisition effect
      setAcquiredTraitName(traits.copyableTraits[traitId].name);
      setShowAcquireEffect(true);
      setTimeout(() => setShowAcquireEffect(false), 2000);
    }
  };

  return (
    <Panel title="Available Traits">
      {showAcquireEffect && (
        <Fade in={showAcquireEffect}>
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              textAlign: 'center',
              color: 'success.main',
              backgroundColor: 'rgba(0,0,0,0.8)',
              p: 3,
              borderRadius: 2,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">
              Trait Acquired: {acquiredTraitName}!
            </Typography>
          </Box>
        </Fade>
      )}

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Current Essence: {essence}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acquire traits to enhance your character's abilities
            </Typography>
          </Box>
          {activeEffects.length > 0 && (
            <Chip 
              label={`${activeEffects.length} Active Traits`}
              color="success"
              size="small"
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={2}>
        {Object.entries(traits.copyableTraits).map(([id, trait]) => (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <TraitCard
              id={id}
              trait={trait}
              onAcquire={handleAcquire}
              essence={essence}
              isAcquired={player.acquiredTraits.includes(id)}
            />
          </Grid>
        ))}
      </Grid>

      {player.acquiredTraits.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            You haven't acquired any traits yet. Gather essence through relationships and meditation to acquire traits!
          </Typography>
        </Box>
      )}
    </Panel>
  );
};

export default TraitList;