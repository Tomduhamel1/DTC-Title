// Dependency-isolated runtime checks. No network, database or email clients.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
assert.equal(parsed.errors.length, 0);

function loader(mocks = {}) {
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(root, file);
    assert.ok(absolute.startsWith(path.join(root, 'src') + path.sep));
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const mod = { exports: {} };
    cache.set(absolute, mod);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
      compilerOptions: { ...parsed.options, module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX, noEmit: false },
      fileName: absolute,
    }).outputText;
    const localRequire = name => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (['react', 'react/jsx-runtime'].includes(name)) return require(name);
      let candidate;
      if (name.startsWith('@/')) candidate = path.join(root, 'src', name.slice(2));
      else if (name.startsWith('.')) candidate = path.resolve(path.dirname(absolute), name);
      else throw new Error('Unapproved dependency: ' + name);
      for (const extension of ['.ts', '.tsx']) {
        if (fs.existsSync(candidate + extension)) return load(candidate + extension);
      }
      throw new Error('Unapproved source import: ' + name);
    };
    new Function('require', 'exports', 'module', code)(localRequire, mod.exports, mod);
    return mod.exports;
  }
  return load;
}

test('milestone timeline accepts JSON metadata without displaying internal metadata', () => {
  const load = loader({ '@/lib/db': { prisma: new Proxy({}, {
    get() { throw new Error('Database access forbidden in this test'); },
  }) } });
  const { MILESTONE_KINDS } = load('src/lib/closing.ts');
  const Timeline = load('src/components/dashboard/MilestoneTimeline.tsx').default;
  for (const metadata of [null, 'private-marker', 123, true, { internal: 'private-marker' }, ['private-marker']]) {
    const html = renderToStaticMarkup(React.createElement(Timeline, {
      milestones: MILESTONE_KINDS.map((kind) => ({
        kind, status: kind === 'title_ordered' ? 'done' : 'pending', metadata,
      })),
    }));
    assert.match(html, /1 of 4 milestones complete/);
    assert.doesNotMatch(html, /private-marker/);
  }
});

test('legacy calculator reads actual closing-cost fields, not absent price fields', () => {
  const fixture = { totalSavings: 111, averageClosingCost: 8765, estimatedClosingCost: 8654 };
  const load = loader({
    '@/contexts/SavingsContext': { useSavings: () => ({ savings: fixture, setSavings() {} }) },
    '@/lib/savingsCalculator': { getInitialSavings() { throw new Error('Effects should not run during SSR'); } },
  });
  const Hero = load('src/components/HeroOptionB.tsx').default;
  const html = renderToStaticMarkup(React.createElement(Hero));
  assert.match(html, /\$8,765/);
  assert.match(html, /\$8,654/);
  assert.match(html, /Illustrative average closing costs/);
  assert.match(html, /Estimated closing costs/);
  assert.doesNotMatch(html, /NaN|undefined|on title insurance/);
});

test('fee grouping preserves category order and removes empty Map entries', () => {
  const { groupByCategory } = loader()('src/lib/feeReport.ts');
  const items = [
    { id: 'other', category: 'other', ourCost: -50, isFixed: false },
    { id: 'settlement-a', category: 'title-settlement', ourCost: 100, isFixed: false },
    { id: 'settlement-b', category: 'title-settlement', ourCost: 200, isFixed: false },
  ];
  const grouped = groupByCategory(items);
  assert.deepEqual([...grouped.keys()], ['title-settlement', 'other']);
  assert.deepEqual(grouped.get('title-settlement'), items.slice(1));
  assert.equal(groupByCategory([]).size, 0);
});

test('rate limit still enforces the window when Map cleanup runs', () => {
  const { rateLimit } = loader()('src/lib/rate-limit.ts');
  const originalNow = Date.now;
  const originalRandom = Math.random;
  let now = 1000;
  Date.now = () => now;
  Math.random = () => 0; // Exercise the iterator cleanup on every insert.
  try {
    assert.equal(rateLimit('one', 2, 100).remaining, 1);
    assert.equal(rateLimit('one', 2, 100).remaining, 0);
    assert.equal(rateLimit('one', 2, 100).ok, false);
    now = 1100;
    assert.equal(rateLimit('two', 2, 100).ok, true);
    assert.equal(rateLimit('one', 2, 100).remaining, 1);
    assert.equal(rateLimit('one', 2, 100).remaining, 0);
    assert.equal(rateLimit('one', 2, 100).ok, false);
  } finally {
    Date.now = originalNow;
    Math.random = originalRandom;
  }
});

test('production build does not bypass TypeScript errors', () => {
  const config = require('../next.config.js');
  assert.notEqual(config.typescript?.ignoreBuildErrors, true);
});
