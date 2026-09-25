// Real template code, intercepted send boundary. No AWS/DB/network dependencies.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const defaultRoot = path.resolve(__dirname, '../..');

function createHarness({ root = defaultRoot, env = {}, mocks: overrides = {}, failSend = false } = {}) {
  const sent = [], cache = new Map();
  const syntheticProcess = { env: {
    NEXTAUTH_URL: 'https://betterclose.example.invalid',
    HELLO_EMAIL: 'help@example.invalid', AUTH_EMAIL_DRY_RUN: 'false',
    ...env,
  } };
  const deliver = async message => {
    if (failSend) throw new Error('Synthetic delivery refusal');
    sent.push(structuredClone(message)); return 'synthetic-message-id';
  };
  const mocks = {
    '@/lib/aws/ses': { sendEmail: deliver },
    '@/lib/db': { prisma: new Proxy({}, { get() { throw new Error('Database access forbidden'); } }) },
    '@/lib/elendCalc': { fetchElendFeeEstimate: async () => { throw new Error('Live pricing forbidden'); } },
    '@auth/prisma-adapter': { PrismaAdapter: () => ({}) },
    'next-auth/providers/email': options => options,
    '@aws-sdk/client-ses': {
      SESClient: class { async send({ input }) {
        await deliver({ to: input.Destination.ToAddresses,
          from: input.Source, subject: input.Message.Subject.Data,
          htmlBody: input.Message.Body.Html.Data, textBody: input.Message.Body.Text.Data });
        return { MessageId: 'synthetic-message-id' };
      } },
      SendEmailCommand: class { constructor(input) { this.input = input; } },
    },
    ...overrides,
  };
  function load(file) {
    const absolute = path.resolve(root, file);
    assert.ok(absolute.startsWith(path.join(root, 'src') + path.sep));
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const mod = { exports: {} }; cache.set(absolute, mod);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText;
    function localRequire(name) {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (['crypto', 'zod', '@prisma/client'].includes(name)) return require(name);
      let candidate;
      if (name.startsWith('@/')) candidate = path.join(root, 'src', name.slice(2));
      else if (name.startsWith('.')) candidate = path.resolve(path.dirname(absolute), name);
      else throw new Error('Unapproved dependency: ' + name);
      return load(candidate + '.ts');
    }
    new Function('require', 'exports', 'module', 'process', 'console', code)(
      localRequire, mod.exports, mod, syntheticProcess, { log() {}, warn() {}, error() {} });
    return mod.exports;
  }
  return { load, sent };
}

