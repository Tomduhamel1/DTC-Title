const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');
const noDb = new Proxy({}, { get() { throw new Error('Retired upload must not access the database'); } });
const expected = {
  success: false,
  code: 'INTAKE_UPLOAD_RETIRED',
  error: 'Upload documents from the Documents section of your closing file.',
  nextUrl: '/dashboard',
};

for (const route of ['upload', 'upload/confirm']) {
  test('retired intake ' + route + ' rejects every caller without inspecting a request or using storage', async () => {
    const h = createHarness(noDb);
    const { POST } = h.load('src/app/api/intake/' + route + '/route.ts');
    for (const actor of [null, { id: 'synthetic-borrower', email: 'borrower@example.invalid' },
      { id: 'synthetic-staff', email: 'staff@example.invalid' }]) {
      h.setActor(actor);
      const response = await POST(new Proxy({}, {
        get() { throw new Error('Retired upload must not read the request'); },
      }));
      assert.equal(response.status, 410);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('location'), null, 'Never forward upload bodies to another endpoint');
      assert.equal(response.headers.get('set-cookie'), null);
      assert.deepEqual(await response.json(), expected);
    }
    assert.equal(h.sent.length, 0);
  });
}

test('intake documents notice points to the authenticated workspace without asking for sensitive documents', () => {
  const h = createHarness(noDb);
  const html = h.render(React.createElement(h.load('src/components/IntakeDocumentsNotice.tsx').default));
  assert.match(html, /Documents for your closing/);
  assert.match(html, /No documents are required to finish this form/);
  assert.match(html, /sign in, choose the file, and open Documents/);
  const link = html.match(/<a\b[^>]*>/)?.[0] || '';
  assert.match(link, /href="\/dashboard"/);
  assert.match(link, /target="_blank"/);
  assert.match(link, /rel="noopener noreferrer"/);
  assert.match(html, /opens in a new tab/);
  assert.match(html, /contact your closing team to arrange document sharing/);
  assert.doesNotMatch(html, /<input|pay.stub|bank.statement|tax.return|mailto:|\/api\/intake\/upload/i);
});

test('the intake page uses the notice and no retired upload control survives', () => {
  const root = path.resolve(__dirname, '..');
  const content = fs.readFileSync(path.join(root, 'src/app/start/page.tsx'), 'utf8');
  assert.match(content, /case 'documents':\s+return <IntakeDocumentsNotice \/>/);
  assert.doesNotMatch(content, /FileUpload|setLeadId|\/api\/intake\/upload/);
  assert.equal(fs.existsSync(path.join(root, 'src/components/FileUpload.tsx')), false);
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/release-typecheck.yml'), 'utf8');
  assert.match(workflow, /node --test test\/intake-upload-retirement\.test\.cjs/);
  assert.match(workflow, /node --test test\/intake-upload-retirement\.browser\.test\.cjs/);
});
