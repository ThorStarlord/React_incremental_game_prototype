const { spawnSync } = require('node:child_process');

const commands = [
  ['documentation authority', 'npm', ['run', 'docs:authority:validate']],
  ['content intelligence', 'npm', ['run', 'content:intelligence:validate']],
  ['Campaign One projections', 'npm', ['test', '--', '--watchAll=false', '--runInBand', 'CampaignSpine.test.ts', 'CampaignCompletion.test.ts', 'CampaignOneContentIntegrity.test.ts', 'CampaignOneWholeGameQualification.test.ts', 'ChapterDefinitionIntegrity.test.ts']],
  ['breadth contracts', 'npm', ['test', '--', '--watchAll=false', '--runInBand', 'OnePointZeroDelegationQualification.test.ts', 'PlayerStatusEffects.test.ts']],
  ['type check', 'npx', ['tsc', '--noEmit']],
];

for (const [label, command, args] of commands) {
  console.log(`\n[alpha] ${label}`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    console.error(`[alpha] FAILED: ${label}`);
    process.exit(result.status || 1);
  }
}

console.log('\n[alpha] deterministic qualification passed');
