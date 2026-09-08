export interface FactionState {
  /** Canonical institutional standing keyed by the existing authored faction id. */
  reputationByFactionId: Record<string, number>;
}

export interface FactionReputationChange {
  factionId: string;
  amount: number;
}
