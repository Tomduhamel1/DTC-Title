// Actual application helpers and installed SDK serializers/signers, with a
// synthetic in-memory HTTP boundary. No request can reach AWS or a mailbox.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const ses = require('@aws-sdk/client-ses');
const s3 = require('@aws-sdk/client-s3');
const presigner = require('@aws-sdk/s3-request-presigner');
const { createHarness } = require('./helpers/email-capture.cjs');
const env = {
  APP_AWS_REGION: 'us-east-1', APP_AWS_ACCESS_KEY_ID: 'synthetic-access-key',
  APP_AWS_SECRET_ACCESS_KEY: 'synthetic-secret-key',
  APP_AWS_SES_FROM_EMAIL: 'noreply@example.invalid', AWS_S3_BUCKET: 'synthetic-test-bucket',
};

function sesHarness(reject = false) {
  const requests = [];
  const h = createHarness({ env, mocks: {
    '@aws-sdk/client-ses': { ...ses, SESClient: class extends ses.SESClient {
      constructor(config) {
        super({ ...config, maxAttempts: 1, requestHandler: { async handle(request) {
          requests.push(request);
          return { response: { statusCode: reject ? 400 : 200, headers: { 'content-type': 'text/xml' },
            body: Buffer.from(reject
              ? '<ErrorResponse><Error><Type>Sender</Type><Code>MessageRejected</Code><Message>Synthetic refusal</Message></Error><RequestId>synthetic</RequestId></ErrorResponse>'
              : '<SendEmailResponse><SendEmailResult><MessageId>synthetic-accepted</MessageId></SendEmailResult><ResponseMetadata><RequestId>synthetic</RequestId></ResponseMetadata></SendEmailResponse>') } };
        } } });
      }
    } },
  } });
  return { sendEmail: h.load('src/lib/aws/ses.ts').sendEmail, requests };
}

test('actual SES helper preserves Pro recipient, EO Reply-To and message content', async () => {
  const h = sesHarness();
  assert.equal(await h.sendEmail({ to: 'pro@example.invalid', replyTo: 'eo@example.invalid',
    subject: 'Synthetic opening', htmlBody: '<p>Meet your officer.</p>', textBody: 'Meet your officer.' }), 'synthetic-accepted');
  assert.equal(h.requests.length, 1);
  const body = new URLSearchParams(h.requests[0].body);
  assert.equal(body.get('Action'), 'SendEmail');
  assert.equal(body.get('Source'), 'BetterClose <noreply@example.invalid>');
  assert.equal(body.get('Destination.ToAddresses.member.1'), 'pro@example.invalid');
  assert.equal(body.get('ReplyToAddresses.member.1'), 'eo@example.invalid');
  assert.equal(body.get('Message.Subject.Data'), 'Synthetic opening');
  assert.equal(body.get('Message.Body.Html.Data'), '<p>Meet your officer.</p>');
  assert.equal(body.get('Message.Body.Text.Data'), 'Meet your officer.');
  assert.equal(body.has('Destination.CcAddresses.member.1'), false);
  assert.equal(body.has('Destination.BccAddresses.member.1'), false);
});

test('actual SES helper propagates provider refusal instead of reporting success', async () => {
  const h = sesHarness(true);
  await assert.rejects(h.sendEmail({ to: 'pro@example.invalid', subject: 'Synthetic', htmlBody: '<p>Test</p>' }),
    { name: 'MessageRejected' });
  assert.equal(h.requests.length, 1);
});

test('actual upload helper produces a bounded signed URL without a network call', async () => {
  const h = createHarness({ env, mocks: {
    '@aws-sdk/client-s3': { ...s3, S3Client: class extends s3.S3Client {
      constructor(config) {
        super({ ...config, requestHandler: { async handle() { throw new Error('Network forbidden'); } } });
      }
    } },
    '@aws-sdk/s3-request-presigner': presigner,
  } });
  const { generateUploadUrl } = h.load('src/lib/aws/upload.ts');
  const result = await generateUploadUrl({ leadId: 'synthetic-lead', fileName: 'Example File.pdf',
    fileType: 'application/pdf', documentType: 'contract' });
  const url = new URL(result.uploadUrl);
  assert.equal(url.hostname, 'synthetic-test-bucket.s3.us-east-1.amazonaws.com');
  assert.equal(url.pathname, '/' + result.key);
  assert.match(result.key, /^leads\/synthetic-lead\/contract\/.+-Example_File\.pdf$/);
  assert.equal(result.expiresIn, 300);
  assert.equal(url.searchParams.get('X-Amz-Expires'), '300');
  assert.match(url.searchParams.get('X-Amz-Credential'), /^synthetic-access-key\//);
  assert.ok(url.searchParams.get('X-Amz-Signature'));
});
