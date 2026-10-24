#!/usr/bin/env node

/**
 * Full ordinary-UI Campaign One release run.
 *
 * Covers the ReleaseQualificationContract scenarios "Fresh New Game -> ending",
 * "Representative divergence" and the save/load/import-export checkpoints by
 * playing the production build through visible controls only: clean browser
 * context -> New Game -> Prologue -> Chapters 1-7 -> Telluric Echo finale ->
 * state-responsive Epilogue.
 *
 * Evidence class: SYNTHETIC_FINDING. It proves the shipped UI can be completed
 * without debug routes, Redux access, or storage editing. It says nothing about
 * whether a human understands or enjoys the game.
 *
 * Authored content JSON is read only to translate route step IDs into the labels
 * the player sees on screen; the runner never reads or writes game state.
 *
 * Usage:
 *   node scripts/release-full-campaign.js --url http://127.0.0.1:5000 \
 *     [--browser chromium|firefox|all] [--route distributed|fortified|all] \
 *     [--out dir] [--headed]
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium, firefox } = require('playwright');

const REPO_ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUT = path.join(REPO_ROOT, '.release-artifacts', 'full-campaign');
const VIEWPORT = { width: 1280, height: 720 };
const STEP_TIMEOUT = 15000;

const LOCATION_NAMES = {
  location_city_center: 'City Center',
  location_merchant_district: 'Merchant District',
  location_city_gate: 'City Gate',
  location_whispering_woods: 'Whispering Woods',
  location_chrono_crypt: 'Chrono-Crypt',
};

const CONTENT_EXTENSIONS = [
  'm24-world-state-content.json',
  'm25-chapter-content.json',
  'gc06-lattice-content.json',
  'gc07-chrono-crypt-content.json',
  'gc08-network-content.json',
  'gc09-counterphase-content.json',
  'gc10-finale-content.json',
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, relativePath), 'utf8'));
}

function loadContent() {
  const dialogues = { ...readJson('public/data/dialogues.json') };
  for (const file of CONTENT_EXTENSIONS) {
    Object.assign(dialogues, readJson(`public/data/${file}`).dialogues || {});
  }
  return {
    dialogues,
    quests: readJson('public/data/quests.json'),
    npcs: readJson('public/data/npcs.json'),
  };
}

// ---------------------------------------------------------------------------
// Routes. Each step is one player action through ordinary UI.
// ---------------------------------------------------------------------------

const talk = (npc, dialogue, response) => ({ kind: 'talk', npc, dialogue, response });
const accept = (quest) => ({ kind: 'accept', quest });
const resolve = (quest, resolution) => ({ kind: 'resolve', quest, resolution });
const turnIn = (quest) => ({ kind: 'turnIn', quest });
const travel = (location) => ({ kind: 'travel', location });
const forge = () => ({ kind: 'forge' });
const checkpoint = (name, expectText) => ({ kind: 'checkpoint', name, expectText });
const exportImport = (expectText) => ({ kind: 'exportImport', expectText });

const WILLOW = 'npc_elder_willow';
const GRONK = 'npc_blacksmith_gronk';
const SILAS = 'npc_rogue_silas';
const VALERIUS = 'npc_captain_valerius';
const ELARA = 'npc_scholar_elara';
const LYRA = 'npc_lyra';

const OPENING_THROUGH_CHAPTER_FIVE = [
  // Prologue
  travel('location_city_gate'),
  travel('location_whispering_woods'),
  talk(WILLOW, 'elder_willow_greeting', 'respect'),
  checkpoint('after the opening'),

  // Chapter 1 — Merchant District Crisis
  travel('location_city_gate'),
  travel('location_city_center'),
  talk(GRONK, 'gronk_greeting', 'inspect'),
  talk(GRONK, 'gronk_craft_request', 'specify'),
  talk(GRONK, 'gronk_rumors', 'back_quality'),
  talk(GRONK, 'gronk_blade_held', 'recognize'),
  talk(SILAS, 'silas_approach', 'dangerous_truth'),
  talk(SILAS, 'silas_shady_deal', 'accept'),
  accept('quest_silas_retrieve_item'),
  resolve('quest_silas_retrieve_item', 'return_unopened'),
  turnIn('quest_silas_retrieve_item'),
  talk(SILAS, 'silas_trait_hint', 'name_it'),
  talk(SILAS, 'silas_secret_neither_sold', 'acknowledge'),
  talk(SILAS, 'silas_watch_leak_tip', 'take_tip'),
  accept('quest_m13_trace_merchant_leak'),
  talk(VALERIUS, 'valerius_report', 'state_objective'),
  talk(VALERIUS, 'valerius_training_offer', 'accept'),
  accept('quest_valerius_patrol_duty'),
  travel('location_merchant_district'),
  resolve('quest_m13_trace_merchant_leak', 'confirm_pattern'),
  turnIn('quest_m13_trace_merchant_leak'),
  resolve('quest_valerius_patrol_duty', 'report_plainly'),
  turnIn('quest_valerius_patrol_duty'),
  talk(VALERIUS, 'valerius_city_issues', 'question_order'),
  talk(VALERIUS, 'valerius_delegated_leak_response', 'accept'),
  accept('quest_m13_break_merchant_leak'),
  travel('location_city_center'),
  travel('location_merchant_district'),
  resolve('quest_m13_break_merchant_leak', 'adaptive_intercept'),
  turnIn('quest_m13_break_merchant_leak'),
  talk(VALERIUS, 'valerius_m14_aftermath_council', 'public_crackdown'),
  talk(VALERIUS, 'valerius_m15_forged_ledger_inquiry', 'investigate'),
  talk(SILAS, 'silas_m15_debt_not_renewed', 'confirm_limit'),
  travel('location_city_center'),
  forge(),
  talk(VALERIUS, 'valerius_m22_forge_report', 'report'),
  talk(VALERIUS, 'valerius_m23_public_override', 'own_override'),
  talk(VALERIUS, 'valerius_m24_redeploy_patrols', 'redeploy'),
  talk(VALERIUS, 'valerius_m25_public_order_conclusion', 'close'),

  // Chapter 2 — Archive Inquiry
  talk(ELARA, 'elara_greeting', 'challenge'),
  talk(ELARA, 'elara_contradictory_footnote', 'follow'),
  talk(ELARA, 'elara_offer_tome', 'accept'),
  accept('quest_elara_lost_tome'),
  resolve('quest_elara_lost_tome', 'follow_evidence'),
  turnIn('quest_elara_lost_tome'),
  talk(ELARA, 'elara_revision_mutual', 'revise'),
  talk(ELARA, 'elara_theory_neither_owned', 'build'),
  talk(ELARA, 'elara_independent_verification', 'report'),

  // Chapter 3 — Enemies in Phase
  talk(LYRA, 'lyra_strategic_defeat', 'hold_ground'),
  talk(LYRA, 'lyra_coercion_reflected', 'reflect'),
  talk(LYRA, 'lyra_offer_cotraining', 'accept'),
  accept('quest_lyra_chrono_crypt_calibration'),
  resolve('quest_lyra_chrono_crypt_calibration', 'coordinate_without_conceding'),
  turnIn('quest_lyra_chrono_crypt_calibration'),
  talk(LYRA, 'lyra_ideological_friction', 'argue'),
  talk(LYRA, 'lyra_mutual_calibration', 'calibrate'),
  talk(LYRA, 'lyra_enemies_in_phase', 'solve'),
  checkpoint('midgame (after Chapter 3)'),

  // Chapter 4 — Lattice Under Strain
  talk(ELARA, 'elara_gc06_lattice_diagnosis', 'diagnose'),
  talk(VALERIUS, 'valerius_gc06_lattice_briefing', 'brief'),
  accept('quest_gc06_lattice_under_strain'),
  travel('location_merchant_district'),
  resolve('quest_gc06_lattice_under_strain', 'contain_surface_failures'),
  turnIn('quest_gc06_lattice_under_strain'),
  talk(VALERIUS, 'valerius_gc06_stabilize_lattice', 'stabilize'),
  talk(LYRA, 'lyra_gc06_chrono_crypt_route', 'agree'),

  // Chapter 5 — The Chrono-Crypt
  accept('quest_gc07_counterphase_principle'),
  travel('location_city_center'),
  travel('location_city_gate'),
  travel('location_whispering_woods'),
  travel('location_chrono_crypt'),
  resolve('quest_gc07_counterphase_principle', 'manual_harmonic_triangulation'),
  turnIn('quest_gc07_counterphase_principle'),
  talk(LYRA, 'lyra_gc07_counterphase_interpretation', 'record'),
];

const ROUTES = {
  distributed: {
    title: 'Distributed Dissipation',
    steps: [
      ...OPENING_THROUGH_CHAPTER_FIVE,
      // Chapter 6 — Network Under Pressure
      talk(ELARA, 'elara_gc08_network_diagnosis', 'brief'),
      accept('quest_gc08_distributed_preparation'),
      travel('location_whispering_woods'),
      travel('location_city_gate'),
      travel('location_city_center'),
      travel('location_merchant_district'),
      resolve('quest_gc08_distributed_preparation', 'prepare_distributed_baseline'),
      turnIn('quest_gc08_distributed_preparation'),
      talk(LYRA, 'lyra_gc08_commit_distributed', 'commit'),
      // Chapter 7 — Counterphase
      talk(LYRA, 'lyra_gc09_prepare_distributed', 'prepare'),
      accept('quest_gc09_distributed_counterphase'),
      travel('location_city_center'),
      travel('location_merchant_district'),
      resolve('quest_gc09_distributed_counterphase', 'prepare_distributed_finale'),
      turnIn('quest_gc09_distributed_counterphase'),
      talk(LYRA, 'lyra_gc09_commit_distributed', 'commit'),
      checkpoint('immediately before the finale'),
      // Finale — The Telluric Echo
      talk(LYRA, 'lyra_gc10_enter_distributed_finale', 'enter'),
      accept('quest_gc10_telluric_echo_distributed'),
      travel('location_city_center'),
      travel('location_city_gate'),
      travel('location_whispering_woods'),
      resolve('quest_gc10_telluric_echo_distributed', 'resolve_distributed_dissipation'),
      turnIn('quest_gc10_telluric_echo_distributed'),
      talk(LYRA, 'lyra_gc10_aftermath_distributed', 'record'),
      checkpoint('after campaign completion', 'Campaign One Complete — Distributed Dissipation'),
      exportImport('Campaign One Complete — Distributed Dissipation'),
    ],
  },
  fortified: {
    title: 'Fortified Containment',
    steps: [
      ...OPENING_THROUGH_CHAPTER_FIVE,
      // Chapter 6 — the City Watch mobilizes behind a verified baseline.
      talk(ELARA, 'elara_gc08_network_diagnosis', 'brief'),
      talk(VALERIUS, 'valerius_gc08_counterphase_briefing', 'brief'),
      accept('quest_gc08_distributed_preparation'),
      travel('location_whispering_woods'),
      travel('location_city_gate'),
      travel('location_city_center'),
      travel('location_merchant_district'),
      resolve('quest_gc08_distributed_preparation', 'prepare_distributed_baseline'),
      turnIn('quest_gc08_distributed_preparation'),
      talk(LYRA, 'lyra_gc08_commit_fortified', 'commit'),
      // Chapter 7 — fortified counterphase prepared at the City Gate.
      talk(LYRA, 'lyra_gc09_prepare_fortified', 'prepare'),
      accept('quest_gc09_fortified_counterphase'),
      travel('location_city_center'),
      travel('location_city_gate'),
      resolve('quest_gc09_fortified_counterphase', 'prepare_fortified_finale'),
      turnIn('quest_gc09_fortified_counterphase'),
      talk(LYRA, 'lyra_gc09_commit_fortified', 'commit'),
      checkpoint('immediately before the finale'),
      // Finale — The Telluric Echo
      talk(LYRA, 'lyra_gc10_enter_fortified_finale', 'enter'),
      accept('quest_gc10_telluric_echo_fortified'),
      travel('location_whispering_woods'),
      resolve('quest_gc10_telluric_echo_fortified', 'resolve_fortified_containment'),
      turnIn('quest_gc10_telluric_echo_fortified'),
      talk(LYRA, 'lyra_gc10_aftermath_fortified', 'record'),
      checkpoint('after campaign completion', 'Campaign One Complete — Fortified Containment'),
      exportImport('Campaign One Complete — Fortified Containment'),
    ],
  },
};

// ---------------------------------------------------------------------------
// Player actions through visible UI.
// ---------------------------------------------------------------------------

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function waitForTextChange(locator, before, what, timeout = STEP_TIMEOUT) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if ((await locator.innerText()) !== before) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`${what} did not change within ${timeout}ms`);
}

class CampaignRunner {
  constructor(page, content) {
    this.page = page;
    this.content = content;
  }

  async nav(label) {
    await this.page.getByRole('button', { name: `Navigate to ${label}`, exact: true }).click();
  }

  async dismissIntro() {
    const intro = this.page.getByRole('dialog', { name: 'Introduction' });
    await intro.waitFor({ state: 'visible', timeout: STEP_TIMEOUT });
    while (await intro.isVisible()) {
      await intro.getByRole('button', { name: /^(Continue|Begin)$/ }).click();
    }
  }

  async newGame() {
    await this.page.getByRole('button', { name: /^New Game$/ }).click();
    await this.page.waitForURL(/\/game\//, { timeout: STEP_TIMEOUT });
    await this.dismissIntro();

    // UI-02: New Game must land directly on the situation-first Dashboard
    // through a production route, not a test-only navigation or a state seed.
    await this.page.waitForURL(/\/game\/dashboard$/, { timeout: STEP_TIMEOUT });
    const moment = this.page.locator('[data-testid="current-moment"]');
    await moment.getByRole('heading', { name: 'Current Moment' }).waitFor({ timeout: STEP_TIMEOUT });
    await moment.getByRole('link', { name: 'Find Elder Willow' }).click();
    await this.page.getByRole('button', { name: 'Travel to City Gate', exact: true }).waitFor({ timeout: STEP_TIMEOUT });
  }

  npcName(npcId) {
    const npc = this.content.npcs[npcId];
    if (!npc) throw new Error(`unknown NPC ${npcId}`);
    return npc.name;
  }

  async openNpcTab(npcId, tabPattern) {
    const target = new RegExp(`/game/npcs/${npcId}$`);
    if (!target.test(this.page.url())) {
      await this.nav('NPCs');
      const card = this.page.getByRole('button', { name: `Open ${this.npcName(npcId)}`, exact: true });
      await card.first().click({ timeout: STEP_TIMEOUT });
      await this.page.waitForURL(target, { timeout: STEP_TIMEOUT });
    }
    await this.page.getByRole('tab', { name: tabPattern }).click();
  }

  async talk({ npc, dialogue, response }) {
    const node = this.content.dialogues[dialogue];
    if (!node) throw new Error(`unknown dialogue ${dialogue}`);
    const title = node.title || node.text || node.id;
    const label = node.responses?.[response];
    if (!label) throw new Error(`dialogue ${dialogue} has no response ${response}`);

    await this.openNpcTab(npc, /^dialogue$/i);
    // Innermost grid items only: page layout grids also contain the topic text.
    const topic = this.page.locator('.MuiGrid-item:not(:has(.MuiGrid-item))').filter({
      has: this.page.getByText(title, { exact: true }),
    });
    try {
      await topic.first().waitFor({ state: 'visible', timeout: STEP_TIMEOUT });
    } catch {
      const available = await this.page.locator('.MuiGrid-item:not(:has(.MuiGrid-item)) > p.MuiTypography-body2').allInnerTexts();
      throw new Error(`topic "${title}" not offered by ${npc}; offered: ${JSON.stringify(available)}`);
    }
    // Topics can stay offered after an answer, so success is a new entry in
    // the visible conversation history rather than the topic disappearing.
    const history = this.page.locator('.MuiPaper-root').filter({
      has: this.page.getByText('Recent Conversations', { exact: true }),
    }).first();
    const before = await history.innerText();
    await topic.first().getByRole('button', { name: label, exact: true }).click();
    await waitForTextChange(history, before, `conversation history after ${dialogue}`);
  }

  questDefinition(questId) {
    const quest = this.content.quests[questId];
    if (!quest) throw new Error(`unknown quest ${questId}`);
    return quest;
  }

  async openQuest(questId) {
    const quest = this.questDefinition(questId);
    await this.openNpcTab(quest.giver, /^quests$/i);
    const panel = this.page.locator('.MuiAccordion-root').filter({
      has: this.page.getByText(quest.title, { exact: true }),
    }).first();
    await panel.waitFor({ state: 'visible', timeout: STEP_TIMEOUT });
    const summary = panel.locator('.MuiAccordionSummary-root');
    if ((await summary.getAttribute('aria-expanded')) !== 'true') await summary.click();
    return { panel, quest };
  }

  async accept({ quest: questId }) {
    const { panel } = await this.openQuest(questId);
    await panel.getByRole('button', { name: 'Accept Quest', exact: true }).click();
    await panel.getByText(/^(In Progress|Ready to Resolve)$/).waitFor({ timeout: STEP_TIMEOUT });
  }

  async resolve({ quest: questId, resolution }) {
    const { panel, quest } = await this.openQuest(questId);
    const option = (quest.resolutionOptions || []).find(candidate => candidate.id === resolution);
    if (!option) throw new Error(`quest ${questId} has no resolution ${resolution}`);
    await panel.getByRole('button', { name: `Choose ${option.label}`, exact: true }).click({ timeout: STEP_TIMEOUT });
    await panel.getByText(`Decision locked: ${option.label}`).waitFor({ timeout: STEP_TIMEOUT });
  }

  async turnIn({ quest: questId }) {
    const { panel } = await this.openQuest(questId);
    await panel.getByRole('button', { name: 'Turn In Quest', exact: true }).click({ timeout: STEP_TIMEOUT });
    await panel.getByText(/^Completed$/).first().waitFor({ timeout: STEP_TIMEOUT });
  }

  async travel({ location }) {
    const name = LOCATION_NAMES[location];
    if (!name) throw new Error(`unknown location ${location}`);
    await this.nav('Dashboard');
    await this.page.getByRole('button', { name: `Travel to ${name}`, exact: true }).click({ timeout: STEP_TIMEOUT });
    await this.page.getByText(`Current location: ${name}`, { exact: true }).waitFor({ timeout: STEP_TIMEOUT });
  }

  async forge() {
    await this.nav('Dashboard');
    await this.page.getByRole('button', { name: 'Practice Forge Assistance (+5 Gold)', exact: true }).click({ timeout: STEP_TIMEOUT });
    await this.page.getByRole('button', { name: 'Forge Assistance Learned', exact: true }).waitFor({ timeout: STEP_TIMEOUT });
  }

  // The campaign objective heading (e.g. "Chapter 4 — Lattice Under Strain").
  async campaignHeading() {
    // Chapter objectives are intentionally expandable in UI2. Exercise the
    // visible summary, as a player would, before asserting the authored title.
    const guidance = this.page.locator('details').filter({
      has: this.page.getByText('Chapter objective and optional guidance', { exact: true }),
    }).first();
    await guidance.waitFor({ state: 'visible', timeout: STEP_TIMEOUT });
    if ((await guidance.getAttribute('open')) === null) {
      await guidance.locator('summary').first().click();
    }
    const text = await this.page.getByRole('main').first().innerText();
    const match = text.match(/^(Prologue\b.*|Chapter \d+ — .*|Finale — .*|Campaign One Complete — .*)$/m);
    if (!match) throw new Error(`no campaign objective heading visible; saw: ${text.slice(0, 300)}`);
    return match[1].trim();
  }

  // Save in game, return to the main menu, Continue, and confirm the campaign
  // spine shows the same progress afterwards.
  async checkpoint({ expectText }) {
    await this.nav('Dashboard');
    const before = await this.campaignHeading();
    if (expectText && before !== expectText) {
      throw new Error(`expected "${expectText}" before saving; saw "${before}"`);
    }

    await this.page.getByRole('button', { name: 'Save & Main Menu', exact: true }).click();
    await this.page.getByRole('heading', { name: 'Incremental RPG' }).waitFor({ timeout: STEP_TIMEOUT });
    await this.page.getByRole('button', { name: /^Continue\b/ }).click();
    await this.page.waitForURL(/\/game(\/|$)/, { timeout: STEP_TIMEOUT });
    await this.nav('Dashboard');
    const after = await this.campaignHeading();
    if (after !== before) {
      throw new Error(`campaign changed across save/Continue: "${before}" -> "${after}"`);
    }
    const saveStatus = await this.page.getByRole('region', { name: 'Game session' }).getByRole('status').innerText();
    if (!saveStatus.startsWith('Last saved')) {
      throw new Error(`session bar after Continue reports "${saveStatus}"`);
    }
    return { heading: after, saveStatus };
  }

  // Export the completed save from the main menu, import the code as a new
  // slot, load that slot, and confirm the same completed campaign comes back.
  async exportImport({ expectText }) {
    await this.page.getByRole('button', { name: 'Save & Main Menu', exact: true }).click();
    await this.page.getByRole('heading', { name: 'Incremental RPG' }).waitFor({ timeout: STEP_TIMEOUT });

    await this.page.getByRole('button', { name: /^Export$/ }).click();
    const exportDialog = this.page.getByRole('dialog', { name: 'Export Save' });
    const code = await exportDialog.getByRole('textbox').inputValue();
    if (code.length < 1000) throw new Error(`export code is implausibly short (${code.length} chars)`);
    await exportDialog.getByRole('button', { name: 'Close', exact: true }).click();
    await exportDialog.waitFor({ state: 'hidden', timeout: STEP_TIMEOUT });

    await this.page.getByRole('button', { name: /^Import$/ }).click();
    const importDialog = this.page.getByRole('dialog', { name: 'Import Save' });
    await importDialog.getByRole('textbox').fill(code);
    await importDialog.getByRole('button', { name: 'Import', exact: true }).click();
    await importDialog.waitFor({ state: 'hidden', timeout: STEP_TIMEOUT });

    await this.page.getByRole('button', { name: /^Load Game$/ }).click();
    const loadDialog = this.page.getByRole('dialog', { name: 'Load Saved Game' });
    await loadDialog.getByRole('button', { name: /^Imported Save/ }).first().click();
    await this.page.waitForURL(/\/game(\/|$)/, { timeout: STEP_TIMEOUT });
    await this.nav('Dashboard');
    const heading = await this.campaignHeading();
    if (heading !== expectText) throw new Error(`imported save shows "${heading}", expected "${expectText}"`);
    return { heading, exportCodeLength: code.length };
  }
}

// ---------------------------------------------------------------------------
// Execution and artifacts.
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const options = {
    url: process.env.RELEASE_APP_URL || 'http://127.0.0.1:5000',
    browser: 'chromium',
    route: 'all',
    out: DEFAULT_OUT,
    headless: true,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--url') options.url = argv[++index];
    else if (arg === '--browser') options.browser = argv[++index];
    else if (arg === '--route') options.route = argv[++index];
    else if (arg === '--out') options.out = path.resolve(argv[++index]);
    else if (arg === '--headed') options.headless = false;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function gitValue(args) {
  try {
    return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function describeStep(step) {
  switch (step.kind) {
    case 'talk': return `talk ${step.npc} ${step.dialogue} -> ${step.response}`;
    case 'accept': return `accept ${step.quest}`;
    case 'resolve': return `resolve ${step.quest} -> ${step.resolution}`;
    case 'turnIn': return `turn in ${step.quest}`;
    case 'travel': return `travel ${step.location}`;
    case 'forge': return 'practice Forge Assistance';
    case 'checkpoint': return `save/Continue checkpoint: ${step.name}`;
    case 'exportImport': return 'export -> import -> load round trip';
    default: return step.kind;
  }
}

async function runRoute(browserName, browserType, routeId, options, content) {
  const route = ROUTES[routeId];
  const executablePath = process.env[`RELEASE_${browserName.toUpperCase()}_EXECUTABLE`];
  const browser = await browserType.launch({
    headless: options.headless,
    ...(executablePath ? { executablePath } : {}),
  });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  const runner = new CampaignRunner(page, content);
  const startedAt = Date.now();
  const result = {
    browser: browserName,
    browserVersion: browser.version(),
    route: routeId,
    title: route.title,
    steps: route.steps.length,
    completedSteps: 0,
    checkpoints: [],
    pageErrors,
    status: 'FAIL',
  };

  try {
    await page.goto(options.url, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Incremental RPG' }).waitFor({ timeout: STEP_TIMEOUT });
    await runner.newGame();

    for (const step of route.steps) {
      const label = describeStep(step);
      try {
        const detail = await runner[step.kind](step);
        if (step.kind === 'checkpoint') result.checkpoints.push({ name: step.name, ...detail });
        if (step.kind === 'exportImport') result.exportImport = detail;
      } catch (error) {
        result.failedStep = label;
        result.error = error instanceof Error ? error.message.split('\n')[0] : String(error);
        const shot = path.join(options.out, `${browserName}-${routeId}-failure.png`);
        await page.screenshot({ path: shot, fullPage: true }).catch(() => undefined);
        result.failureScreenshot = path.relative(REPO_ROOT, shot);
        throw error;
      }
      result.completedSteps += 1;
      if (process.env.RELEASE_CAMPAIGN_VERBOSE) console.log(`  ok ${label}`);
    }
    if (pageErrors.length > 0) throw new Error(`page errors: ${pageErrors.join('; ')}`);
    result.status = 'PASS';
  } catch {
    // Recorded on the result above.
  } finally {
    result.durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    await browser.close();
  }
  return result;
}

function writeArtifacts(options, report) {
  fs.mkdirSync(options.out, { recursive: true });
  fs.writeFileSync(path.join(options.out, 'full-campaign.json'), `${JSON.stringify(report, null, 2)}\n`);
  const lines = [
    '# Full Campaign Release Run',
    '',
    `- Generated: ${report.generatedAt}`,
    `- Candidate version: ${report.version}`,
    `- Candidate commit: ${report.commit}`,
    `- URL: ${report.url}`,
    `- Host: ${report.host}`,
    `- Evidence class: SYNTHETIC_FINDING (ordinary UI only; not human evidence)`,
    `- Overall result: **${report.overall}**`,
    '',
    '| Browser | Version | Route | Steps | Save/Continue checkpoints | Export/import | Duration | Result |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...report.runs.map(run =>
      `| ${run.browser} | ${run.browserVersion} | ${run.title} | ${run.completedSteps}/${run.steps} | ${run.checkpoints.length} | ${run.exportImport ? 'PASS' : '—'} | ${run.durationSeconds}s | ${run.status} |`),
    '',
  ];
  for (const run of report.runs.filter(candidate => candidate.status !== 'PASS')) {
    lines.push(`## ${run.browser} / ${run.route} failure`, '', `- Step: ${run.failedStep}`, `- Error: ${run.error}`, '');
  }
  fs.writeFileSync(path.join(options.out, 'full-campaign.md'), `${lines.join('\n')}\n`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const content = loadContent();
  const browsers = options.browser === 'all'
    ? [['chromium', chromium], ['firefox', firefox]]
    : [[options.browser, { chromium, firefox }[options.browser]]];
  const routes = options.route === 'all' ? Object.keys(ROUTES) : [options.route];
  for (const routeId of routes) {
    if (!ROUTES[routeId]) throw new Error(`unknown route ${routeId}`);
  }
  fs.mkdirSync(options.out, { recursive: true });

  const runs = [];
  for (const [browserName, browserType] of browsers) {
    if (!browserType) throw new Error(`unknown browser ${browserName}`);
    for (const routeId of routes) {
      console.log(`[release:campaign] ${browserName} / ${routeId}`);
      const run = await runRoute(browserName, browserType, routeId, options, content);
      console.log(`[release:campaign]   ${run.status} ${run.completedSteps}/${run.steps} steps in ${run.durationSeconds}s${run.error ? ` — ${run.failedStep}: ${run.error}` : ''}`);
      runs.push(run);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    version: readJson('package.json').version,
    commit: gitValue(['rev-parse', 'HEAD']),
    url: options.url,
    host: `${os.platform()} ${os.release()} ${os.arch()}`,
    overall: runs.every(run => run.status === 'PASS') ? 'PASS' : 'FAIL',
    runs,
  };
  writeArtifacts(options, report);
  console.log(`[release:campaign] ${report.overall}; artifact: ${path.join(options.out, 'full-campaign.md')}`);
  if (report.overall !== 'PASS') process.exitCode = 1;
}

main().catch(error => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
