#!/usr/bin/env node

const assert = require('assert');
const { bindControls, validateBoundAction } = require('./action-contract');

const controls = [
  { controlNumber: 1, tag: 'button', text: 'Alpha' },
  { controlNumber: 2, tag: 'button', text: 'Beta' },
  { controlNumber: 3, tag: 'button', text: 'Gamma' },
];

const observation = { sequence: 28, ...bindControls(28, controls) };
const beta = observation.controls[1];

let result = validateBoundAction(beta.actionId, observation, controls);
assert.equal(result.ok, true);
assert.equal(result.controlNumber, 2);

result = validateBoundAction(`${beta.actionId.slice(0, -1)}0`, observation, controls);
assert.equal(result.ok, false);
assert.equal(result.code, 'INVALID_ACTION_ID');

const changed = [
  { controlNumber: 1, tag: 'button', text: 'Alpha' },
  { controlNumber: 2, tag: 'button', text: 'Different' },
  { controlNumber: 3, tag: 'button', text: 'Gamma' },
];
result = validateBoundAction(beta.actionId, observation, changed);
assert.equal(result.ok, false);
assert.equal(result.code, 'ACTION_REJECTED_STALE_OR_MISMATCHED');

const reordered = [controls[1], controls[0], controls[2]].map((control, index) => ({
  ...control,
  controlNumber: index + 1,
}));
result = validateBoundAction(beta.actionId, observation, reordered);
assert.equal(result.ok, false);
assert.equal(result.code, 'ACTION_REJECTED_STALE_OR_MISMATCHED');

console.log('SIMULATED_REVIEW_V2_ACTION_CONTRACT_PASS');