const to = 'recipient@example.invalid';
const address = '123 Example Lane, Suite 2, Austin, TX';
const dashboardUrl = 'https://betterclose.example.invalid/dashboard?file=synthetic&source=email';
const feeReport = {
  state: 'TX', homeValue: 400000, loanAmount: 320000, transactionType: 'purchase', generatedAt: '2026-09-23T00:00:00Z',
  lineItems: [{ id: 'synthetic-service', label: 'Settlement', category: 'title-settlement', ourCost: 600,
    isFixed: false, typicalRange: { low: 1000, high: 1200 }, savingsSource: 'settlement_fee' }],
};
const cases = [];
const add = (id, file, fn, data, extra = {}) => cases.push({ id, file: `src/lib/email/${file}.ts`, fn, data, ...extra });
add('welcome', 'welcome', 'sendWelcomeEmail', { borrowerEmail: to, borrowerName: 'Morgan Example', propertyAddress: address, baseUrl: 'https://betterclose.example.invalid' });
for (const role of ['lender', 'broker', 'realtor', 'unknown']) {
  add('welcome-' + role, 'welcome', 'sendWelcomeEmail', { ...cases[0].data, placingParty: { role, lenderCompany: 'Example Mortgage' } });
}
add('welcome-minimal', 'welcome', 'sendWelcomeEmail', { borrowerEmail: to, baseUrl: 'https://betterclose.example.invalid' });
for (const kind of ['loan_locked', 'title_ordered', 'title_search', 'title_issued', 'closed']) {
  add('borrower-' + kind, 'closing-update', 'sendClosingUpdateEmail', { to, borrowerFirstName: 'Morgan', milestoneKind: kind, propertyAddress: address, dashboardUrl }, { dryRun: true });
}
for (const role of ['lender', 'broker', 'realtor', 'unknown']) {
  add('teammate-' + role, 'closing-update-teammate', 'sendClosingUpdateTeammateEmail', { to, recipientFirstName: 'Alex', role, milestoneKind: 'title_ordered', propertyAddress: address, borrowerName: 'Morgan Example', teammateDashboardUrl: dashboardUrl.replace('/dashboard?', '/teammate/dashboard/synthetic?') }, { dryRun: true });
  add('invite-' + role, 'teammate-invite', 'sendTeammateInviteEmail', { email: to, role, closingId: 'synthetic/file', placingBorrowerName: 'Morgan Example', propertyAddress: address }, { dryRun: true });
}
for (const verified of [true, false]) add('portal-' + (verified ? 'verified' : 'unverified'), 'broker-portal-welcome', 'sendBrokerPortalWelcomeEmail', { email: to, memberName: 'Alex Example', brokerCompanyName: 'Example Mortgage', isVerifiedCompany: verified }, { dryRun: true });
add('portal-minimal', 'broker-portal-welcome', 'sendBrokerPortalWelcomeEmail', { email: to, isVerifiedCompany: false }, { dryRun: true });
for (const [id, fees] of [['savings', feeReport], ['no-fees', null], ['malformed', {}], ['zero', { ...feeReport, lineItems: [] }]]) {
  add('quote-' + id, 'broker-quote', 'sendBrokerQuoteEmail', { to, borrowerFirstName: 'Morgan', brokerCompanyName: 'Example Mortgage', brokerDisplayName: 'Alex Example', propertyAddress: address, feeReport: fees, publicViewUrl: 'https://betterclose.example.invalid/quote/view/synthetic?token=abc%2B123&source=email' }, { dryRun: true });
}
for (const [id, fees] of [['savings', feeReport], ['no-fees', null], ['zero', { ...feeReport, lineItems: [] }]]) {
  add('completed-' + id, 'closing-completed', 'sendClosingCompletedEmail', { to, borrowerFirstName: 'Morgan', propertyAddress: address, feeReport: fees, dashboardUrl }, { dryRun: true });
}
add('lender-request', 'lender-request', 'sendLenderRequestEmail', { lenderEmail: to, lenderFirstName: 'Alex', clientName: 'Morgan Example', clientEmail: 'borrower@example.invalid', note: 'Please review this example.', savingsEstimate: 1000, refId: 'synthetic-123', baseUrl: 'https://betterclose.example.invalid' });
add('lender-minimal', 'lender-request', 'sendLenderRequestEmail', { lenderEmail: to, refId: 'synthetic-123', baseUrl: 'https://betterclose.example.invalid' });
add('partner-referral', 'partner-referral', 'sendPartnerReferralEmail', { partnerName: 'Alex Example', partnerEmail: to, leadName: 'Morgan Example', leadEmail: 'borrower@example.invalid', leadPhone: '212-555-0100', creditBand: 'good', propertyType: 'single_family', occupancy: 'primary', requestedLoanAmount: 320000, downPaymentPct: 20, termPreference: '30_year', contactPreference: 'email', notes: 'Please contact by email.', referralId: 'SYNTHETIC-REFERRAL' });
add('partner-minimal', 'partner-referral', 'sendPartnerReferralEmail', { ...cases.at(-1).data, leadPhone: undefined, requestedLoanAmount: undefined, notes: undefined });
cases.push({ id: 'sign-in', file: 'src/lib/auth/options.ts', data: { identifier: to, url: 'https://betterclose.example.invalid/api/auth/callback/email?token=synthetic%2Btoken&email=recipient%40example.invalid&callbackUrl=%2Fdashboard', provider: { from: 'noreply@betterclose.co' } }, dryRun: true });

async function invoke(harness, spec) {
  const mod = harness.load(spec.file);
  return spec.fn ? mod[spec.fn](spec.data) : mod.authOptions.providers[0].sendVerificationRequest(spec.data);
}
async function capture(spec, options = {}) {
  const harness = createHarness(options);
  const returned = await invoke(harness, spec);
  return { ...harness, returned };
}
function decodeHtml(value) {
  return value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function contract(message) {
  const { htmlBody, ...envelope } = message;
  // The actual send adapter omits undefined optional envelope fields too.
  return { ...Object.fromEntries(Object.entries(envelope).filter(([, value]) => value !== undefined)),
    links: [...htmlBody.matchAll(/href="([^"]*)"/g)].map(m => decodeHtml(m[1])) };
}
const receiptCases = cases.filter(spec => spec.id.startsWith('welcome')).map(spec => ({
  ...spec, id: spec.id.replace('welcome', 'receipt'),
  data: { ...spec.data, purpose: 'request_received', closingId: 'synthetic-receipt' },
}));
module.exports = { createHarness, capture, invoke, cases, receiptCases, contract, decodeHtml, feeReport };
