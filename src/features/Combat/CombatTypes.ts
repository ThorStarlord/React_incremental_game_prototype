export type CombatEncounterStatus = 'active' | 'victory' | 'defeat';

export type CombatEnemyPhase = 'stable' | 'building' | 'release';

export type CombatActionId =
  | 'strike'
  | 'guard'
  | 'trace_pattern'
  | 'disrupt_feedback';

export interface CombatEnemyPhaseDefinition {
  incomingDamage: number;
  nextPhase: CombatEnemyPhase;
  regeneration?: number;
}

export interface CombatFeedbackPatternDefinition {
  requiredPermanentTraitIds: string[];
  traceLabel: string;
  traceDescription: string;
  disruptLabel: string;
  disruptDescription: string;
  disruptPhase: CombatEnemyPhase;
}

export interface CombatEncounterDefinition {
  id: string;
  targetId: string;
  name: string;
  description: string;
  playerMaxHealth: number;
  enemyMaxHealth: number;
  strikeDamage: number;
  guardReduction: number;
  phases: Record<CombatEnemyPhase, CombatEnemyPhaseDefinition>;
  feedbackPattern?: CombatFeedbackPatternDefinition;
}

export interface CombatEncounterState {
  encounterId: string;
  targetId: string;
  status: CombatEncounterStatus;
  round: number;
  playerHealth: number;
  enemyHealth: number;
  enemyPhase: CombatEnemyPhase;
  patternRead: boolean;
  feedbackDisrupted: boolean;
}

export interface CombatActionPresentation {
  id: CombatActionId;
  label: string;
  description: string;
  enabled: boolean;
  hidden?: boolean;
  reason?: string;
}

export interface CombatActionResult {
  ok: boolean;
  state: CombatEncounterState;
  message: string;
  victoryJustOccurred: boolean;
  defeatJustOccurred: boolean;
}
