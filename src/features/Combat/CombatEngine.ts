import {
  getMissingPermanentTraitIds,
  hasRequiredPermanentTraits,
} from '../Traits/state/TraitCapabilityRequirements';
import type {
  CombatActionId,
  CombatActionPresentation,
  CombatActionResult,
  CombatEncounterDefinition,
  CombatEncounterState,
} from './CombatTypes';

export const createCombatEncounterState = (
  definition: CombatEncounterDefinition
): CombatEncounterState => ({
  encounterId: definition.id,
  targetId: definition.targetId,
  status: 'active',
  round: 0,
  playerHealth: definition.playerMaxHealth,
  enemyHealth: definition.enemyMaxHealth,
  enemyPhase: 'stable',
  patternRead: false,
  feedbackDisrupted: false,
});

const inactiveReason = (state: CombatEncounterState): string | undefined => {
  if (state.status === 'victory') return 'The encounter is already won.';
  if (state.status === 'defeat') return 'The encounter has already ended in defeat.';
  return undefined;
};

export const getCombatActionPresentations = (
  definition: CombatEncounterDefinition,
  state: CombatEncounterState,
  permanentTraitIds: readonly string[]
): CombatActionPresentation[] => {
  const inactive = inactiveReason(state);
  const actions: CombatActionPresentation[] = [
    {
      id: 'strike',
      label: 'Strike',
      description: `Deal ${definition.strikeDamage} damage to the target.`,
      enabled: !inactive,
      reason: inactive,
    },
    {
      id: 'guard',
      label: 'Guard',
      description: `Reduce the next enemy response by ${definition.guardReduction}.`,
      enabled: !inactive,
      reason: inactive,
    },
  ];

  const feedback = definition.feedbackPattern;
  if (!feedback) return actions;

  const hasTraitAccess = hasRequiredPermanentTraits(
    feedback.requiredPermanentTraitIds,
    permanentTraitIds
  );

  if (!hasTraitAccess || state.feedbackDisrupted) {
    return actions;
  }

  actions.push({
    id: 'trace_pattern',
    label: feedback.traceLabel,
    description: feedback.traceDescription,
    enabled: !inactive && !state.patternRead,
    hidden: false,
    reason: inactive ?? (state.patternRead ? 'The feedback pattern is already understood.' : undefined),
  });

  if (state.patternRead) {
    const correctPhase = state.enemyPhase === feedback.disruptPhase;
    actions.push({
      id: 'disrupt_feedback',
      label: feedback.disruptLabel,
      description: feedback.disruptDescription,
      enabled: !inactive && correctPhase,
      hidden: false,
      reason:
        inactive ??
        (correctPhase
          ? undefined
          : `The feedback can only be disrupted during the ${feedback.disruptPhase} phase.`),
    });
  }

  return actions;
};

const applyEnemyResponse = (
  definition: CombatEncounterDefinition,
  state: CombatEncounterState,
  guarding: boolean
): CombatEncounterState => {
  if (state.status !== 'active') return state;

  const phase = definition.phases[state.enemyPhase];
  const incomingDamage = Math.max(
    0,
    phase.incomingDamage - (guarding ? definition.guardReduction : 0)
  );
  const playerHealth = Math.max(0, state.playerHealth - incomingDamage);

  let enemyHealth = state.enemyHealth;
  if (
    state.enemyPhase === 'release' &&
    !state.feedbackDisrupted &&
    typeof phase.regeneration === 'number'
  ) {
    enemyHealth = Math.min(
      definition.enemyMaxHealth,
      enemyHealth + Math.max(0, phase.regeneration)
    );
  }

  return {
    ...state,
    playerHealth,
    enemyHealth,
    enemyPhase: phase.nextPhase,
    status: playerHealth <= 0 ? 'defeat' : state.status,
  };
};

const rejected = (
  state: CombatEncounterState,
  message: string
): CombatActionResult => ({
  ok: false,
  state,
  message,
  victoryJustOccurred: false,
  defeatJustOccurred: false,
});

