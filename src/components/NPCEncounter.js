import React, { useContext, useState } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import { getDialogueOptions } from '../modules/dialogueManager';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Box } from '@mui/material';
import './NPCEncounter.css';

const NPCEncounter = ({ npcId, onBack }) => {
  const gameState = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const [dialogueResponse, setDialogueResponse] = useState('');
  const [traitCopyFeedback, setTraitCopyFeedback] = useState('');

  const npc = gameState.npcs.find(n => n.id === npcId);
  const player = gameState.player;

  if (!npc) return <div>NPC not found</div>;

  const getRarityStars = () => {
    switch(npc.rarity.toLowerCase()) {
      case 'rare':
        return (
          <>
            <StarIcon className="rarity-star rare" />
            <StarIcon className="rarity-star rare" />
            <StarIcon className="rarity-star rare" />
          </>
        );
      case 'uncommon':
        return (
          <>
            <StarIcon className="rarity-star uncommon" />
            <StarIcon className="rarity-star uncommon" />
            <StarBorderIcon className="rarity-star" />
          </>
        );
      default: // common
        return (
          <>
            <StarIcon className="rarity-star common" />
            <StarBorderIcon className="rarity-star" />
            <StarBorderIcon className="rarity-star" />
          </>
        );
    }
  };

  const copyTrait = (traitId) => {
    const trait = gameState.traits.copyableTraits[traitId];
    if (!trait) return;

    if (player.acquiredTraits.includes(traitId)) {
      setTraitCopyFeedback(`You have already learned ${trait.name}`);
      return;
    }

    if (player.essence < trait.essenceCost) {
      setTraitCopyFeedback(`Not enough Essence to learn ${trait.name}`);
      return;
    }

    dispatch({
      type: 'COPY_TRAIT',
      payload: {
        traitId,
        essenceCost: trait.essenceCost
      }
    });

    setTraitCopyFeedback(`Successfully learned ${trait.name}!`);
    
    // Update NPC opinion when learning a trait
    dispatch({
      type: 'UPDATE_NPC_OPINION',
      payload: {
        npcId: npc.id,
        opinion: getNewOpinionLevel(npc.opinionLevel, 1)
      }
    });
  };

  const handleDialogueOption = (action) => {
    const dialogueSet = getDialogueOptions(npc.type);
    const response = dialogueSet.responses[action];
    setDialogueResponse(response);

    // Opinion changes based on dialogue choices
    let opinionChange = 0;
    
    switch(action) {
      case 'LEARN':
      case 'MEDITATE':
      case 'TECHNIQUE':
        opinionChange = 1; // Scholarly activities please Sages
        break;
      case 'HAGGLE':
        opinionChange = -1; // Haggling might slightly annoy merchants
        break;
      case 'SPAR':
        opinionChange = 2; // Trainers love when you want to practice
        break;
      default:
        opinionChange = 0;
    }

    if (opinionChange !== 0) {
      dispatch({
        type: 'UPDATE_NPC_OPINION',
        payload: {
          npcId: npc.id,
          opinion: getNewOpinionLevel(npc.opinionLevel, opinionChange)
        }
      });
    }
  };

  const getNewOpinionLevel = (currentOpinion, change) => {
    const opinionLevels = ['Hostile', 'Unfriendly', 'Neutral', 'Friendly', 'Trusted'];
    const currentIndex = opinionLevels.indexOf(currentOpinion);
    const newIndex = Math.max(0, Math.min(opinionLevels.length - 1, currentIndex + change));
    return opinionLevels[newIndex];
  };

  const renderDialogueOptions = () => {
    const dialogueSet = getDialogueOptions(npc.type);
    return dialogueSet.options.map(option => (
      <button 
        key={option.id}
        className="dialogue-button"
        onClick={() => handleDialogueOption(option.action)}
      >
        {option.text}
      </button>
    ));
  };

  const renderTraits = () => {
    return npc.copyableTraits.map(traitId => {
      const trait = gameState.traits.copyableTraits[traitId];
      const isAcquired = player.acquiredTraits.includes(traitId);
      const canAfford = player.essence >= trait.essenceCost;

      return (
        <div key={traitId} className="npc-trait">
          <h4>{trait.name}</h4>
          <p>{trait.description}</p>
          <div className="trait-info">
            <span className="trait-type">{trait.type}</span>
            <span className="trait-cost">
              Cost: {trait.essenceCost} Essence
              {!canAfford && <span className="insufficient"> (Insufficient Essence)</span>}
            </span>
          </div>
          <button 
            onClick={() => copyTrait(traitId)}
            disabled={isAcquired || !canAfford}
            className={`copy-trait-button ${isAcquired ? 'acquired' : ''}`}
          >
            {isAcquired ? 'Trait Learned' : 'Learn Trait'}
          </button>
        </div>
      );
    });
  };

  return (
    <div className="npc-encounter">
      <Box className="npc-header-nav">
        <IconButton onClick={onBack} className="back-button">
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <div className="npc-info">
        <div className="npc-portrait">
          {npc.portrait ? (
            <img src={`/assets/portraits/${npc.portrait}.png`} alt={npc.name} />
          ) : (
            <PersonIcon className="placeholder-portrait" />
          )}
        </div>
        
        <div className="npc-header">
          <h3>{npc.name}</h3>
          <div className="rarity-indicator">
            <span className={`rarity-badge ${npc.rarity.toLowerCase()}`}>
              {npc.rarity}
            </span>
            <div className="rarity-stars">
              {getRarityStars()}
            </div>
          </div>
          <div className="npc-type">{npc.type}</div>
        </div>

        <div className="npc-dialogue">
          <p className="dialogue-text">"{npc.greeting}"</p>
          {dialogueResponse && (
            <p className="dialogue-response">"{dialogueResponse}"</p>
          )}
        </div>

        <div className="dialogue-options">
          {renderDialogueOptions()}
        </div>

        <p className="opinion-level">Opinion: {npc.opinionLevel}</p>
      </div>

      <div className="npc-traits">
        <h3>Available Traits</h3>
        {traitCopyFeedback && (
          <div className={`trait-feedback ${traitCopyFeedback.includes('Successfully') ? 'success' : 'error'}`}>
            {traitCopyFeedback}
          </div>
        )}
        {renderTraits()}
      </div>

      {npc.purchasableSkills.length > 0 && (
        <div className="npc-skills">
          <h3>Available Skills</h3>
          {npc.purchasableSkills.map(skillId => {
            const skill = gameState.skills.mental[skillId] || gameState.skills.physical[skillId];
            return (
              <div key={skillId} className="skill-item">
                <h4>{skill.name}</h4>
                <p>{skill.description}</p>
                <p>Cost: {skill.goldCost} Gold</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NPCEncounter;