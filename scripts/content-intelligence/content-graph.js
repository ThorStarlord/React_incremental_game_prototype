const fs = require('fs');
const path = require('path');

const STRICT_UNIQUE_TYPES = new Set([
  'npc',
  'dialogue',
  'quest',
  'trait',
  'experience',
  'memory',
]);

function nodeKey(type, id) {
  return `${type}:${id}`;
}

function walkJsonFiles(directory) {
  const result = [];
  if (!fs.existsSync(directory)) return result;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walkJsonFiles(absolute));
    else if (entry.isFile() && entry.name.endsWith('.json')) result.push(absolute);
  }
  return result.sort();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function createModel(root, options = {}) {
  const dataRoot = options.dataRoot || path.join(root, 'public', 'data');
  const knownContractsPath = options.knownContractsPath || path.join(
    root,
    'scripts',
    'content-intelligence',
    'known-contracts.json'
  );
  const knownContracts = options.knownContracts || readJson(knownContractsPath);

  const nodes = new Map();
  const edges = [];
  const issues = [];
  const warnings = [];
  const factionMutations = [];
  const entrypointDialogues = new Set();

  function issue(code, message, meta = {}) {
    issues.push({ severity: 'error', code, message, ...meta });
  }

  function warn(code, message, meta = {}) {
    warnings.push({ severity: 'warning', code, message, ...meta });
  }

  function addNode(type, id, source, details = {}) {
    if (typeof id !== 'string' || id.length === 0) return null;
    const key = nodeKey(type, id);
    const existing = nodes.get(key);
    if (existing) {
      if (STRICT_UNIQUE_TYPES.has(type) && existing.source !== source) {
        issue('DUPLICATE_ID', `${key} is defined in both ${existing.source} and ${source}`, {
          entity: key,
          source,
        });
      }
      Object.assign(existing, details);
      return existing;
    }
    const node = { key, type, id, source, ...details };
    nodes.set(key, node);
    return node;
  }

  function addEdge(fromType, fromId, toType, toId, relation, meta = {}) {
    if (!fromId || !toId) return;
    edges.push({
      from: nodeKey(fromType, fromId),
      to: nodeKey(toType, toId),
      relation,
      ...meta,
    });
  }

  for (const [routineId, routine] of Object.entries(knownContracts.routines || {})) {
    addNode('routine', routineId, 'known-contracts', {
      foundational: true,
      label: routine.label || routineId,
      producerLabel: routine.producer || 'known runtime contract',
    });
  }
  for (const locationId of knownContracts.locations || []) {
    addNode('location', locationId, 'known-contracts', { foundational: true });
  }
  for (const factionId of knownContracts.factions || []) {
    addNode('faction', factionId, 'known-contracts', { foundational: true });
  }

  const files = walkJsonFiles(dataRoot);
  const parsed = new Map();
  for (const filePath of files) {
    const relative = path.relative(root, filePath).replace(/\\/g, '/');
    try {
      parsed.set(relative, readJson(filePath));
    } catch (error) {
      issue('INVALID_JSON', `${relative}: ${error.message}`, { source: relative });
    }
  }

  function validateKeyId(type, key, value, source) {
    if (value && typeof value.id === 'string' && value.id !== key) {
      issue('KEY_ID_MISMATCH', `${type}:${key} has id=${value.id} in ${source}`, {
        entity: nodeKey(type, key),
        source,
      });
    }
  }

  function scanDialogues(dialogues, source) {
    if (!dialogues || typeof dialogues !== 'object' || Array.isArray(dialogues)) return;
    for (const [dialogueId, node] of Object.entries(dialogues)) {
      if (!node || typeof node !== 'object') continue;
      validateKeyId('dialogue', dialogueId, node, source);
      addNode('dialogue', dialogueId, source, {
        title: node.title || dialogueId,
        repeatable: node.repeatable !== false,
      });

      if (typeof node.npcId === 'string') {
        addEdge('dialogue', dialogueId, 'npc', node.npcId, 'owned-by-npc');
      }

      for (const experienceId of node.requiredExperienceIds || []) {
        addEdge('dialogue', dialogueId, 'experience', experienceId, 'requires-experience');
      }
      for (const experienceId of node.anyOfExperienceIds || []) {
        addEdge('dialogue', dialogueId, 'experience', experienceId, 'requires-any-experience', {
          optionalAlternative: true,
        });
      }
      for (const routineId of node.requiredRoutineFamiliarityIds || []) {
        addEdge('dialogue', dialogueId, 'routine', routineId, 'requires-routine');
      }
      for (const factId of node.requiredKnowledgeFactIds || []) {
        addEdge('dialogue', dialogueId, 'fact', factId, 'requires-fact');
      }
      for (const factId of node.forbiddenKnowledgeFactIds || []) {
        addEdge('dialogue', dialogueId, 'fact', factId, 'forbids-fact', { nonBlocking: true });
      }
      for (const requirement of node.requiredFactionReputation || []) {
        if (!requirement || typeof requirement.factionId !== 'string') continue;
        addEdge('dialogue', dialogueId, 'faction', requirement.factionId, 'requires-faction', {
          min: requirement.min,
          max: requirement.max,
        });
      }
      for (const requirement of node.requiredWorldState || []) {
        if (!requirement || typeof requirement.regionId !== 'string' || typeof requirement.field !== 'string') {
          continue;
        }
        const conditionId = `${requirement.regionId}.${requirement.field}=${String(requirement.equals)}`;
        addEdge('dialogue', dialogueId, 'world-condition', conditionId, 'requires-world-state', {
          regionId: requirement.regionId,
          field: requirement.field,
          equals: requirement.equals,
        });
        addEdge('dialogue', dialogueId, 'location', requirement.regionId, 'references-world-region', {
          nonBlocking: true,
        });

        const allowedValues = knownContracts.worldState?.[requirement.field];
        if (!Array.isArray(allowedValues)) {
          issue('UNKNOWN_WORLD_STATE_FIELD', `${dialogueId} requires unknown world-state field ${requirement.field}`, {
            entity: nodeKey('dialogue', dialogueId),
            source,
          });
        } else if (!allowedValues.includes(requirement.equals)) {
          issue('INVALID_WORLD_STATE_VALUE', `${dialogueId} requires invalid ${requirement.field}=${requirement.equals}`, {
            entity: nodeKey('dialogue', dialogueId),
            source,
          });
        }
      }

      if (node.next && typeof node.next === 'object') {
        for (const [responseId, nextId] of Object.entries(node.next)) {
          if (typeof nextId === 'string' && nextId.length > 0) {
            addEdge('dialogue', dialogueId, 'dialogue', nextId, 'next-dialogue', { responseId });
          }
        }
      }

      const responses = node.responses && typeof node.responses === 'object'
        ? Object.keys(node.responses)
        : [];
      if (node.repeatable === false && responses.length === 0) {
        warn('ONE_SHOT_WITHOUT_RESPONSE', `${dialogueId} is non-repeatable but has no authored response`, {
          entity: nodeKey('dialogue', dialogueId),
          source,
        });
      }

      for (const effect of Array.isArray(node.effects) ? node.effects : []) {
        if (!effect || typeof effect !== 'object') continue;
        if (effect.type === 'UNLOCK_QUEST' && effect.questId) {
          addEdge('dialogue', dialogueId, 'quest', effect.questId, 'unlocks');
        } else if (effect.type === 'KNOWLEDGE_FACT' && effect.factId) {
          addNode('fact', effect.factId, source, { produced: true });
          addEdge('dialogue', dialogueId, 'fact', effect.factId, 'produces');
        } else if (effect.type === 'FACTION_REPUTATION' && effect.factionId) {
          const amount = Number(effect.value) || 0;
          factionMutations.push({
            source: nodeKey('dialogue', dialogueId),
            factionId: effect.factionId,
            amount,
          });
          addEdge('dialogue', dialogueId, 'faction', effect.factionId, 'changes-faction', { amount });
        } else if (effect.type === 'WORLD_STATE_SET' && effect.regionId && effect.field) {
          const conditionId = `${effect.regionId}.${effect.field}=${String(effect.value)}`;
          addNode('world-condition', conditionId, source, {
            produced: true,
            regionId: effect.regionId,
            field: effect.field,
            value: effect.value,
          });
          addEdge('dialogue', dialogueId, 'world-condition', conditionId, 'produces');
          addEdge('dialogue', dialogueId, 'location', effect.regionId, 'references-world-region', {
            nonBlocking: true,
          });
        } else if (effect.type === 'RELATIONSHIP_EXPERIENCE') {
          if (effect.experienceId) {
            addEdge('dialogue', dialogueId, 'experience', effect.experienceId, 'produces');
          }
          if (effect.experienceIdByResponse && typeof effect.experienceIdByResponse === 'object') {
            for (const [responseId, experienceId] of Object.entries(effect.experienceIdByResponse)) {
              if (typeof experienceId === 'string') {
                addEdge('dialogue', dialogueId, 'experience', experienceId, 'produces', { responseId });
              }
            }
          }
        }
      }
    }
  }

  for (const [relative, data] of parsed.entries()) {
    const basename = path.posix.basename(relative);

    if (basename === 'npcs.json' && data && typeof data === 'object') {
      for (const [npcId, npc] of Object.entries(data)) {
        if (!npc || typeof npc !== 'object') continue;
        validateKeyId('npc', npcId, npc, relative);
        addNode('npc', npcId, relative, { foundational: true, title: npc.name || npcId });
        if (typeof npc.faction === 'string' && npc.faction) {
          addNode('faction', npc.faction, relative, { foundational: true });
          addEdge('npc', npcId, 'faction', npc.faction, 'member-of', { nonBlocking: true });
        }
        for (const dialogueId of npc.availableDialogues || []) {
          if (typeof dialogueId !== 'string') continue;
          entrypointDialogues.add(dialogueId);
          addEdge('npc', npcId, 'dialogue', dialogueId, 'offers-dialogue');
        }
        for (const questId of npc.availableQuests || []) {
          if (typeof questId !== 'string') continue;
          addEdge('npc', npcId, 'quest', questId, 'offers-quest');
        }
      }
    }

    if (basename === 'quests.json' && data && typeof data === 'object') {
      for (const [questId, quest] of Object.entries(data)) {
        if (!quest || typeof quest !== 'object') continue;
        validateKeyId('quest', questId, quest, relative);
        addNode('quest', questId, relative, { title: quest.title || questId });
        if (typeof quest.giver === 'string') {
          addEdge('quest', questId, 'npc', quest.giver, 'given-by');
        }
        for (const prerequisiteId of quest.prerequisites || []) {
          if (typeof prerequisiteId === 'string') {
            addEdge('quest', questId, 'quest', prerequisiteId, 'requires-quest');
          }
        }
        for (const objective of quest.objectives || []) {
          if (typeof objective?.target === 'string' && objective.target.startsWith('location_')) {
            addEdge('quest', questId, 'location', objective.target, 'requires-location');
          }
        }
        for (const option of quest.resolutionOptions || []) {
          if (typeof option?.relationshipExperienceId === 'string') {
            addEdge('quest', questId, 'experience', option.relationshipExperienceId, 'produces', {
              resolutionId: option.id,
            });
          }
          for (const reward of option?.rewards || []) {
            if (reward?.type === 'REPUTATION' && typeof reward.faction === 'string') {
              const amount = Number(reward.value) || 0;
              factionMutations.push({ source: nodeKey('quest', questId), factionId: reward.faction, amount });
              addEdge('quest', questId, 'faction', reward.faction, 'changes-faction', { amount });
            }
          }
        }
        for (const reward of quest.rewards || []) {
          if (reward?.type === 'REPUTATION' && typeof reward.faction === 'string') {
            const amount = Number(reward.value) || 0;
            factionMutations.push({ source: nodeKey('quest', questId), factionId: reward.faction, amount });
            addEdge('quest', questId, 'faction', reward.faction, 'changes-faction', { amount });
          }
        }
      }
    }

    if (basename === 'traits.json' && data && typeof data === 'object') {
      for (const [traitId, trait] of Object.entries(data)) {
        if (!trait || typeof trait !== 'object') continue;
        validateKeyId('trait', traitId, trait, relative);
        addNode('trait', traitId, relative, { foundational: true, title: trait.name || traitId });
        for (const prerequisiteId of trait.requirements?.prerequisiteTraits || []) {
          if (typeof prerequisiteId === 'string') {
            addEdge('trait', traitId, 'trait', prerequisiteId, 'requires-trait');
          }
        }
      }
    }

    if (relative.startsWith('public/data/relationships/') && basename !== 'index.json') {
      for (const [experienceId, experience] of Object.entries(data.experiences || {})) {
        if (!experience || typeof experience !== 'object') continue;
        validateKeyId('experience', experienceId, experience, relative);
        addNode('experience', experienceId, relative, { title: experience.title || experienceId });
        if (typeof experience.primaryTargetId === 'string') {
          addEdge('experience', experienceId, 'npc', experience.primaryTargetId, 'targets-npc');
        }
        for (const participantId of experience.participantIds || []) {
          if (typeof participantId === 'string' && participantId !== 'player') {
            addEdge('experience', experienceId, 'npc', participantId, 'participant', { nonBlocking: true });
          }
        }
        if (typeof experience.sourceType === 'string' && typeof experience.sourceId === 'string') {
          const sourceType = experience.sourceType === 'quest' ? 'quest' : 'dialogue';
          addEdge(sourceType, experience.sourceId, 'experience', experienceId, 'produces');
        }
        for (const traitEffect of experience.traitEffects || []) {
          if (typeof traitEffect?.traitId === 'string') {
            addEdge('experience', experienceId, 'trait', traitEffect.traitId, 'affects-trait');
          }
        }
        if (typeof experience.memoryDefinitionId === 'string') {
          addEdge('experience', experienceId, 'memory', experience.memoryDefinitionId, 'produces');
        }
      }

      for (const [memoryId, memory] of Object.entries(data.memories || {})) {
        if (!memory || typeof memory !== 'object') continue;
        validateKeyId('memory', memoryId, memory, relative);
        addNode('memory', memoryId, relative, { title: memory.title || memoryId });
      }
    }

    if (basename === 'dialogues.json') {
      scanDialogues(data, relative);
    } else if (data && typeof data === 'object' && data.dialogues) {
      scanDialogues(data.dialogues, relative);
      for (const [npcId, dialogueIds] of Object.entries(data.npcDialogueIds || {})) {
        if (!Array.isArray(dialogueIds)) continue;
        for (const dialogueId of dialogueIds) {
          if (typeof dialogueId !== 'string') continue;
          entrypointDialogues.add(dialogueId);
          addEdge('npc', npcId, 'dialogue', dialogueId, 'offers-dialogue');
        }
      }
    }
  }

  for (const dialogueId of entrypointDialogues) {
    const node = nodes.get(nodeKey('dialogue', dialogueId));
    if (node) node.entrypoint = true;
  }

  const allowedWorldState = knownContracts.worldState || {};
  for (const node of nodes.values()) {
    if (node.type !== 'world-condition') continue;
    const allowedValues = allowedWorldState[node.field];
    if (!Array.isArray(allowedValues)) {
      issue('UNKNOWN_WORLD_STATE_FIELD', `${node.key} uses unknown field ${node.field}`, {
        entity: node.key,
        source: node.source,
      });
    } else if (!allowedValues.includes(node.value)) {
      issue('INVALID_WORLD_STATE_VALUE', `${node.key} uses invalid value ${node.value}`, {
        entity: node.key,
        source: node.source,
      });
    }
  }

  for (const edge of edges) {
    if (edge.nonBlocking) continue;
    if (!nodes.has(edge.from)) {
      issue('MISSING_SOURCE_ENTITY', `${edge.relation} starts from missing ${edge.from}`, {
        entity: edge.from,
      });
    }
    if (!nodes.has(edge.to)) {
      issue('DANGLING_REFERENCE', `${edge.from} ${edge.relation} missing ${edge.to}`, {
        entity: edge.from,
        target: edge.to,
      });
    }
  }

  const incoming = new Map();
  const outgoing = new Map();
  for (const edge of edges) {
    if (!incoming.has(edge.to)) incoming.set(edge.to, []);
    incoming.get(edge.to).push(edge);
    if (!outgoing.has(edge.from)) outgoing.set(edge.from, []);
    outgoing.get(edge.from).push(edge);
  }

  for (const node of nodes.values()) {
    if (node.type === 'experience') {
      const producers = (incoming.get(node.key) || []).filter(edge => edge.relation === 'produces');
      if (producers.length === 0) {
        warn('ORPHAN_EXPERIENCE', `${node.key} has no authored producer`, {
          entity: node.key,
          source: node.source,
        });
      }
    }
    if (node.type === 'memory') {
      const producers = (incoming.get(node.key) || []).filter(edge => edge.relation === 'produces');
      if (producers.length === 0) {
        warn('ORPHAN_MEMORY', `${node.key} has no authored producing experience`, {
          entity: node.key,
          source: node.source,
        });
      }
    }
    if (node.type === 'dialogue') {
      const offered = Boolean(node.entrypoint);
      const continuation = (incoming.get(node.key) || []).some(edge => edge.relation === 'next-dialogue');
      if (!offered && !continuation) {
        warn('UNROUTED_DIALOGUE', `${node.key} is neither offered by an NPC nor reached by another dialogue`, {
          entity: node.key,
          source: node.source,
        });
      }
    }
  }

  return {
    root,
    knownContracts,
    nodes,
    edges,
    incoming,
    outgoing,
    issues,
    warnings,
    factionMutations,
    entrypointDialogues,
    files: Array.from(parsed.keys()),
  };
}

