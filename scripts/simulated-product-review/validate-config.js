#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function requireText(content, needle, label) {
  assert(content.includes(needle), `${label} is missing required text: ${needle}`);
}

function validateManifest(relativePath, expectedVersion, packetActionSyntax) {
  const manifest = JSON.parse(read(relativePath));
  assert(manifest.protocolVersion === expectedVersion, `${relativePath} protocolVersion must be ${expectedVersion}`);
  assert(manifest.minimumPanelSize === 6, `${relativePath} minimumPanelSize must remain 6`);
  assert(Array.isArray(manifest.profiles) && manifest.profiles.length === 6, `${relativePath} requires exactly six profiles`);

  const ids = new Set();
  const packets = new Set();
  for (const profile of manifest.profiles) {
    assert(profile.id && profile.name && profile.packet && profile.risk, `${relativePath}: every profile requires id/name/packet/risk`);
    assert(!ids.has(profile.id), `${relativePath}: duplicate profile id ${profile.id}`);
    assert(!packets.has(profile.packet), `${relativePath}: duplicate packet ${profile.packet}`);
    ids.add(profile.id);
    packets.add(profile.packet);

    const packetPath = path.join(ROOT, profile.packet);
    assert(fs.existsSync(packetPath), `missing participant packet: ${profile.packet}`);
    const packet = fs.readFileSync(packetPath, 'utf8');
    requireText(packet, 'Use only information supplied through the normal player-facing observation packets from your own run.', profile.packet);
    requireText(packet, 'Do not inspect or request source code', profile.packet);
    requireText(packet, 'CURRENT INTERPRETATION:', profile.packet);
    requireText(packet, 'CURRENT HYPOTHESIS:', profile.packet);
    requireText(packet, 'ACTION:', profile.packet);
    requireText(packet, 'CONFUSION:', profile.packet);
    requireText(packet, packetActionSyntax, profile.packet);
  }
  return manifest;
}

function main() {
  const v1 = validateManifest('scripts/simulated-product-review/profiles.json', 1, 'click <control-number>');
  const v2 = validateManifest('scripts/simulated-product-review/profiles-v2.json', 2, 'click <action-id>');

  const authorityPath = 'specification/Technical/PostM25SyntheticReviewAuthority.md';
  const authority = read(authorityPath);
  requireText(authority, 'Human product validation', authorityPath);
  requireText(authority, 'DEFERRED / UNPROVEN', authorityPath);
  requireText(authority, 'M26', authorityPath);
  requireText(authority, 'NOT AUTHORIZED', authorityPath);
  requireText(authority, 'human validation deferred', authorityPath);
  requireText(authority, 'human validation passed', authorityPath);
  requireText(authority, 'One informed context role-playing multiple supposedly fresh players is not sufficient isolation.', authorityPath);

  const recoveryPath = 'specification/Technical/PostSIRV1RecoveryAuthority.md';
  const recovery = read(recoveryPath);
  requireText(recovery, 'SIR-V1', recoveryPath);
  requireText(recovery, 'INCONCLUSIVE', recoveryPath);
  requireText(recovery, 'Experimental apparatus repair', recoveryPath);
  requireText(recovery, 'AUTHORIZED', recoveryPath);
  requireText(recovery, 'Game repair', recoveryPath);
  requireText(recovery, 'NOT AUTHORIZED', recoveryPath);
  requireText(recovery, 'M26', recoveryPath);

  const amendmentPath = 'specification/Technical/SimulatedIntegratedProductReviewV2Amendment.md';
  const amendment = read(amendmentPath);
  requireText(amendment, 'observation-bound action IDs', amendmentPath);
  requireText(amendment, 'fail closed', amendmentPath);
  requireText(amendment, 'Same frozen game candidate', amendmentPath);
  requireText(amendment, 'six-profile', amendmentPath);

  const protocolPath = 'specification/Technical/SimulatedIntegratedProductReview.md';
  const protocol = read(protocolPath);
  for (const verdict of [
    'SIMULATED_PRODUCT_REVIEW_PASS',
    'SIMULATED_PRODUCT_REVIEW_WEAK',
    'SIMULATED_PRODUCT_REVIEW_FAIL',
    'INCONCLUSIVE',
  ]) {
    requireText(protocol, verdict, protocolPath);
  }
  requireText(protocol, 'Human comprehension        NOT CLAIMED', protocolPath);
  requireText(protocol, 'Human product validation remains deferred', protocolPath);
  requireText(protocol, 'Do not request or preserve private chain-of-thought', protocolPath);

  const resultPath = 'specification/Technical/SimulatedIntegratedProductReviewResultTemplate.md';
  const result = read(resultPath);
  requireText(result, 'Human comprehension        NOT CLAIMED', resultPath);
  requireText(result, 'HUMAN_PRODUCT_VALIDATION: DEFERRED', resultPath);
  requireText(result, 'M26                              NOT AUTHORIZED', resultPath);

  const observerPath = 'scripts/simulated-product-review/ui-observer.js';
  const observer = read(observerPath);
  for (const needle of [
    'fresh ephemeral Playwright browser context',
    'INTERACTIVE_SELECTOR',
    'page.screenshot',
    'page.goto',
    'profiles-v2.json',
    'participant-relay-',
    'session-ledger.jsonl',
    'observationBoundActionIds',
    'staleActionsFailClosed',
  ]) {
    requireText(observer, needle, observerPath);
  }

  const forbiddenImplementationAccess = [
    'store.getState(',
    'store.dispatch(',
    'window.__REDUX',
    'window.localStorage.',
    'window.sessionStorage.',
    '__REACT_DEVTOOLS_GLOBAL_HOOK__',
  ];
  for (const token of forbiddenImplementationAccess) {
    assert(!observer.includes(token), `UI observer contains forbidden hidden-state access token: ${token}`);
  }

  const actionContractPath = 'scripts/simulated-product-review/action-contract.js';
  const actionContract = read(actionContractPath);
  requireText(actionContract, 'validateBoundAction', actionContractPath);
  requireText(actionContract, 'ACTION_REJECTED_STALE_OR_MISMATCHED', actionContractPath);
  requireText(actionContract, 'controlSetDigest', actionContractPath);

  const actionValidatorPath = 'scripts/simulated-product-review/validate-action-contract.js';
  const actionValidator = read(actionValidatorPath);
  requireText(actionValidator, 'SIMULATED_REVIEW_V2_ACTION_CONTRACT_PASS', actionValidatorPath);
  requireText(actionValidator, 'reordered', actionValidatorPath);

  const packageJson = JSON.parse(read('package.json'));
  for (const script of [
    'simulated-review:validate',
    'simulated-review:action-contract',
    'simulated-review:observe',
    'simulated-review:smoke',
  ]) {
    assert(packageJson.scripts && packageJson.scripts[script], `package.json missing ${script}`);
  }
  assert(packageJson.devDependencies && packageJson.devDependencies.playwright, 'Playwright must remain a devDependency');

  console.log(`SIMULATED_REVIEW_CONTRACT_PASS v1Profiles=${v1.profiles.length} v2Profiles=${v2.profiles.length} protocolVersion=2`);
}

try {
  main();
} catch (error) {
  console.error(`SIMULATED_REVIEW_CONTRACT_FAIL ${error.message}`);
  process.exitCode = 1;
}
