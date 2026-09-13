const http = require('node:http');
const { spawn, spawnSync, execFileSync } = require('node:child_process');

const commands = [
  ['TypeScript', 'npx', ['tsc', '--noEmit']],
  ['relative import cycle qualification', 'npm', ['run', 'architecture:cycles']],
  ['persistence authority qualification', 'npm', ['run', 'architecture:persistence']],
  ['documentation authority', 'npm', ['run', 'docs:authority:validate']],
  ['content intelligence', 'npm', ['run', 'content:intelligence:validate']],
  ['production lint', 'npm', ['run', 'lint:release']],
  ['runtime dependency security policy', 'npm', ['run', 'security:release']],
  ['release evidence metadata', 'npm', ['run', 'release:evidence:validate']],
  ['Alpha qualification', 'npm', ['run', 'alpha:validate']],
  ['full test suite', 'npm', ['test', '--', '--watchAll=false', '--runInBand']],
  ['production build', 'npm', ['run', 'build']],
  ['production artifact manifest', 'npm', ['run', 'release:manifest']],
];

function runCommand(label, command, args) {
  console.log(`\n[release:1.0] ${label}`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) throw new Error(`FAILED: ${label}`);
}

function waitForHttp(url, timeoutMs = 45000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const retry = () => {
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }
      setTimeout(poll, 1000);
    };
    const poll = () => {
      const request = http.get(url, response => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) resolve();
        else retry();
      });
      request.on('error', retry);
      request.setTimeout(2000, () => {
        request.destroy();
        retry();
      });
    };
    poll();
  });
}

function stopServer(server) {
  if (!server) return;
  if (process.platform === 'win32') {
    try {
      execFileSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' });
    } catch {
      server.kill();
    }
  } else {
    server.kill('SIGTERM');
  }
}

async function runBrowserQualification() {
  const url = process.env.RELEASE_APP_URL || 'http://127.0.0.1:3000';
  let server = null;
  if (!process.env.RELEASE_APP_URL) {
    console.log('\n[release:1.0] start local browser qualification server');
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    server = spawn(npmCommand, ['start'], {
      env: { ...process.env, BROWSER: 'none', HOST: '127.0.0.1', PORT: '3000' },
      stdio: 'ignore',
      shell: process.platform === 'win32',
      windowsHide: true,
    });
    await waitForHttp(url);
  }

  try {
    runCommand('Chromium and Firefox browser qualification', 'npm', [
      'run', 'release:browser', '--', '--browser', 'all', '--url', url,
    ]);
  } finally {
    stopServer(server);
  }
}

async function main() {
  try {
    for (const [label, command, args] of commands) runCommand(label, command, args);
    await runBrowserQualification();
    console.log('\n[release:1.0] deterministic release gates passed');
    console.log('[release:1.0] human Beta evidence and immutable candidate identity remain separate promotion requirements');
  } catch (error) {
    console.error(`\n[release:1.0] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

main();