function blockingPrerequisiteEdges(model, key) {
  return (model.outgoing.get(key) || []).filter(edge =>
    edge.relation.startsWith('requires-') && !edge.optionalAlternative
  );
}

function alternativeExperienceEdges(model, key) {
  return (model.outgoing.get(key) || []).filter(edge => edge.relation === 'requires-any-experience');
}

function producersFor(model, key) {
  return (model.incoming.get(key) || []).filter(edge =>
    edge.relation === 'produces' || edge.relation === 'unlocks' || edge.relation === 'offers-quest'
  );
}

function isFactionRequirementPotentiallySatisfiable(model, edge, reachabilityFn) {
  if (!model.nodes.has(edge.to)) return false;
  const factionId = model.nodes.get(edge.to).id;
  const candidates = model.factionMutations.filter(mutation => mutation.factionId === factionId);
  if (typeof edge.min === 'number' && edge.min > 0) {
    return candidates.some(mutation => mutation.amount > 0 && reachabilityFn(mutation.source));
  }
  if (typeof edge.max === 'number' && edge.max < 0) {
    return candidates.some(mutation => mutation.amount < 0 && reachabilityFn(mutation.source));
  }
  return true;
}

function computeReachability(model) {
  const memo = new Map();
  const active = new Set();

  function reachable(key) {
    if (memo.has(key)) return memo.get(key);
    const node = model.nodes.get(key);
    if (!node) return false;
    if (node.foundational) {
      memo.set(key, true);
      return true;
    }
    if (active.has(key)) return false;
    active.add(key);

    let baseReachable = false;
    if (node.type === 'dialogue') {
      baseReachable = Boolean(node.entrypoint) || (model.incoming.get(key) || []).some(
        edge => edge.relation === 'next-dialogue' && reachable(edge.from)
      );
    } else if (node.type === 'experience' || node.type === 'fact' || node.type === 'memory' || node.type === 'world-condition') {
      baseReachable = producersFor(model, key).some(edge => reachable(edge.from));
    } else if (node.type === 'quest') {
      const producers = producersFor(model, key);
      baseReachable = producers.length > 0
        ? producers.some(edge => reachable(edge.from))
        : (model.outgoing.get(key) || []).some(edge => edge.relation === 'given-by' && reachable(edge.to));
    } else {
      baseReachable = true;
    }

    if (baseReachable) {
      const required = blockingPrerequisiteEdges(model, key);
      for (const edge of required) {
        if (edge.relation === 'requires-faction') {
          if (!isFactionRequirementPotentiallySatisfiable(model, edge, reachable)) {
            baseReachable = false;
            break;
          }
        } else if (!reachable(edge.to)) {
          baseReachable = false;
          break;
        }
      }

      if (baseReachable) {
        const alternatives = alternativeExperienceEdges(model, key);
        if (alternatives.length > 0 && !alternatives.some(edge => reachable(edge.to))) {
          baseReachable = false;
        }
      }
    }

    active.delete(key);
    memo.set(key, baseReachable);
    return baseReachable;
  }

  for (const key of model.nodes.keys()) reachable(key);
  return { memo, reachable };
}

