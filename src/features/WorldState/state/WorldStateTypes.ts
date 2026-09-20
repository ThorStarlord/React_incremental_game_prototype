export type WatchPresence = 'normal' | 'heavy';
export type TradeFlow = 'normal' | 'strong';
export type LatticeIntegrity = 'strained' | 'stabilized';

export interface RegionalWorldState {
  watchPresence?: WatchPresence;
  tradeFlow?: TradeFlow;
  latticeIntegrity?: LatticeIntegrity;
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
    };
