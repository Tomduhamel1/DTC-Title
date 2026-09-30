// Exercise the real shared header. Only auth, routing and the share service are
// isolated; no credentials, live session, database, email or external requests.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { build } = require('esbuild');
const { openEmailBrowser } = require('./helpers/email-browser.cjs');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/components/NavigationCredible.tsx'), 'utf8');
const mocks = {
  'next/navigation': `export const usePathname=()=>window.navPath || '/for-lenders';`,
  'next-auth/react': `import React from 'react'; export const Auth=React.createContext({status:'loading'}); export const useSession=()=>React.useContext(Auth); export const signOut=options=>window.actions.push(['signOut',options]);`,
  'next/link': `import React from 'react'; export default function Link({href,onClick,children,...props}) {return <a {...props} href={href} onClick={event=>{event.preventDefault();window.actions.push(['route',href]);onClick?.(event)}}>{children}</a>}`,
  './lender-request/ShareWithTeamSheet': `import React from 'react'; export default ({open,onClose,source})=>open?<div role="dialog" aria-label="Share with team" data-source={source}><button onClick={onClose}>Close sharing</button></div>:null;`,
};
const code = build({ stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import {Auth} from 'next-auth/react'; import Nav from './src/components/NavigationCredible';
  window.actions=[]; const root=createRoot(document.getElementById('root')); window.mount=status=>root.render(<Auth.Provider value={{status,data:status==='authenticated'?{user:{email:'synthetic@example.invalid'}}:null}}><Nav /></Auth.Provider>);`,
  resolveDir: root, sourcefile: 'synthetic-nav.tsx', loader: 'tsx' }, bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"development"' }, plugins: [{name:'isolated-services',setup(build) {
    build.onResolve({filter:/.*/}, args => Object.hasOwn(mocks,args.path)?{path:args.path,namespace:'nav-mock'}:null);
    build.onLoad({filter:/.*/,namespace:'nav-mock'}, args=>({contents:mocks[args.path],loader:'tsx',resolveDir:root}));
  }}] }).then(result=>result.outputFiles[0].text);

test('marketing pages share one header and internal links use client navigation', async () => {
  assert.ok((await code).length > 0, 'Offline header fixture compiles');
  for (const file of ['src/components/HomePageCredible.tsx', 'src/app/for-brokers/page.tsx', 'src/app/for-realtors/page.tsx', 'src/app/for-lenders/page.tsx', 'src/app/security/page.tsx']) {
    const page = fs.readFileSync(path.join(root,file),'utf8');
    assert.equal((page.match(/<NavigationCredible\s*\/>/g)||[]).length,1,file);
  }
  assert.match(source, /import Link from 'next\/link'/);
  assert.doesNotMatch(source, /<a\s[^>]*href=["']\//, 'No full-page reloads for internal header links');
  for (const href of ['/#how-it-works','/for-brokers','/for-realtors','/for-lenders','/security']) assert.ok(source.includes(href));
});

test('header geometry is stable through session resolution at every responsive breakpoint', async () => {
  const css = await require('postcss')([require('tailwindcss')(require('tailwindcss/loadConfig')(path.join(root,'tailwind.config.ts')))])
    .process('@tailwind base; @tailwind components; @tailwind utilities;', {from:undefined});
  const browser = await openEmailBrowser();
  const denied=[];
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request',req=>{
      if (req.url()==='https://preview.example.invalid/images/marketing/nicole-operator-v1.webp') return req.respond({status:200,contentType:'image/webp',body:fs.readFileSync(path.join(root,'public/images/marketing/nicole-operator-v1.webp'))});
      denied.push(req.url()); return req.abort();
    });
    await page.setContent('<!doctype html><html><head><base href="https://preview.example.invalid"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css.css+'</style></head><body><div id="root"></div><main style="padding-top:100px">Synthetic page</main></body></html>');
    await page.addScriptTag({content:await code});
    const mount = async state => { await page.evaluate(s=>window.mount(s),state); await page.waitForFunction(s=>s==='loading'?!!document.querySelector('[aria-label="Loading account"]'):s==='authenticated'?document.querySelector('[data-nav-account]').textContent.includes('My dashboard'):document.querySelector('[data-nav-account]').textContent.includes('Send to my team'),{},state); };
    for (const width of [320,375,639,640,768,1024,1279,1280,1440,1536]) {
      await page.setViewport({width,height:900});
      let baseline;
      for (const state of ['loading','unauthenticated','authenticated','loading','authenticated']) {
        await mount(state);
        const facts = await page.evaluate(()=>{
          const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
          const header=document.querySelector('[data-bc-marketing-nav]');
          return {width:document.documentElement.scrollWidth,height:header.getBoundingClientRect().height,
            slots:['logo','links','actions','login','phone','account'].map(key=>({key,...rect(document.querySelector('[data-nav-'+key+']'))})),
            labels:[...header.querySelectorAll('[data-nav-links] a span,[data-nav-login] a,[data-nav-account] button')].filter(e=>e.getBoundingClientRect().width).map(e=>({text:e.textContent,lines:e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})),
            tabs:[...header.querySelectorAll('[data-nav-links] a')].filter(e=>e.getBoundingClientRect().width).map(e=>({left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,height:e.getBoundingClientRect().height,border:getComputedStyle(e).borderTopWidth,background:getComputedStyle(e).backgroundColor})),
            wordmarkCenter:(()=>{const r=header.querySelector('[data-nav-logo] text').getBoundingClientRect();return r.y+r.height/2})(),
            menuVisible:document.querySelector('[aria-controls="marketing-mobile-menu"]').getBoundingClientRect().width>0};
        });
        assert.equal(facts.width,width,`${width}/${state}: no horizontal overflow`);
        assert.equal(facts.height,80,`${width}/${state}: constant header height`);
        assert.ok(Math.abs(facts.wordmarkCenter-40)<0.5,`${width}/${state}: logo text centered, not just its SVG box`);
        assert.equal(facts.menuVisible,width<1280);
        if (!baseline) baseline=facts.slots; else assert.deepEqual(facts.slots,baseline,`${width}/${state}: account resolution must not move any nav group`);
        for (const label of facts.labels) {
          assert.ok(label.left>=0 && label.right<=width,`${width}: ${label.text} fits`);
          // Account buttons are a deliberate 44px touch target; links stay one line.
          if (!/dashboard|team|Account/.test(label.text)) assert.equal(label.lines,1,`${width}: ${label.text} must not wrap`);
        }
        for (let index=0;index<facts.tabs.length;index++) {
          const tab=facts.tabs[index];
          assert.equal(tab.height,40,'Tab-sized target, not bare inline text');
          assert.equal(tab.border,'1px','Each tab has a visible boundary');
          assert.notEqual(tab.background,'rgba(0, 0, 0, 0)','Each tab has a distinct surface');
          if (index) assert.ok(tab.left-facts.tabs[index-1].right>=4,'Separate tab surfaces never touch');
        }
      }
    }
    await page.setViewport({width:1280,height:900}); await mount('authenticated');
    for (const route of ['/for-lenders','/for-brokers','/for-realtors','/security','/']) {
      await page.evaluate(path=>{window.navPath=path},route); await mount('authenticated');
      await page.waitForFunction(path=>path==='/'?document.querySelectorAll('[data-nav-links] [aria-current]').length===0:document.querySelector('[data-nav-links] [aria-current]')?.getAttribute('href')===path,{},route);
      const current=await page.$$eval('[data-nav-links] [aria-current="page"]',els=>els.map(e=>e.getAttribute('href')));
      assert.deepEqual(current,route==='/'?[]:[route]);
    }
    await page.click('[aria-controls="marketing-account-menu"]');
    await page.waitForSelector('#marketing-account-menu');
    assert.equal(await page.$eval('[aria-controls="marketing-account-menu"]',e=>e.getAttribute('aria-expanded')),'true');
    await page.click('#marketing-account-menu a[href="/settings"]');
    assert.deepEqual(await page.evaluate(()=>window.actions.at(-1)),['route','/settings']);
    await page.keyboard.press('Escape'); await page.waitForSelector('#marketing-account-menu',{hidden:true});
    await mount('unauthenticated'); await page.click('[data-nav-account] button');
    await page.waitForSelector('[role="dialog"]');
    assert.equal(await page.$eval('[role="dialog"]',e=>e.dataset.source),'nav_cta');
    await page.click('[role="dialog"] button');
    await page.setViewport({width:375,height:900});
    await page.click('[aria-controls="marketing-mobile-menu"]'); await page.waitForSelector('#marketing-mobile-menu');
    for (const href of ['/#how-it-works','/for-brokers','/for-realtors','/for-lenders','/security','/login']) assert.ok(await page.$('#marketing-mobile-menu a[href="'+href+'"]'));
    await page.click('#marketing-mobile-menu a[href="/for-lenders"]');
    await page.waitForSelector('#marketing-mobile-menu',{hidden:true});
    assert.deepEqual(await page.evaluate(()=>window.actions.at(-1)),['route','/for-lenders']);
    await page.click('[aria-controls="marketing-mobile-menu"]');
    await page.click('#marketing-mobile-menu button'); await page.waitForSelector('[role="dialog"]');
    await page.click('[role="dialog"] button'); await mount('authenticated');
    await page.click('[aria-controls="marketing-mobile-menu"]');
    assert.ok(await page.$('#marketing-mobile-menu a[href="/settings"]'));
    await page.click('#marketing-mobile-menu button');
    assert.deepEqual(await page.evaluate(()=>window.actions.at(-1)),['signOut',{callbackUrl:'/'}]);
    assert.deepEqual(denied,[]);
  } finally {await browser.close()}
});
