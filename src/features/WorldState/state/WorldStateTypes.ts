export type WatchPresence = 'normal' | 'heavy';
export type TradeFlow = 'normal' | 'strong';

export interface RegionalWorldState {
  watchPresence?: WatchPresence;
  tradeFlow?: TradeFlow;
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
    };
