const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const disclosure = require('../src/lib/marketing-disclosure.json');

for (const name of ['betterclose-for-agents', 'betterclose-for-brokers', 'betterclose-closing-comparison-guide']) {
  test(`${name}: published PDF has the disclosure and no blanket rating boast`, () => {
    const file = path.resolve(__dirname, `../public/pdfs/${name}.pdf`);
    const text = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' }).replace(/\s+/g, ' ');
    const info = execFileSync('pdfinfo', [file], { encoding: 'utf8' });
    assert.match(info, /^Pages:\s+1\s*$/m);
    assert.doesNotMatch(text, /\bA\+?[\s\u002d\u2010-\u2015]*(?:rated|rating)\b|rated A(?:\+| or higher)?\b/i);
    for (const phrase of Object.values(disclosure)) assert.ok(text.includes(phrase), `${name}: missing ${phrase}`);
  });
}