function findReachabilityProblems(model) {
  const { memo } = computeReachability(model);
  const problems = [];
  for (const node of model.nodes.values()) {
    if (node.type === 'dialogue' && node.entrypoint && memo.get(node.key) === false) {
      problems.push({
        code: 'UNREACHABLE_ENTRY_DIALOGUE',
        entity: node.key,
        message: `${node.key} is offered by an NPC but its prerequisite chain has no modeled reachable producer`,
      });
    }
  }
  return problems;
}

function resolveTarget(model, target) {
  if (model.nodes.has(target)) return target;
  const matches = Array.from(model.nodes.values()).filter(node => node.id === target);
  if (matches.length === 1) return matches[0].key;
  if (matches.length === 0) return null;
  const dialogue = matches.find(node => node.type === 'dialogue');
  return dialogue ? dialogue.key : matches[0].key;
}

function traceTarget(model, target) {
  const key = resolveTarget(model, target);
  if (!key) return null;
  const reachability = computeReachability(model);
  const seen = new Set();

  function build(currentKey) {
    const node = model.nodes.get(currentKey);
    if (!node) return { key: currentKey, missing: true };
    if (seen.has(currentKey)) {
      return { key: currentKey, type: node.type, id: node.id, cycle: true };
    }
    seen.add(currentKey);

    const requirements = [];
    for (const edge of model.outgoing.get(currentKey) || []) {
      if (!edge.relation.startsWith('requires-')) continue;
      const requirement = {
        relation: edge.relation,
        target: edge.to,
        min: edge.min,
        max: edge.max,
        optionalAlternative: Boolean(edge.optionalAlternative),
        reachable: reachability.memo.get(edge.to) !== false,
      };
      const producers = producersFor(model, edge.to).map(producer => build(producer.from));
      if (edge.relation === 'requires-faction') {
        requirement.mutationCandidates = model.factionMutations
          .filter(mutation => nodeKey('faction', mutation.factionId) === edge.to)
          .map(mutation => ({
            source: mutation.source,
            amount: mutation.amount,
            reachable: reachability.memo.get(mutation.source) !== false,
          }));
      }
      requirement.producers = producers;
      requirements.push(requirement);
    }

    const producedBy = producersFor(model, currentKey).map(edge => build(edge.from));
    const result = {
      key: currentKey,
      type: node.type,
      id: node.id,
      title: node.title,
      source: node.source,
      entrypoint: Boolean(node.entrypoint),
      foundational: Boolean(node.foundational),
      reachable: reachability.memo.get(currentKey) !== false,
      requirements,
      producedBy,
    };
    seen.delete(currentKey);
    return result;
  }

  return build(key);
}

