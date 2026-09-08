import type { RootState } from '../../../app/store';
import type {
  RegionalWorldState,
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

  return false;
};
