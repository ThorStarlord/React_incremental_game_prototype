import { useEffect, useRef, useState } from 'react';

export interface StatDiff {
  key: string;
  current: number;
  previous: number;
  delta: number;
  direction: 'up' | 'down' | 'none';
}

/**
 * Hook: useStatDiffs
 * Tracks deltas between successive stat objects (flat number maps) and returns annotated diffs.
 * Only flags a direction if delta != 0. Useful for transient highlighting.
 */
export function useStatDiffs<T extends Record<string, number | undefined>>(stats: T) {
  const prevRef = useRef<Record<string, number>>({});
  const [diffs, setDiffs] = useState<StatDiff[]>([]);

  useEffect(() => {
    const prev = prevRef.current;
    const nextDiffs: StatDiff[] = [];
    for (const [k, vRaw] of Object.entries(stats)) {
      if (typeof vRaw !== 'number') continue;
      const prevVal = prev[k] ?? vRaw;
      const delta = vRaw - prevVal;
      nextDiffs.push({
        key: k,
        current: vRaw,
        previous: prevVal,
        delta,
        direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'none'
      });
      // Incrementally update prevRef.current
      prev[k] = vRaw;
    }
    // Remove keys from prevRef.current that are no longer present or not a number
    for (const k of Object.keys(prev)) {
      if (!(k in stats) || typeof stats[k] !== 'number') {
        delete prev[k];
      }
    }
    setDiffs(nextDiffs);
  }, [stats]);

  return diffs;
}

/** Helper to get a specific stat diff quickly */
export function useStatDiff(key: string, diffs: StatDiff[]) {
  return diffs.find(d => d.key === key);
}
