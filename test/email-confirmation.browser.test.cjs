const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {build}=require('esbuild');
const {openEmailBrowser}=require('./helpers/email-browser.cjs');
const root=path.resolve(__dirname,'..');
const origin='https://betterclose.example.invalid';
const fields={token:'a'.repeat(64),email:'synthetic-staff@example.invalid',callbackUrl:'/admin'};

test('script-executing previews never submit; a human click submits once by POST without URL credentials',async()=>{
  const script=await build({stdin:{contents:`import React from 'react'; import {createRoot} from 'react-dom/client';
    import Confirm from './src/app/login/confirm/ConfirmSignIn';
    createRoot(document.getElementById('root')).render(<React.StrictMode><Confirm/></React.StrictMode>);`,
    resolveDir:root,sourcefile:'synthetic-confirm.tsx',loader:'tsx'},bundle:true,write:false,platform:'browser',format:'iife',jsx:'automatic',
    define:{'process.env.NODE_ENV':'"development"'}});
  const browser=await openEmailBrowser();
  try{
    const page=await browser.newPage(),requests=[];
    await page.setRequestInterception(true);
    page.on('request',req=>{
      const httpUrl=new URL(req.url());httpUrl.hash='';
      requests.push({url:httpUrl.href,method:req.method(),body:req.postData()});
      if(httpUrl.href===origin+'/login/confirm')req.respond({status:200,contentType:'text/html',body:'<!doctype html><html><body><div id="root"></div></body></html>'});
      else if(httpUrl.href===origin+'/api/auth/callback/email' && req.method()==='POST')req.respond({status:200,contentType:'text/html',body:'Synthetic confirmed submission'});
      else req.abort();
    });
    for(const width of [390,1280]){
      await page.setViewport({width,height:850});
      for(let scan=0;scan<3;scan++){
        await page.goto('about:blank');
        await page.goto(origin+'/login/confirm#'+new URLSearchParams(fields));
        await page.addScriptTag({content:script.outputFiles[0].text});
        await page.waitForSelector('button[type="submit"]');
        assert.equal(page.url(),origin+'/login/confirm','Fragment removed from history');
        assert.equal(requests.filter(r=>r.method==='POST').length,0);
        assert.ok(requests.every(r=>!r.url.includes(fields.token) && !r.url.includes(fields.email)));
        assert.match(await page.$eval('body',e=>e.innerText),/Continue signing in/);
      }
    }
    await Promise.all([page.waitForNavigation(),page.click('button[type="submit"]')]);
    const posts=requests.filter(r=>r.method==='POST');assert.equal(posts.length,1);
    assert.equal(posts[0].url,origin+'/api/auth/callback/email');
    assert.deepEqual(Object.fromEntries(new URLSearchParams(posts[0].body)),fields);
    assert.ok(!(await page.content()).includes(fields.token));
    await page.goto(origin+'/login/confirm');await page.addScriptTag({content:script.outputFiles[0].text});
    await page.waitForSelector('a[href="/login"]');assert.equal(await page.$('button[type="submit"]'),null);
    assert.equal(requests.filter(r=>r.method==='POST').length,1);
  }finally{await browser.close();}
});
