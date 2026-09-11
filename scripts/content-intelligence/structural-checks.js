function checkStructuralConsistency(model) {
  const issues = [];
  const emit = (code, message, meta = {}) => issues.push({ severity: 'error', code, message, ...meta });

  for (const [source, edges] of model.outgoing.entries()) {
    const requiredFacts = new Set(edges.filter(e => e.relation === 'requires-fact').map(e => e.to));
    const forbiddenFacts = new Set(edges.filter(e => e.relation === 'forbids-fact').map(e => e.to));
    for (const fact of requiredFacts) {
      if (forbiddenFacts.has(fact)) {
        emit('CONTENT_CONTRADICTORY_FACT_REQUIREMENT', `${source} both requires and forbids ${fact}`, { entity: source, target: fact });
      }
    }

    const factions = new Map();
    for (const edge of edges.filter(e => e.relation === 'requires-faction')) {
      const current = factions.get(edge.to) || { mins: [], maxes: [] };
      if (typeof edge.min === 'number') current.mins.push(edge.min);
      if (typeof edge.max === 'number') current.maxes.push(edge.max);
      factions.set(edge.to, current);
    }
    for (const [target, bounds] of factions.entries()) {
      const min = bounds.mins.length ? Math.max(...bounds.mins) : -Infinity;
      const max = bounds.maxes.length ? Math.min(...bounds.maxes) : Infinity;
      if (min > max) {
        emit('CONTENT_CONTRADICTORY_FACTION_REQUIREMENT', `${source} requires impossible ${target} reputation range ${min}..${max}`, { entity: source, target });
      }
    }

    const worldValues = new Map();
    for (const edge of edges.filter(e => e.relation === 'requires-world-state')) {
      const key = `${edge.regionId}.${edge.field}`;
      const values = worldValues.get(key) || new Set();
      values.add(JSON.stringify(edge.equals));
      worldValues.set(key, values);
    }
    for (const [key, values] of worldValues.entries()) {
      if (values.size > 1) {
        emit('CONTENT_CONTRADICTORY_WORLD_STATE_REQUIREMENT', `${source} requires multiple simultaneous values for ${key}: ${[...values].join(', ')}`, { entity: source, field: key });
      }
    }
  }

  const prerequisiteRelations = new Set([
    'requires-quest',
    'requires-trait',
    'requires-experience',
    'requires-routine',
    'requires-fact',
    'requires-faction',
    'requires-world-state',
    'requires-location',
  ]);
  const graph = new Map();
  for (const edge of model.edges) {
    if (!prerequisiteRelations.has(edge.relation) || edge.optionalAlternative) continue;
    if (!graph.has(edge.from)) graph.set(edge.from, []);
    graph.get(edge.from).push(edge.to);
  }

  const visited = new Set();
  const active = new Set();
  const stack = [];
  const emittedCycles = new Set();
  function visit(key) {
    if (active.has(key)) {
      const start = stack.indexOf(key);
      const cycle = [...stack.slice(start), key];
      const signature = [...new Set(cycle)].sort().join('|');
      if (!emittedCycles.has(signature)) {
        emittedCycles.add(signature);
        emit('CONTENT_PREREQUISITE_CYCLE', `Blocking prerequisite cycle: ${cycle.join(' -> ')}`, { entity: key, cycle });
      }
      return;
    }
    if (visited.has(key)) return;
    visited.add(key);
    active.add(key);
    stack.push(key);
    for (const target of graph.get(key) || []) visit(target);
    stack.pop();
    active.delete(key);
  }
  for (const key of graph.keys()) visit(key);

  return issues;
}

module.exports = { checkStructuralConsistency };