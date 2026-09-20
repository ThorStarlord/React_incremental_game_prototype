export type WatchPresence = 'normal' | 'heavy';
export type TradeFlow = 'normal' | 'strong';
export type LatticeIntegrity = 'strained' | 'stabilized';
export type NetworkPosture = 'distributed' | 'structural' | 'fortified' | 'diagnostic';
export type CounterphasePlan = 'distributed' | 'structural' | 'fortified' | 'diagnostic';

export interface RegionalWorldState {
  watchPresence?: WatchPresence;
  tradeFlow?: TradeFlow;
  latticeIntegrity?: LatticeIntegrity;
  networkPosture?: NetworkPosture;
  counterphasePlan?: CounterphasePlan;
}

export interface WorldState {
  regions: Record<string, RegionalWorldState>;
}

export type WorldStateMutation =
  | {
      regionId: string;
      field: 'watchPresence';
      value: WatchPresence;
    }
  | {
      regionId: string;
      field: 'tradeFlow';
      value: TradeFlow;
    }
  | {
      regionId: string;
      field: 'latticeIntegrity';
      value: LatticeIntegrity;
    }
  | {
      regionId: string;
      field: 'networkPosture';
      value: NetworkPosture;
    }
  | {
      regionId: string;
      field: 'counterphasePlan';
      value: CounterphasePlan;
    };

export type WorldStateRequirement =
  | {
      regionId: string;
      field: 'watchPresence';
      equals: WatchPresence;
    }
  | {
      regionId: string;
      field: 'tradeFlow';
      equals: TradeFlow;
    }
  | {
      regionId: string;
      field: 'latticeIntegrity';
      equals: LatticeIntegrity;
    }
  | {
      regionId: string;
      field: 'networkPosture';
      equals: NetworkPosture;
    }
  | {
      regionId: string;
      field: 'counterphasePlan';
      equals: CounterphasePlan;
    };
