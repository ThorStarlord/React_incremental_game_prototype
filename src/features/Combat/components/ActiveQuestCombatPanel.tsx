import React, { useMemo } from 'react';
import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectPermanentTraits } from '../../Player/state/PlayerSelectors';
import { targetKilled } from '../CombatSlice';
import { getCombatEncounterByTargetId } from '../CombatEncounterDefinitions';
import { getCombatEncounterLocationAvailability } from '../CombatEncounterAvailability';
import CombatEncounterPanel from './CombatEncounterPanel';

export const ActiveQuestCombatPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeQuestIds = useAppSelector(state => state.quest.activeQuestIds);
  const quests = useAppSelector(state => state.quest.quests);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const playerLocation = useAppSelector(state => state.player.location);

  const candidate = useMemo(() => {
    for (const questId of activeQuestIds) {
      const quest = quests[questId];
      if (!quest) continue;

      for (const objective of quest.objectives) {
        if (objective.type !== 'KILL') continue;
        const definition = getCombatEncounterByTargetId(objective.target);
        if (!definition) continue;

        return {
          questId,
          questTitle: quest.title,
          objective,
          definition,
        };
      }
    }

    return undefined;
  }, [activeQuestIds, quests]);

  if (!candidate) return null;

  if (candidate.objective.isComplete) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">Combat Objective Complete</Typography>
            <Alert severity="success">
              {candidate.definition.name} has been defeated for {candidate.questTitle}. Return to the quest giver to complete the quest.
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const locationAvailability = getCombatEncounterLocationAvailability(
    candidate.definition,
    playerLocation
  );

  if (!locationAvailability.available) {
    return (
      <Card elevation={2} data-testid={`combat-location-gate-${candidate.definition.id}`}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">Encounter Location</Typography>
            <Alert severity="info">
              {candidate.definition.name} is at {locationAvailability.requiredLocationName ?? locationAvailability.requiredLocationId ?? 'its authored location'}. Travel there before beginning this encounter.
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <CombatEncounterPanel
      definition={candidate.definition}
      permanentTraitIds={permanentTraitIds}
      onTargetKilled={targetId => dispatch(targetKilled({ targetId }))}
    />
  );
};

export default ActiveQuestCombatPanel;
