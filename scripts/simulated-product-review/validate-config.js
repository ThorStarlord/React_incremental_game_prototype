#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function requireText(content, needle, label) {
  assert(content.includes(needle), `${label} is missing required text: ${needle}`);
}

function main() {
  const manifestPath = "scripts/simulated-product-review/profiles.json";
  const manifest = JSON.parse(read(manifestPath));

  assert(manifest.protocolVersion === 1, "profiles.json protocolVersion must be 1");
  assert(manifest.minimumPanelSize === 6, "minimumPanelSize must remain 6 for preregistered v1");
  assert(Array.isArray(manifest.profiles), "profiles must be an array");
  assert(manifest.profiles.length === 6, "preregistered v1 requires exactly six baseline profiles");

  const ids = new Set();
  const packets = new Set();
  for (const profile of manifest.profiles) {
    assert(profile.id && profile.name && profile.packet && profile.risk, "every profile requires id/name/packet/risk");
    assert(!ids.has(profile.id), `duplicate profile id: ${profile.id}`);
    assert(!packets.has(profile.packet), `duplicate profile packet: ${profile.packet}`);
    ids.add(profile.id);
    packets.add(profile.packet);

    const packetPath = path.join(ROOT, profile.packet);
    assert(fs.existsSync(packetPath), `missing participant packet: ${profile.packet}`);
    const packet = fs.readFileSync(packetPath, "utf8");
    requireText(packet, "Use only information supplied through the normal player-facing observation packets from your own run.", profile.packet);
    requireText(packet, "Do not inspect or request source code", profile.packet);
    requireText(packet, "CURRENT INTERPRETATION:", profile.packet);
    requireText(packet, "CURRENT HYPOTHESIS:", profile.packet);
    requireText(packet, "ACTION:", profile.packet);
    requireText(packet, "CONFUSION:", profile.packet);
  }

  const authorityPath = "specification/Technical/PostM25SyntheticReviewAuthority.md";
  const authority = read(authorityPath);
  requireText(authority, "Human product validation", authorityPath);
  requireText(authority, "DEFERRED / UNPROVEN", authorityPath);
  requireText(authority, "M26", authorityPath);
  requireText(authority, "NOT AUTHORIZED", authorityPath);
  requireText(authority, "human validation deferred", authorityPath);
  requireText(authority, "human validation passed", authorityPath);
  requireText(authority, "One informed context role-playing multiple supposedly fresh players is not sufficient isolation.", authorityPath);

  const protocolPath = "specification/Technical/SimulatedIntegratedProductReview.md";
  const protocol = read(protocolPath);
  for (const verdict of [
    "SIMULATED_PRODUCT_REVIEW_PASS",
    "SIMULATED_PRODUCT_REVIEW_WEAK",
    "SIMULATED_PRODUCT_REVIEW_FAIL",
    "INCONCLUSIVE",
  ]) {
    requireText(protocol, verdict, protocolPath);
  }
  requireText(protocol, "Human comprehension        NOT CLAIMED", protocolPath);
  requireText(protocol, "Human product validation remains deferred", protocolPath);
  requireText(protocol, "do not request or preserve private chain-of-thought", protocolPath);

  const resultPath = "specification/Technical/SimulatedIntegratedProductReviewResultTemplate.md";
  const result = read(resultPath);
  requireText(result, "Human comprehension        NOT CLAIMED", resultPath);
  requireText(result, "HUMAN_PRODUCT_VALIDATION: DEFERRED", resultPath);
  requireText(result, "M26                              NOT AUTHORIZED", resultPath);

  const observerPath = "scripts/simulated-product-review/ui-observer.js";
  const observer = read(observerPath);
  requireText(observer, "fresh ephemeral Playwright browser context", observerPath);
  requireText(observer, "INTERACTIVE_SELECTOR", observerPath);
  requireText(observer, "page.screenshot", observerPath);
  requireText(observer, "page.goto", observerPath);

  const forbiddenImplementationAccess = [
    "store.getState(",
    "store.dispatch(",
    "window.__REDUX",
    "window.localStorage.",
    "window.sessionStorage.",
    "__REACT_DEVTOOLS_GLOBAL_HOOK__",
  ];
  for (const token of forbiddenImplementationAccess) {
    assert(!observer.includes(token), `UI observer contains forbidden hidden-state access token: ${token}`);
  }

  const packageJson = JSON.parse(read("package.json"));
  assert(packageJson.scripts && packageJson.scripts["simulated-review:validate"], "package.json missing simulated-review:validate");
  assert(packageJson.scripts && packageJson.scripts["simulated-review:observe"], "package.json missing simulated-review:observe");
  assert(packageJson.scripts && packageJson.scripts["simulated-review:smoke"], "package.json missing simulated-review:smoke");
  assert(packageJson.devDependencies && packageJson.devDependencies.playwright, "Playwright must remain a devDependency");

  console.log(`SIMULATED_REVIEW_CONTRACT_PASS profiles=${manifest.profiles.length} protocolVersion=${manifest.protocolVersion}`);
}

try {
  main();
} catch (error) {
  console.error(`SIMULATED_REVIEW_CONTRACT_FAIL ${error.message}`);
  process.exitCode = 1;
}
