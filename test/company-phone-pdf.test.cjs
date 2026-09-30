const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

for (const role of ['agents', 'brokers']) test(`${role} downloadable PDF has only the approved company phone`, () => {
  const file = path.resolve(__dirname, `../public/pdfs/betterclose-for-${role}.pdf`);
  const text = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' });
  assert.match(text, /888-378-0745/);
  assert.doesNotMatch(text, /800[-. ]?316[-. ]?9508|\(401\) 847-3080|SUPPORT PHONE TBD/);
});
