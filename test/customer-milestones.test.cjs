const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { createHarness } = require('./helpers/role-journey-harness.cjs');

const forbiddenDb = new Proxy({}, { get() { throw new Error('Database access forbidden'); } });
const h = createHarness(forbiddenDb);
const { MILESTONE_KINDS } = h.load('src/lib/closing.ts');
const { CUSTOMER_MILESTONE_KINDS, customerMilestoneProgress } = h.load('src/lib/closing/customerMilestones.ts');
const Timeline = h.load('src/components/dashboard/MilestoneTimeline.tsx').default;
const text = html => html.replace(/<[^>]*>/g, '').replace(/<!--.*?-->/g, '');
const rows = (loanStatus, completed = 1) => MILESTONE_KINDS.map(kind => Object.freeze({
  kind, status: kind === 'loan_locked' ? loanStatus
    : CUSTOMER_MILESTONE_KINDS.indexOf(kind) < completed ? 'done' : 'pending',
}));

test('title presentation is four ordered stages, without altering the legacy integration contract', () => {
  assert.deepEqual(CUSTOMER_MILESTONE_KINDS, ['title_ordered', 'title_search', 'title_issued', 'closed']);
  assert.deepEqual(MILESTONE_KINDS, ['loan_locked', ...CUSTOMER_MILESTONE_KINDS]);
});

for (const loanStatus of ['pending', 'active', 'done']) {
  test(`timeline ignores a ${loanStatus} loan lock in labels, completion and progress`, () => {
    for (let completed = 0; completed <= 4; completed++) {
      const milestones = Object.freeze(rows(loanStatus, completed).reverse());
      const progress = customerMilestoneProgress(milestones);
      assert.equal(progress.doneCount, completed);
      assert.equal(progress.totalCount, 4);
      assert.equal(progress.fillPct, completed * 25);
      assert.equal(progress.activeMilestone, undefined);
      const html = h.render(React.createElement(Timeline, { milestones }));
      assert.doesNotMatch(html, /loan.locked|interest rate|of 5/i);
      assert.equal((html.match(/<li /g) || []).length, 4);
      assert.ok(html.includes(`height:${completed * 25}%`));
      assert.ok(text(html).includes(completed === 0 ? 'Ready when your closing team opens the order'
        : completed === 4 ? 'Closed!' : `${completed} of 4 milestones complete`));
      const labels = ['Title ordered', 'Title search complete', 'Title issued', 'Closed'];
      const list = html.slice(html.indexOf('<ol'));
      assert.deepEqual(labels.map(label => list.indexOf(label)).slice().sort((a, b) => a - b), labels.map(label => list.indexOf(label)));
    }
  });
}

test('missing, unknown and duplicate rows cannot invent progress or make it exceed 100%', () => {
  const missing = h.render(React.createElement(Timeline, { milestones: [] }));
  assert.equal((missing.match(/<li /g) || []).length, 4);
  assert.ok(missing.includes('height:0%'));
  const milestones = [...rows('done', 4), { kind: 'unknown', status: 'done' }, { kind: 'title_ordered', status: 'done' }];
  assert.equal(customerMilestoneProgress(milestones).fillPct, 100);
  assert.equal(customerMilestoneProgress([{ kind: 'unknown', status: 'active' }]).activeMilestone, undefined);
});

test('title active stage is selected in title order, never from the hidden loan row', () => {
  const milestones = [
    { kind: 'loan_locked', status: 'active' },
    { kind: 'title_issued', status: 'active' },
    { kind: 'title_search', status: 'active' },
    { kind: 'title_ordered', status: 'done' },
  ];
  assert.equal(customerMilestoneProgress(milestones).activeMilestone.kind, 'title_search');
  const html = h.render(React.createElement(Timeline, { milestones }));
  assert.ok(text(html).includes('1 of 4 milestones complete'));
  assert.doesNotMatch(html, /Loan locked/);
});

