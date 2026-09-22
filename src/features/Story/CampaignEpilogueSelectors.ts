import type { RootState } from '../../app/store';
import { selectFactionReputation } from '../Factions/state/FactionSelectors';
import {
  selectCampaignStatus,
  selectCounterphasePlan,
  selectLatticeIntegrity,
  selectNetworkPosture,
  selectTelluricEchoOutcome,
} from '../WorldState/state/WorldStateSelectors';
import type {
  CounterphasePlan,
  LatticeIntegrity,
  NetworkPosture,
  TelluricEchoOutcome,
} from '../WorldState/state/WorldStateTypes';

export interface CampaignEpilogueProjection {
  plan: CounterphasePlan;
  title: string;
  lyra: string;
  elara: string | null;
  secondaryAnchor: string | null;
  institution: string;
  world: string;
  build: string;
  delegation: string | null;
}

const PLAN_LABELS: Record<CounterphasePlan, string> = {
  distributed: 'Distributed Dissipation',
  structural: 'Structural Redirection',
  fortified: 'Fortified Containment',
  diagnostic: 'Diagnostic Disruption',
};

const LATTICE_LABELS: Record<LatticeIntegrity, string> = {
  strained: 'Strained',
  stabilized: 'Stabilized',
};

const NETWORK_LABELS: Record<NetworkPosture, string> = {
  distributed: 'Distributed',
  structural: 'Structural',
  fortified: 'Fortified',
  diagnostic: 'Diagnostic',
};

const OUTCOME_LABELS: Record<TelluricEchoOutcome, string> = {
  distributed_dissipation: 'Distributed Dissipation',
  structural_redirection: 'Structural Redirection',
  diagnostic_disruption: 'Diagnostic Disruption',
  fortified_containment: 'Fortified Containment',
};

const hasExperience = (state: RootState, experienceId: string): boolean =>
  Boolean(state.relationships.experiencesById[experienceId]);

const masteredRoutineNames = (state: RootState): string[] => {
  const familiarity = state.player.routineFamiliarity ?? {};
  const labels: Record<string, string> = {
    forge_assistance: 'Forge Assistance',
    resonance_calibration: 'Resonance Calibration',
    archive_verification: 'Archive Verification',
  };
  return Object.keys(familiarity)
    .filter(id => Boolean(labels[id]))
    .map(id => labels[id]);
};

export const selectCampaignEpilogueProjection = (
  state: RootState
): CampaignEpilogueProjection | null => {
  if (selectCampaignStatus(state, 'location_whispering_woods') !== 'complete') {
    return null;
  }

  const plan = selectCounterphasePlan(state, 'location_merchant_district');
  const outcome = selectTelluricEchoOutcome(state, 'location_whispering_woods');
  if (!plan || !outcome) return null;

  const aftermathMemory =
    state.relationships.memoriesById[`lyra_memory_gc10_${plan}_aftermath`];
  if (!aftermathMemory?.playerVisible) return null;

  const elara = (
    hasExperience(state, 'elara_gc08_exp_network_diagnosis') ||
    hasExperience(state, 'elara_exp_independent_verification')
  )
    ? 'Elara’s independent-verification method carried into the ending: the counterphase was treated as evidence to test, not a doctrine to protect.'
    : null;

  const gronkEvidence = [
    'gronk_gc08_exp_counterphase_briefed',
    'gronk_gc08_exp_structural_preparation',
    'gronk_gc06_exp_structural_steward',
    'gronk_exp_aftermath_quiet_reroute',
  ].some(id => hasExperience(state, id));
  const valeriusEvidence = [
    'valerius_gc08_exp_watch_mobilized',
    'valerius_gc06_exp_surface_containment',
    'valerius_exp_aftermath_public_crackdown',
  ].some(id => hasExperience(state, id));

  const secondaryAnchor = gronkEvidence
    ? 'Gronk’s recorded history remains part of the aftermath: constraint-first craft judgment helped define what the network could actually carry.'
    : valeriusEvidence
      ? 'Valerius’s recorded history remains part of the aftermath: institutional response mattered independently from personal trust.'
      : null;

  const watchStanding = selectFactionReputation(state, 'City Watch');
  const latticeIntegrity = selectLatticeIntegrity(
    state,
    'location_merchant_district'
  );
  const networkPosture = selectNetworkPosture(
    state,
    'location_merchant_district'
  );

  const permanent = new Set(state.player.permanentTraits);
  let build: string;
  if (plan === 'structural') {
    const complete =
      permanent.has('WillowsWisdom') && permanent.has('ConstraintSense');
    build = complete
      ? 'Build contribution: Willow’s Wisdom and Constraint Sense formed the Structural Steward pair that carried the final redirection.'
      : 'Build contribution: the structural plan is recorded, but its expected two-Trait provenance is incomplete in the loaded state.';
  } else if (plan === 'diagnostic') {
    const complete =
      permanent.has('ScholarlyInsight') &&
      permanent.has('AdversarialCalibration');
    build = complete
      ? 'Build contribution: Scholarly Insight and Adversarial Calibration formed the Countermodeler pair that disrupted the Echo’s predicted phase.'
      : 'Build contribution: the diagnostic plan is recorded, but its expected two-Trait provenance is incomplete in the loaded state.';
  } else if (plan === 'fortified') {
    build =
      'Build contribution: the fortified route used verified counterphase preparation with institutional logistics; no optional two-Trait pair was mandatory.';
  } else {
    build =
      'Build contribution: the distributed route remained viable without requiring every optional relationship-derived capability.';
  }

  const routines = masteredRoutineNames(state);
  const delegatedCopies = Object.values(state.copy.copies).filter(copy =>
    copy.role && copy.role !== 'none'
  ).length;
  const delegation = routines.length > 0
    ? `Delegation aftermath: ${routines.join(', ')} remained personally mastered and safely delegable; ${delegatedCopies} Copy${delegatedCopies === 1 ? '' : 's'} held an assigned role. No delegated routine chose the finale.`
    : null;

  return {
    plan,
    title: PLAN_LABELS[plan],
    lyra: aftermathMemory.currentInterpretation ?? aftermathMemory.summary,
    elara,
    secondaryAnchor,
    institution: `Institutional aftermath: City Watch standing is ${watchStanding}.`,
    world: `World aftermath: Lattice integrity: ${latticeIntegrity ? LATTICE_LABELS[latticeIntegrity] : 'Unknown'}. Network posture: ${networkPosture ? NETWORK_LABELS[networkPosture] : 'Unknown'}. Counterphase plan: ${PLAN_LABELS[plan]}. Telluric Echo outcome: ${OUTCOME_LABELS[outcome]}.`,
    build,
    delegation,
  };
};