export const performCombatAction = (
  definition: CombatEncounterDefinition,
  state: CombatEncounterState,
  actionId: CombatActionId,
  permanentTraitIds: readonly string[]
): CombatActionResult => {
  const inactive = inactiveReason(state);
  if (inactive) return rejected(state, inactive);

  const feedback = definition.feedbackPattern;

  if (actionId === 'trace_pattern' || actionId === 'disrupt_feedback') {
    if (!feedback) {
      return rejected(state, 'This encounter has no readable feedback pattern.');
    }

    const missingTraitIds = getMissingPermanentTraitIds(
      feedback.requiredPermanentTraitIds,
      permanentTraitIds
    );
    if (missingTraitIds.length > 0) {
      return rejected(
        state,
        `Action requires permanent Trait${missingTraitIds.length === 1 ? '' : 's'}: ${missingTraitIds.join(', ')}.`
      );
    }
  }

  if (actionId === 'trace_pattern') {
    if (state.feedbackDisrupted) {
      return rejected(state, 'The feedback loop has already been disrupted.');
    }
    if (state.patternRead) {
      return rejected(state, 'The feedback pattern is already understood.');
    }

    const beforeStatus = state.status;
    const next = applyEnemyResponse(
      definition,
      {
        ...state,
        round: state.round + 1,
        patternRead: true,
      },
      false
    );

    return {
      ok: true,
      state: next,
      message: 'You spend the exchange tracing how the Echo cycles from stability into pressure and release.',
      victoryJustOccurred: beforeStatus !== 'victory' && next.status === 'victory',
      defeatJustOccurred: beforeStatus !== 'defeat' && next.status === 'defeat',
    };
  }

  if (actionId === 'disrupt_feedback') {
    if (!feedback) {
      return rejected(state, 'This encounter has no disruptable feedback pattern.');
    }
    if (state.feedbackDisrupted) {
      return rejected(state, 'The feedback loop has already been disrupted.');
    }
    if (!state.patternRead) {
      return rejected(state, 'Read the feedback pattern before trying to disrupt it.');
    }
    if (state.enemyPhase !== feedback.disruptPhase) {
      return rejected(
        state,
        `The feedback can only be disrupted during the ${feedback.disruptPhase} phase.`
      );
    }

    const beforeStatus = state.status;
    const next = applyEnemyResponse(
      definition,
      {
        ...state,
        round: state.round + 1,
        feedbackDisrupted: true,
      },
      false
    );

    return {
      ok: true,
      state: next,
      message: 'You interrupt the Echo at release. The manifestation can no longer rebuild itself through the feedback loop.',
      victoryJustOccurred: beforeStatus !== 'victory' && next.status === 'victory',
      defeatJustOccurred: beforeStatus !== 'defeat' && next.status === 'defeat',
    };
  }

  if (actionId === 'guard') {
    const beforeStatus = state.status;
    const next = applyEnemyResponse(
      definition,
      {
        ...state,
        round: state.round + 1,
      },
      true
    );

    return {
      ok: true,
      state: next,
      message: 'You give up offense to blunt the Echo\'s next response.',
      victoryJustOccurred: beforeStatus !== 'victory' && next.status === 'victory',
      defeatJustOccurred: beforeStatus !== 'defeat' && next.status === 'defeat',
    };
  }

  if (actionId === 'strike') {
    const enemyHealth = Math.max(0, state.enemyHealth - definition.strikeDamage);
    const afterStrike: CombatEncounterState = {
      ...state,
      round: state.round + 1,
      enemyHealth,
      status: enemyHealth <= 0 ? 'victory' : state.status,
    };

    if (afterStrike.status === 'victory') {
      return {
        ok: true,
        state: afterStrike,
        message: 'Your strike breaks the remaining manifestation.',
        victoryJustOccurred: true,
        defeatJustOccurred: false,
      };
    }

    const next = applyEnemyResponse(definition, afterStrike, false);
    return {
      ok: true,
      state: next,
      message: 'You strike the Echo and absorb its answering pressure.',
      victoryJustOccurred: false,
      defeatJustOccurred: next.status === 'defeat',
    };
  }

  return rejected(state, `Unknown combat action: ${String(actionId)}`);
};
