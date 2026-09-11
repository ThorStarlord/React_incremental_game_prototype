#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  createModel,
  findReachabilityProblems,
  traceTarget,
} = require('./content-graph');
const { checkStructuralConsistency } = require('./structural-checks');

const knownContracts = {
  routines: {},
  locations: ['location_test'],
  factions: ['Test Guild'],
  worldState: { signal: ['quiet', 'clear'] },
};

function writeJson(root, relative, value) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}

function buildValidFixture(root) {
  writeJson(root, 'public/data/npcs.json', {
    npc_test: {
      id: 'npc_test',
      name: 'Test NPC',
      faction: 'Test Guild',
      availableDialogues: ['dialogue_root', 'dialogue_gated'],
      availableQuests: [],
    },
  });
  writeJson(root, 'public/data/dialogues.json', {
    dialogue_root: {
      id: 'dialogue_root',
      npcId: 'npc_test',
      title: 'Root',
      responses: { continue: 'Continue' },
      effects: [{ type: 'RELATIONSHIP_EXPERIENCE', experienceId: 'exp_root' }],
      next: { continue: null },
    },
    dialogue_gated: {
      id: 'dialogue_gated',
      npcId: 'npc_test',
      title: 'Gated',
      requiredExperienceIds: ['exp_root'],
      responses: { close: 'Close' },
      effects: [],
      next: { close: null },
    },
  });
  writeJson(root, 'public/data/quests.json', {});
  writeJson(root, 'public/data/traits.json', {});
  writeJson(root, 'public/data/relationships/test.json', {
    experiences: {
      exp_root: {
        id: 'exp_root',
        title: 'Root experience',
        primaryTargetId: 'npc_test',
        participantIds: ['player', 'npc_test'],
        sourceType: 'dialogue',
        sourceId: 'dialogue_root',
      },
    },
    memories: {},
    progression: {},
  });
}

const validRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'content-intelligence-valid-'));
buildValidFixture(validRoot);
const validModel = createModel(validRoot, { knownContracts });
assert.deepStrictEqual(validModel.issues, [], `expected valid fixture, got ${JSON.stringify(validModel.issues)}`);
assert.deepStrictEqual(checkStructuralConsistency(validModel), []);
assert.deepStrictEqual(findReachabilityProblems(validModel), []);
const trace = traceTarget(validModel, 'dialogue_gated');
assert(trace, 'expected gated dialogue trace');
assert.strictEqual(trace.reachable, true);
assert(trace.requirements.some(requirement => requirement.target === 'experience:exp_root'));
assert(trace.requirements.some(requirement =>
  requirement.producers.some(producer => producer.key === 'dialogue:dialogue_root')
));

const brokenRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'content-intelligence-broken-'));
buildValidFixture(brokenRoot);
const dialoguesPath = path.join(brokenRoot, 'public/data/dialogues.json');
const brokenDialogues = JSON.parse(fs.readFileSync(dialoguesPath, 'utf8'));
brokenDialogues.dialogue_gated.requiredExperienceIds.push('exp_missing');
fs.writeFileSync(dialoguesPath, `${JSON.stringify(brokenDialogues, null, 2)}\n`);
writeJson(brokenRoot, 'public/data/extension.json', {
  dialogues: {
    dialogue_root: {
      id: 'dialogue_root',
      npcId: 'npc_test',
      title: 'Duplicate root',
      responses: { close: 'Close' },
      effects: [],
      next: { close: null },
    },
  },
});
const brokenModel = createModel(brokenRoot, { knownContracts });
assert(brokenModel.issues.some(issue => issue.code === 'DANGLING_REFERENCE' && issue.target === 'experience:exp_missing'));
assert(brokenModel.issues.some(issue => issue.code === 'DUPLICATE_ID' && issue.entity === 'dialogue:dialogue_root'));
assert(findReachabilityProblems(brokenModel).some(problem => problem.entity === 'dialogue:dialogue_gated'));

const structuralModel = {
  outgoing: new Map([
    ['dialogue:contradictory', [
      { from: 'dialogue:contradictory', to: 'fact:signal', relation: 'requires-fact' },
      { from: 'dialogue:contradictory', to: 'fact:signal', relation: 'forbids-fact' },
      { from: 'dialogue:contradictory', to: 'faction:Test Guild', relation: 'requires-faction', min: 10 },
      { from: 'dialogue:contradictory', to: 'faction:Test Guild', relation: 'requires-faction', max: 5 },
      { from: 'dialogue:contradictory', to: 'world-condition:location_test.signal=quiet', relation: 'requires-world-state', regionId: 'location_test', field: 'signal', equals: 'quiet' },
      { from: 'dialogue:contradictory', to: 'world-condition:location_test.signal=clear', relation: 'requires-world-state', regionId: 'location_test', field: 'signal', equals: 'clear' },
    ]],
    ['trait:a', [{ from: 'trait:a', to: 'trait:b', relation: 'requires-trait' }]],
    ['trait:b', [{ from: 'trait:b', to: 'trait:a', relation: 'requires-trait' }]],
  ]),
  edges: [],
};
structuralModel.edges = [...structuralModel.outgoing.values()].flat();
const structuralIssues = checkStructuralConsistency(structuralModel);
assert(structuralIssues.some(issue => issue.code === 'CONTENT_CONTRADICTORY_FACT_REQUIREMENT'));
assert(structuralIssues.some(issue => issue.code === 'CONTENT_CONTRADICTORY_FACTION_REQUIREMENT'));
assert(structuralIssues.some(issue => issue.code === 'CONTENT_CONTRADICTORY_WORLD_STATE_REQUIREMENT'));
assert(structuralIssues.some(issue => issue.code === 'CONTENT_PREREQUISITE_CYCLE'));

console.log('content-intelligence selftest passed');