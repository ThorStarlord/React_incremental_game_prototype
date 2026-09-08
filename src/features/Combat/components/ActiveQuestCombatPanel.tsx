import React, { useMemo } from 'react';
import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectPermanentTraits } from '../../Player/state/PlayerSelectors';
import {
  getLocationDefinition,
  resolveCanonicalLocationId,
} from '../../Exploration/LocationDefinitions';
import { targetKilled } from '../CombatSlice';
import { getCombatEncounterByTargetId } from '../CombatEncounterDefinitions';
import CombatEncounterPanel from './CombatEncounterPanel';

export const ActiveQuestCombatPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeQuestIds = useAppSelector(state => state.quest.activeQuestIds);
  const quests = useAppSelector(state => state.quest.quests);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const playerLocationValue = useAppSelector(state => state.player.location);
  const playerLocationId = resolveCanonicalLocationId(playerLocationValue);

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

  const requiredLocationId = candidate.definition.requiredLocationId
    ? resolveCanonicalLocationId(candidate.definition.requiredLocationId)
    : undefined;

  if (requiredLocationId && playerLocationId !== requiredLocationId) {
    const requiredLocation = getLocationDefinition(requiredLocationId);
    return (
      <Card elevation={2}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">Encounter Located Elsewhere</Typography>
            <Alert severity="info">
              {candidate.definition.name} can only be confronted at {requiredLocation?.name ?? requiredLocationId}.
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
