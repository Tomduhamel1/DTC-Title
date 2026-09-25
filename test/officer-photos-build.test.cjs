const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function jsFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? jsFiles(file) : file.endsWith('.js') ? [file] : [];
  });
}

test('production build keeps the complete EO directory on the server, not in public browser chunks', () => {
  const root = path.resolve(__dirname, '..');
  const clients = jsFiles(path.join(root, '.next/static'));
  const servers = jsFiles(path.join(root, '.next/server'));
  assert.ok(clients.length && servers.length, 'Run the real production build first');
  const directory = /kdeyton@firstnte\.com|steve@firstnte\.com|nmicciche@firstnte\.com|barrington@firstnte\.com/;
  assert.deepEqual(clients.filter(file => directory.test(fs.readFileSync(file, 'utf8'))), []);
  assert.ok(servers.some(file => directory.test(fs.readFileSync(file, 'utf8'))), 'Resolver must be present in the deployed server code');
});
