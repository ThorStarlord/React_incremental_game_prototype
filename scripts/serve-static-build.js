#!/usr/bin/env node

/**
 * Release-like static host for the production `build/` directory.
 *
 * Serves files exactly as a plain static host would, with a single-page-app
 * fallback to index.html for client routes. No dev server, proxy, or source
 * transform is involved, so a release run against this host exercises the
 * shipped bundle.
 *
 * Usage: node scripts/serve-static-build.js [--dir build] [--host 127.0.0.1] [--port 5000]
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function parseArgs(argv) {
  const options = { dir: 'build', host: '127.0.0.1', port: 5000 };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dir') options.dir = argv[++index];
    else if (arg === '--host') options.host = argv[++index];
    else if (arg === '--port') options.port = Number(argv[++index]);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function createStaticServer(rootDir) {
  const root = path.resolve(rootDir);
  const indexPath = path.join(root, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`${indexPath} does not exist; run npm run build first`);
  }

  return http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const decoded = decodeURIComponent(url.pathname);
    const candidate = path.normalize(path.join(root, decoded));

    // Never serve anything outside the build directory.
    const inside = candidate === root || candidate.startsWith(root + path.sep);
    let filePath = null;
    try {
      if (inside && fs.statSync(candidate).isFile()) filePath = candidate;
    } catch {
      filePath = null;
    }

    // Client routes fall back to the SPA shell; missing assets stay 404.
    if (!filePath && !path.extname(decoded)) filePath = indexPath;

    if (!filePath) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    const type = CONTENT_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    const stream = fs.createReadStream(filePath);
    stream.on('open', () => {
      response.writeHead(200, { 'Content-Type': type });
      stream.pipe(response);
    });
    stream.on('error', () => {
      if (!response.headersSent) response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Read error');
    });
  });
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  const server = createStaticServer(options.dir);
  server.listen(options.port, options.host, () => {
    console.log(`static build served at http://${options.host}:${options.port}`);
  });
}

module.exports = { createStaticServer };