function pageHarness(milestones) {
  // Distinct role identities; never reuse the Pro's identity for the EO or borrower.
  const actor = { id: 'synthetic-pro', name: 'Synthetic Lender', email: 'pro@example.invalid' };
  const closing = { id: 'synthetic-closing', userId: 'synthetic-borrower', status: 'active',
    borrowerEmail: 'borrower@example.invalid', propertyAddress: '123 Synthetic Lane',
    escrowOfficerName: 'Synthetic Escrow Officer', escrowOfficerEmail: 'eo@example.invalid',
    milestones, teammates: [], updatedAt: new Date('2026-09-24T00:00:00Z') };
  const membership = { id: 'synthetic-membership', role: 'lender', userId: actor.id,
    closingId: closing.id, closing, muted: false, mayManageBorrowerEmails: false };
  const calls = [];
  const guard = methods => new Proxy(methods, { get(target, key) {
    if (!Object.hasOwn(target, key)) throw new Error('Unexpected database operation: ' + String(key));
    return target[key];
  } });
  const db = guard({
    user: guard({ findUnique: async ({ where }) => ({ ...actor, id: where.id, accountType: 'professional',
      brokerMemberships: [{ id: 'synthetic-broker-membership', role: 'member', createdAt: new Date(),
        company: { id: 'synthetic-company', name: 'Synthetic Brokerage', slug: 'synthetic', verifiedAt: null } }] }) }),
    teammateClosing: guard({
      // Existing dashboard orphan-claim operation is intercepted, never executed.
      updateMany: async input => { calls.push(input); return { count: 0 }; },
      findMany: async ({ where }) => { assert.equal(where.userId, actor.id); return [membership]; },
      findFirst: async ({ where }) => where.userId === actor.id && where.closingId === closing.id ? membership : null,
    }),
    lenderRequest: guard({ findFirst: async () => null }),
  });
  const p = createHarness(db); p.setActor(actor);
  return { p, closing, actor, calls };
}

for (const loanStatus of ['pending', 'active', 'done']) {
  test(`real Pro file list, pipeline and detail exclude a ${loanStatus} loan milestone`, async () => {
    const { p, closing, actor, calls } = pageHarness(rows(loanStatus));
    const list = p.load('src/app/teammate/dashboard/page.tsx').default;
    const pipeline = p.load('src/app/teammate/pipeline/page.tsx').default;
    const detail = p.load('src/app/teammate/dashboard/[closingId]/page.tsx').default;
    for (const [page, props] of [[list, {}], [pipeline, undefined], [detail, { params: Promise.resolve({ closingId: closing.id }) }]]) {
      const html = p.render(await page(props));
      assert.doesNotMatch(html, /Loan locked|of 5|40%/);
      if (page !== list) assert.ok(html.includes('25%'));
      assert.ok(text(html).includes('1 of 4') || text(html).includes('1/4'));
    }
    assert.deepEqual(calls, [{ where: { userId: null, matchedEmail: actor.email }, data: { userId: actor.id } }]);
    assert.equal(p.sent.length, 0);
    p.setActor(null);
    await assert.rejects(list({}), /REDIRECT:\/login/);
    await assert.rejects(pipeline(), /REDIRECT:\/login/);
    await assert.rejects(detail({ params: Promise.resolve({ closingId: closing.id }) }), /REDIRECT:\/login/);
  });
}

test('real Pro summary labels honor a visible active stage instead of an active loan lock', async () => {
  const milestones = rows('active').map(row => row.kind === 'title_search' ? { ...row, status: 'active' } : row);
  const { p } = pageHarness(milestones);
  for (const file of ['src/app/teammate/dashboard/page.tsx', 'src/app/teammate/pipeline/page.tsx']) {
    const html = p.render(await p.load(file).default({}));
    assert.ok(text(html).includes('Title search complete'));
    assert.doesNotMatch(html, /Loan locked/);
    if (file.includes('/pipeline/')) assert.ok(html.includes('25%'));
  }
});

test('customer marketing previews no longer advertise the removed stage', () => {
  const files = ['src/components/DashboardTrustSection.tsx', 'src/components/lender-portal/TeammateAccountInvite.tsx',
    'src/components/HowItWorksSection.tsx', 'src/app/for-my-team/page.tsx'];
  for (const file of files) assert.doesNotMatch(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), /loan.locked/i);
  const html = h.render(React.createElement(h.load(files[0]).default));
  assert.ok(text(html).includes('2 of 4 milestones complete'));
  assert.doesNotMatch(html, /Loan locked/);
});
