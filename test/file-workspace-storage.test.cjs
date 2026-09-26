const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function harness() {
  const state = { env: { BC_DOCUMENTS_ENABLED: 'true', BC_DOCUMENT_BUCKET: 'synthetic-private' }, commands: [], signed: [], reply: {} };
  class Command { constructor(input) { this.input = input; } }
  class S3Client { async send(command) { state.commands.push(command.input); return state.replies?.length ? state.replies.shift() : state.reply; } }
  class WorkspaceError extends Error { constructor(status, msg, code) { super(msg); this.status = status; this.code = code; } }
  const mocks = { '@aws-sdk/client-s3': { S3Client, PutObjectCommand: Command, HeadObjectCommand: Command, GetObjectTaggingCommand: Command, GetObjectCommand: Command },
    '@aws-sdk/s3-request-presigner': { getSignedUrl: async (_, command, options) => { state.signed.push({ input: command.input, options }); return 'https://synthetic.invalid'; } },
    './access': { WorkspaceError } };
  const code = ts.transpileModule(fs.readFileSync('src/lib/fileWorkspace/storage.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'exports', 'process', code)(name => { if (!mocks[name]) throw Error('No live dependencies'); return mocks[name]; }, module.exports, { env: state.env });
  return { ...module.exports, state };
}
const input = { key: 'closing-documents/synthetic/object', size: 4, mimeType: 'application/pdf', sha256: 'a'.repeat(64) };
test('private upload signing locks size/checksum/content type/encryption and prevents replacement', async () => {
  const h = harness(); const result = await h.signUpload(input); const signed = h.state.signed[0];
  assert.equal(signed.input.Bucket, 'synthetic-private'); assert.equal(signed.input.ContentLength, 4);
  assert.equal(signed.input.IfNoneMatch, '*'); assert.equal(signed.input.ChecksumSHA256, Buffer.from(input.sha256, 'hex').toString('base64'));
  assert.equal(result.headers['If-None-Match'], '*'); assert.equal(signed.options.expiresIn, 300);
  assert.ok(signed.options.signableHeaders.has('content-type'));
});
test('confirmation refuses wrong checksum, size, content type and unversioned objects', async () => {
  const h = harness(); const valid = { TagSet: [{ Key: 'GuardDutyMalwareScanStatus', Value: 'NO_THREATS_FOUND' }], ContentLength: 4, ContentType: input.mimeType, ChecksumSHA256: Buffer.from(input.sha256, 'hex').toString('base64'), VersionId: 'version-1' };
  for (const delta of [{ ContentLength: 5 }, { ContentType: 'text/html' }, { ChecksumSHA256: 'wrong' }, { VersionId: undefined }, { VersionId: 'null' }]) {
    h.state.reply = { ...valid, ...delta }; await assert.rejects(h.verifyUpload(input), e => e.status === 409);
  }
  h.state.reply = valid; assert.equal(await h.verifyUpload(input), 'version-1');
  assert.equal(h.state.commands.at(-1).VersionId, 'version-1');
});
test('confirmation distinguishes pending/failed scans and never tries HEAD before a clean version', async () => {
  const h = harness(); h.state.reply = { VersionId: 'version-1', TagSet: [] };
  await assert.rejects(h.verifyUpload(input), e => e.status === 409 && e.code === 'DOCUMENT_SCAN_PENDING');
  assert.equal(h.state.commands.length, 1); assert.equal(h.state.signed.length, 0);
  for (const scan of ['THREATS_FOUND', 'UNSUPPORTED', 'ACCESS_DENIED', 'FAILED', 'UNEXPECTED_STATUS']) {
    h.state.reply = { VersionId: 'version-1', TagSet: [{ Key: 'GuardDutyMalwareScanStatus', Value: scan }] };
    const before = h.state.commands.length;
    await assert.rejects(h.verifyUpload(input), e => e.status === 409 && e.code === 'DOCUMENT_SCAN_FAILED');
    assert.equal(h.state.commands.length, before + 1); assert.equal(h.state.signed.length, 0);
  }
});
test('confirmation pins HEAD to the attested version and rejects a mismatched returned version', async () => {
  const h = harness(); h.state.replies = [
    { VersionId: 'clean-1', TagSet: [{ Key: 'GuardDutyMalwareScanStatus', Value: 'NO_THREATS_FOUND' }] },
    { VersionId: 'other-2', ContentLength: 4, ContentType: input.mimeType, ChecksumSHA256: Buffer.from(input.sha256, 'hex').toString('base64') },
  ];
  await assert.rejects(h.verifyUpload(input), e => e.status === 409);
  assert.equal(h.state.commands.at(-1).VersionId, 'clean-1');
});
test('only successful malware scan on the exact version permits a 60 second attachment download', async () => {
  const h = harness(); const download = { key: input.key, version: 'immutable-1', fileName: 'synthetic.pdf' };
  for (const scan of [undefined, 'THREATS_FOUND', 'UNSUPPORTED', 'ACCESS_DENIED', 'FAILED']) {
    h.state.reply = { TagSet: scan ? [{ Key: 'GuardDutyMalwareScanStatus', Value: scan }] : [] };
    await assert.rejects(h.signDownload(download), e => e.status === 409);
  }
  assert.equal(h.state.signed.length, 0);
  h.state.reply = { TagSet: [{ Key: 'GuardDutyMalwareScanStatus', Value: 'NO_THREATS_FOUND' }] };
  await h.signDownload(download); assert.equal(h.state.commands.at(-1).VersionId, 'immutable-1');
  assert.equal(h.state.signed[0].input.VersionId, 'immutable-1'); assert.equal(h.state.signed[0].options.expiresIn, 60);
  assert.match(h.state.signed[0].input.ResponseContentDisposition, /^attachment/);
});
test('disabled or missing dedicated bucket never falls back to the public assets bucket', async () => {
  const h = harness(); h.state.env.BC_DOCUMENT_BUCKET = ''; h.state.env.APP_AWS_S3_BUCKET = 'public-headshots';
  await assert.rejects(h.signUpload(input), e => e.status === 503); assert.equal(h.state.signed.length, 0);
});

test('previews allow only clean exact-version PDFs/images inline and retain private 60 second expiry', async () => {
  const h = harness(); const input = { key: 'synthetic/key', version: 'v1', fileName: 'document.pdf' };
  for (const mime of ['text/html', 'image/svg+xml', 'text/plain'])
    await assert.rejects(h.signDownload({ ...input, previewMimeType: mime }), e => e.status === 400);
  assert.equal(h.state.commands.length, 0);
  await assert.rejects(h.signDownload({ ...input, previewMimeType: 'application/pdf' }), e => e.status === 409);
  assert.equal(h.state.signed.length, 0);
  h.state.reply = { TagSet: [{ Key: 'GuardDutyMalwareScanStatus', Value: 'NO_THREATS_FOUND' }] };
  for (const mime of ['application/pdf', 'image/png', 'image/jpeg']) {
    await h.signDownload({ ...input, previewMimeType: mime });
    const signed = h.state.signed.at(-1);
    assert.equal(signed.input.ResponseContentType, mime); assert.match(signed.input.ResponseContentDisposition, /^inline;/);
    assert.equal(signed.input.VersionId, 'v1'); assert.equal(signed.input.ResponseCacheControl, 'private, no-store');
    assert.equal(signed.options.expiresIn, 60);
  }
});

test('installed AWS SDK actually signs the overwrite guard, content type, size and checksum headers (offline)', async () => {
  const code = ts.transpileModule(fs.readFileSync('src/lib/fileWorkspace/storage.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const output = {};
  new Function('require', 'exports', 'process', code)(name => {
    if (name === './access') return { WorkspaceError: Error };
    if (!['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'].includes(name)) throw Error('Unexpected dependency');
    return require(name);
  }, output, { env: { BC_DOCUMENTS_ENABLED: 'true', BC_DOCUMENT_BUCKET: 'synthetic-private', APP_AWS_REGION: 'us-east-1',
    APP_AWS_ACCESS_KEY_ID: 'synthetic-not-a-real-key', APP_AWS_SECRET_ACCESS_KEY: 'synthetic-not-a-real-secret' } });
  const result = await output.signUpload(input);
  const headers = new URL(result.url).searchParams.get('X-Amz-SignedHeaders').split(';');
  for (const header of ['if-none-match', 'content-type', 'content-length', 'x-amz-checksum-sha256', 'x-amz-server-side-encryption']) assert.ok(headers.includes(header), header);
});
