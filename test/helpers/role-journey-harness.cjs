// Real application modules; only external services/session identity are replaced.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function createHarness(prisma) {
  const root = path.resolve(process.env.BC_TEST_SOURCE_ROOT || path.join(__dirname, '../..'));
  let actor = null;
  const sent = [], modules = new Map();
  const syntheticProcess = { env: { NEXTAUTH_URL: 'https://betterclose.example.invalid',
    ORDER_INGEST_SECRET: 'synthetic-only', AUTH_EMAIL_DRY_RUN: 'false' } };
  const mocks = {
    '@/lib/db': { prisma },
    '@/lib/aws/ses': { sendEmail: async data => { sent.push(structuredClone(data)); return 'synthetic-accepted'; } },
    '@/lib/elendCalc': { fetchElendFeeEstimate: async () => null },
    '@auth/prisma-adapter': { PrismaAdapter: () => ({}) },
    'next-auth/providers/email': options => options,
    'next-auth': { getServerSession: async () => actor ? { user: actor } : null },
    'next-auth/react': { signOut() { throw new Error('No live auth'); },
      useSession: () => ({ data: actor ? { user: actor } : null, status: actor ? 'authenticated' : 'unauthenticated' }) },
    'next/navigation': { redirect: url => { throw new Error('REDIRECT:' + url); },
      notFound() { throw new Error('NOT_FOUND'); }, useRouter: () => ({ refresh() {} }) },
    'next/link': ({ children, href, ...props }) => React.createElement('a', { ...props, href }, children),
    'next/image': ({ fill, priority, ...props }) => React.createElement('img', props),
    '@/components/NavigationCredible': () => null,
    '@/components/FooterComprehensive': () => null,
  };
  function load(file) {
    const absolute = path.resolve(root, file);
    if (!absolute.startsWith(path.join(root, 'src') + path.sep)) throw new Error('Outside source root');
    if (modules.has(absolute)) return modules.get(absolute).exports;
    const mod = { exports: {} }; modules.set(absolute, mod);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { fileName: absolute,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const localRequire = name => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (['crypto', 'react', 'react/jsx-runtime', 'next/server', 'zod', '@prisma/client'].includes(name)) return require(name);
      const candidate = name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) :
        name.startsWith('.') ? path.resolve(path.dirname(absolute), name) : null;
      if (candidate) {
        const alias = '@/' + path.relative(path.join(root, 'src'), candidate);
        if (Object.hasOwn(mocks, alias)) return mocks[alias];
        for (const extension of ['.ts', '.tsx']) if (fs.existsSync(candidate + extension)) return load(candidate + extension);
      }
      throw new Error('Unapproved test dependency: ' + name);
    };
    new Function('require', 'exports', 'module', 'process', 'fetch', code)(localRequire, mod.exports, mod,
      syntheticProcess, () => { throw new Error('Network forbidden'); });
    return mod.exports;
  }
  return { load, sent, setActor: value => { actor = value; }, render: renderToStaticMarkup };
}
module.exports = { createHarness };
