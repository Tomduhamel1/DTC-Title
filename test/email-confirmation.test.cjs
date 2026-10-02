const { test } = require('node:test');
const assert = require('node:assert/strict');
const { NextRequest } = require('next/server');
const { createHarness } = require('./helpers/email-capture.cjs');
const origin = 'https://betterclose.example.invalid';
const data = { token:'a'.repeat(64), email:'staff+test@example.invalid', callbackUrl:'/admin' };
const params = new URLSearchParams(data);
const calls = [];
const h = createHarness({mocks:{'next/server':require('next/server'), 'next-auth':()=>async req=>{
  calls.push({method:req.method, url:req.url, body:await req.text()}); return new Response(null,{status:204});
}}});
const helpers = h.load('src/lib/auth/emailConfirmation.ts');
const route = h.load('src/app/api/auth/[...nextauth]/route.ts');
const context = {params:Promise.resolve({nextauth:['callback','email']})};
const request = (body=params, headers={}, method='POST')=>new NextRequest(origin+'/api/auth/callback/email',{
  method,headers:{origin,'content-type':'application/x-www-form-urlencoded',...headers},body:body.toString(),
});

test('email link has no credentials in its HTTP query; destinations survive exactly',()=>{
  for(const callbackUrl of ['/admin','/dashboard?closingId=example&claim=one','/teammate/dashboard/example#documents']){
    const input = new URLSearchParams({...data,callbackUrl:origin+callbackUrl});
    const link = new URL(helpers.emailConfirmationUrl(origin+'/api/auth/callback/email?'+input,origin));
    assert.equal(link.pathname,'/login/confirm');assert.equal(link.search,'');
    assert.deepEqual(helpers.readEmailConfirmation(new URLSearchParams(link.hash.slice(1)),origin),{...data,callbackUrl});
  }
});
test('tampered, duplicate and external destinations fail closed',()=>{
  for(const overrides of [{token:'short'},{email:'one@example.invalid,two@example.invalid'},
    {callbackUrl:'https://evil.invalid/'},{callbackUrl:'//evil.invalid/'},{callbackUrl:'https://user:pass@betterclose.example.invalid/admin'}]){
    assert.equal(helpers.readEmailConfirmation(new URLSearchParams({...data,...overrides}),origin),null);
  }
  for(const key of ['token','email','callbackUrl']){const p=new URLSearchParams(data);p.append(key,data[key]);assert.equal(helpers.readEmailConfirmation(p,origin),null);}
  assert.throws(()=>helpers.emailConfirmationUrl('https://evil.invalid/api/auth/callback/email?'+params,origin));
});
test('legacy callback GET and HEAD never reach authentication or consume a link',async()=>{
  calls.length=0;
  for(const method of ['GET','HEAD']){
    const response=await route.GET(new NextRequest(origin+'/api/auth/callback/email?'+params,{method}),context);
    assert.equal(response.status,303);assert.match(response.headers.get('location'),/\/login\/confirm#token=/);
    assert.match(response.headers.get('cache-control'),/no-store/);assert.equal(response.headers.get('referrer-policy'),'no-referrer');
  }
  const extra=await route.GET(new NextRequest(origin+'/api/auth/callback/email/extra?'+params),
    {params:Promise.resolve({nextauth:['callback','email','extra']})});
  assert.equal(extra.status,303);
  assert.equal(calls.length,0);
});
test('only same-origin explicit POST delegates token verification to unchanged NextAuth',async()=>{
  calls.length=0;
  for(const origin of ['https://evil.invalid','null','']) assert.equal((await route.POST(request(params,{origin}),context)).status,403);
  assert.equal((await route.POST(request(params,{'content-type':'application/json'}),context)).status,403);
  assert.equal((await route.POST(request(new URLSearchParams({...data,token:'bad'})),context)).status,303);
  assert.equal((await route.POST(request(new URLSearchParams({...data,callbackUrl:'https://evil.invalid/'})),context)).status,303);
  assert.equal(calls.length,0);
  assert.equal((await route.POST(request(),context)).status,204);
  assert.equal(calls.length,1);assert.equal(calls[0].method,'POST');
  assert.deepEqual(Object.fromEntries(new URL(calls[0].url).searchParams),data);
  assert.equal(new URLSearchParams(calls[0].body).get('callbackUrl'),'/admin');
});
test('non-email authentication routes retain their original handler',async()=>{
  calls.length=0;
  await route.GET(new NextRequest(origin+'/api/auth/session'),{params:Promise.resolve({nextauth:['session']})});
  await route.POST(new NextRequest(origin+'/api/auth/signout',{method:'POST',body:'csrfToken=synthetic'}),{params:Promise.resolve({nextauth:['signout']})});
  assert.equal(calls.length,2);
});
test('confirmation credentials are excluded from telemetry',()=>{
  const {withoutAccessTelemetry}=h.load('src/lib/auth/accessTelemetry.ts');
  assert.equal(withoutAccessTelemetry({request:{url:origin+'/login/confirm#'+params}}),null);
  assert.equal(withoutAccessTelemetry({breadcrumbs:[{data:{url:'/login/confirm'}}]}),null);
});
