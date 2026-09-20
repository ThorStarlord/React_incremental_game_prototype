import type { RootState } from '../../../app/store';
import type {
  CampaignStatus,
  CounterphasePlan,
  LatticeIntegrity,
  NetworkPosture,
  RegionalWorldState,
  TelluricEchoOutcome,
  TradeFlow,
  WatchPresence,
  WorldStateRequirement,
} from './WorldStateTypes';

export type WorldStateRegions = Record<string, RegionalWorldState>;

export const selectWorldStateRegions = (state: RootState): WorldStateRegions =>
  (state as RootState & {
    worldState?: { regions?: WorldStateRegions };
  }).worldState?.regions ?? {};

export const getWatchPresenceFromRegions = (
  regions: WorldStateRegions,
  regionId: string
): WatchPresence => {
  const value = regions[regionId]?.watchPresence;
  return value === 'heavy' ? 'heavy' : 'normal';
};

export const getTradeFlowFromRegions = (
  regions: WorldStateRegions,
  regionId: string
): TradeFlow => {
  const value = regions[regionId]?.tradeFlow;
  return value === 'strong' ? 'strong' : 'normal';
};

export const selectWatchPresence = (
  state: RootState,
  regionId: string
): WatchPresence =>
  getWatchPresenceFromRegions(selectWorldStateRegions(state), regionId);

export const selectTradeFlow = (
  state: RootState,
  regionId: string
): TradeFlow =>
  getTradeFlowFromRegions(selectWorldStateRegions(state), regionId);

export const getLatticeIntegrityFromRegions = (
  regions: WorldStateRegions,
  regionId: string
): LatticeIntegrity | undefined => {
  const value = regions[regionId]?.latticeIntegrity;
  return value === 'strained' || value === 'stabilized' ? value : undefined;
};

export const selectLatticeIntegrity = (
  state: RootState,
  regionId: string
): LatticeIntegrity | undefined =>
  getLatticeIntegrityFromRegions(selectWorldStateRegions(state), regionId);

export const getNetworkPostureFromRegions = (
  regions: WorldStateRegions,
  regionId: string
): NetworkPosture | undefined => {
  const value = regions[regionId]?.networkPosture;
  return (
    value === 'distributed' ||
    value === 'structural' ||
    value === 'fortified' ||
    value === 'diagnostic'
  ) ? value : undefined;
};

export const selectNetworkPosture = (
  state: RootState,
  regionId: string
): NetworkPosture | undefined =>
  getNetworkPostureFromRegions(selectWorldStateRegions(state), regionId);

export const getCounterphasePlanFromRegions = (
  regions: WorldStateRegions,
  regionId: string
): CounterphasePlan | undefined => {
  const value = regions[regionId]?.counterphasePlan;
  return (
    value === 'distributed' ||
    value === 'structural' ||
    value === 'fortified' ||
    value === 'diagnostic'
  ) ? value : undefined;
};

export const selectCounterphasePlan = (
  state: RootState,
  regionId: string
): CounterphasePlan | undefined =>
  getCounterphasePlanFromRegions(selectWorldStateRegions(state), regionId);

export const getCampaignStatusFromRegions = (
  regions: WorldStateRegions,
  regionId: string
): CampaignStatus | undefined =>
  regions[regionId]?.campaignStatus === 'complete' ? 'complete' : undefined;

export const selectCampaignStatus = (
  state: RootState,
  regionId: string
): CampaignStatus | undefined =>
  getCampaignStatusFromRegions(selectWorldStateRegions(state), regionId);

export const getTelluricEchoOutcomeFromRegions = (
  regions: WorldStateRegions,
  regionId: string
): TelluricEchoOutcome | undefined => {
  const value = regions[regionId]?.telluricEchoOutcome;
  return (
    value === 'distributed_dissipation' ||
    value === 'structural_redirection' ||
    value === 'diagnostic_disruption' ||
    value === 'fortified_containment'
  ) ? value : undefined;
};

export const selectTelluricEchoOutcome = (
  state: RootState,
  regionId: string
): TelluricEchoOutcome | undefined =>
  getTelluricEchoOutcomeFromRegions(selectWorldStateRegions(state), regionId);

export const doesWorldStateRequirementPass = (
  regions: WorldStateRegions,
  requirement: unknown
): boolean => {
  if (!requirement || typeof requirement !== 'object') return false;

  const candidate = requirement as Partial<WorldStateRequirement> & {
    regionId?: unknown;
    field?: unknown;
    equals?: unknown;
  };
  if (typeof candidate.regionId !== 'string' || candidate.regionId.length === 0) {
    return false;
  }

  if (candidate.field === 'watchPresence') {
    if (candidate.equals !== 'normal' && candidate.equals !== 'heavy') return false;
    return getWatchPresenceFromRegions(regions, candidate.regionId) === candidate.equals;
  }

  if (candidate.field === 'tradeFlow') {
    if (candidate.equals !== 'normal' && candidate.equals !== 'strong') return false;
    return getTradeFlowFromRegions(regions, candidate.regionId) === candidate.equals;
  }

  if (candidate.field === 'latticeIntegrity') {
    if (candidate.equals !== 'strained' && candidate.equals !== 'stabilized') return false;
    return getLatticeIntegrityFromRegions(regions, candidate.regionId) === candidate.equals;
  }

  if (candidate.field === 'networkPosture') {
    if (
      candidate.equals !== 'distributed' &&
      candidate.equals !== 'structural' &&
      candidate.equals !== 'fortified' &&
      candidate.equals !== 'diagnostic'
    ) {
      return false;
    }
    return getNetworkPostureFromRegions(regions, candidate.regionId) === candidate.equals;
  }

  if (candidate.field === 'counterphasePlan') {
    if (
      candidate.equals !== 'distributed' &&
      candidate.equals !== 'structural' &&
      candidate.equals !== 'fortified' &&
      candidate.equals !== 'diagnostic'
    ) {
      return false;
    }
    return getCounterphasePlanFromRegions(regions, candidate.regionId) === candidate.equals;
  }

  if (candidate.field === 'campaignStatus') {
    if (candidate.equals !== 'complete') return false;
    return getCampaignStatusFromRegions(regions, candidate.regionId) === candidate.equals;
  }

  if (candidate.field === 'telluricEchoOutcome') {
    if (
      candidate.equals !== 'distributed_dissipation' &&
      candidate.equals !== 'structural_redirection' &&
      candidate.equals !== 'diagnostic_disruption' &&
      candidate.equals !== 'fortified_containment'
    ) {
      return false;
    }
    return getTelluricEchoOutcomeFromRegions(regions, candidate.regionId) === candidate.equals;
  }

  return false;
};