function formatTrace(trace) {
  if (!trace) return 'Target not found.';
  const lines = [];

  function render(node, indent, label) {
    const prefix = ' '.repeat(indent);
    const status = node.missing ? 'MISSING' : node.reachable === false ? 'UNREACHABLE' : 'reachable';
    lines.push(`${prefix}${label ? `${label} ` : ''}${node.key} [${status}]${node.title ? ` — ${node.title}` : ''}`);
    if (node.cycle) {
      lines.push(`${prefix}  ↳ cycle boundary`);
      return;
    }
    for (const requirement of node.requirements || []) {
      let qualifier = '';
      if (typeof requirement.min === 'number') qualifier += ` min=${requirement.min}`;
      if (typeof requirement.max === 'number') qualifier += ` max=${requirement.max}`;
      if (requirement.optionalAlternative) qualifier += ' any-of';
      lines.push(`${prefix}  requires (${requirement.relation}${qualifier}) ${requirement.target}`);
      for (const mutation of requirement.mutationCandidates || []) {
        lines.push(`${prefix}    candidate faction mutation ${mutation.source} (${mutation.amount >= 0 ? '+' : ''}${mutation.amount}) [${mutation.reachable ? 'reachable' : 'unreachable'}]`);
      }
      for (const producer of requirement.producers || []) {
        render(producer, indent + 4, 'produced by');
      }
    }
    for (const producer of node.producedBy || []) {
      render(producer, indent + 2, 'produced by');
    }
  }

  render(trace, 0, 'target');
  return lines.join('\n');
}

module.exports = {
  createModel,
  computeReachability,
  findReachabilityProblems,
  formatTrace,
  nodeKey,
  resolveTarget,
  traceTarget,
};
