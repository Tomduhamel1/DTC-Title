const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const {PrismaClient}=require('@prisma/client');
const {createHarness}=require('./helpers/role-journey-harness.cjs');
const {createHash}=require('node:crypto');
const target=new URL(process.env.DATABASE_URL||'http://missing');
assert.ok(['127.0.0.1','localhost'].includes(target.hostname));
assert.match(target.pathname,/^\/garden_ldi_betterclose_journeys(?:_[a-z0-9]+)*$/);
const prisma=new PrismaClient();
const prefix='bcaccess-'+Date.now()+'-'; let seq=0,verified=false;
const h=createHarness(prisma), auth=h.load('src/lib/auth/fileAccess.ts');
const route=h.load('src/app/api/file-access/[closingId]/route.ts');
const make=async(extra={})=>{
  const n=++seq,email=prefix+n+'@example.invalid';
  const c=await prisma.closing.create({data:{id:prefix+n,propertyAddress:'Synthetic Access Lane',
    teammates:{create:{matchedEmail:email,role:'lender',mayManageBorrowerEmails:true,...extra}}}});
  return{c,email};
};
const key=url=>new URLSearchParams(new URL(url).hash.slice(1)).get('key');
const hash=token=>createHash('sha256').update('file-access:v1:'+token).digest('hex');
const issue=async()=>{const f=await make();return{...f,url:await auth.createFileAccessLink(f.c.id,f.email)}};
before(async()=>{const [i]=await prisma.$queryRawUnsafe('SELECT current_database() AS db,current_user AS role');
  assert.equal(i.db,target.pathname.slice(1));assert.equal(i.role,decodeURIComponent(target.username));verified=true;});
after(async()=>{if(verified){await prisma.verificationToken.deleteMany({where:{OR:[{identifier:{startsWith:prefix}},{identifier:{startsWith:'file-access:v1:{"closingId":"'+prefix}}]}});
  await prisma.closing.deleteMany({where:{id:{startsWith:prefix}}});await prisma.user.deleteMany({where:{email:{startsWith:prefix}}});}await prisma.$disconnect();});

test('issued link hides email/key from requests; only a hash is stored; no account/session/grant is created',async()=>{
  const f=await issue(),u=new URL(f.url);assert.equal(u.pathname,'/file-access/'+f.c.id);assert.equal(u.search,'');assert.ok(!f.url.includes(f.email));
  assert.match(key(f.url),/^[a-f0-9]{64}$/);const row=await prisma.verificationToken.findUnique({where:{token:hash(key(f.url))}});
  assert.ok(row);assert.notEqual(row.token,key(f.url));assert.ok(row.expires>Date.now());
  assert.equal(await prisma.user.count({where:{email:f.email}}),0);assert.equal(await prisma.teammateClosing.count({where:{closingId:f.c.id}}),1);
});
test('single-use exchange is file-bound and produces a one-minute standard NextAuth token',async()=>{
  const f=await issue();assert.equal(await auth.redeemFileAccessLink('another-file',key(f.url)),null);
  const url=new URL(await auth.redeemFileAccessLink(f.c.id,key(f.url)));
  assert.equal(url.pathname,'/api/auth/callback/email');assert.equal(url.searchParams.get('email'),f.email);
  assert.equal(url.searchParams.get('callbackUrl'),'https://betterclose.example.invalid/teammate/dashboard/'+f.c.id);
  const dbToken=createHash('sha256').update(url.searchParams.get('token')+h.env.NEXTAUTH_SECRET).digest('hex');
  const row=await prisma.verificationToken.findUnique({where:{token:dbToken}});assert.equal(row.identifier,f.email);
  assert.ok(row.expires.getTime()-Date.now()<=60000);assert.ok(row.expires>Date.now());
  assert.equal(await auth.redeemFileAccessLink(f.c.id,key(f.url)),null);
});
test('simultaneous redemption succeeds only once',async()=>{
  const f=await issue();const results=await Promise.all(Array.from({length:5},()=>auth.redeemFileAccessLink(f.c.id,key(f.url))));
  assert.equal(results.filter(Boolean).length,1);
});
test('expiry and tampering refuse authentication',async()=>{
  const f=await issue();await prisma.verificationToken.update({where:{token:hash(key(f.url))},data:{expires:new Date(Date.now()-1000)}});
  for(const token of [key(f.url),'a'.repeat(64),'../invalid'])assert.equal(await auth.redeemFileAccessLink(f.c.id,token),null);
  assert.equal(await prisma.verificationToken.count({where:{identifier:f.email}}),0);
});
test('membership revocation between email and click prevents login',async()=>{
  const f=await issue();await prisma.teammateClosing.deleteMany({where:{closingId:f.c.id}});
  assert.equal(await auth.redeemFileAccessLink(f.c.id,key(f.url)),null);
  assert.equal(await prisma.verificationToken.count({where:{identifier:f.email}}),0);
});
test('changed membership identity cannot be claimed by the former recipient',async()=>{
  const f=await issue();const other=await prisma.user.create({data:{email:prefix+'other@example.invalid'}});
  await prisma.teammateClosing.updateMany({where:{closingId:f.c.id},data:{userId:other.id}});
  assert.equal(await auth.redeemFileAccessLink(f.c.id,key(f.url)),null);
});
test('admin recipients get an ordinary protected link, never a notification login key',async()=>{
  const f=await issue();h.env.ADMIN_EMAILS=f.email;
  try{assert.equal(await auth.createFileAccessLink(f.c.id,f.email),'https://betterclose.example.invalid/teammate/dashboard/'+f.c.id);
    assert.equal(await auth.redeemFileAccessLink(f.c.id,key(f.url)),null);
  }finally{delete h.env.ADMIN_EMAILS;}
});
test('uninvited/unknown-role/borrower recipients cannot receive a Pro access credential',async()=>{
  const f=await make({role:'unknown'});await assert.rejects(auth.createFileAccessLink(f.c.id,f.email));
  await assert.rejects(auth.createFileAccessLink(f.c.id,'uninvited@example.invalid'));
  await prisma.closing.update({where:{id:f.c.id},data:{borrowerEmail:f.email}});
  await prisma.teammateClosing.updateMany({where:{closingId:f.c.id},data:{role:'lender'}});
  await assert.rejects(auth.createFileAccessLink(f.c.id,f.email));
});
test('unclaimed memberships never mint an admin login, including promotion after issuance',async()=>{
  const f=await issue();await prisma.user.create({data:{email:f.email,accountType:'admin'}});
  assert.equal(await auth.createFileAccessLink(f.c.id,f.email),'https://betterclose.example.invalid/teammate/dashboard/'+f.c.id);
  assert.equal(await auth.redeemFileAccessLink(f.c.id,key(f.url)),null);
  assert.equal(await prisma.verificationToken.count({where:{identifier:f.email}}),0);
});
test('ambiguous email identities cannot bypass the normal NextAuth normalization boundary',async()=>{
  const f=await make();
  for(const email of ['victim@example.invalid＠attacker.invalid','ｖictim@example.invalid','victim@example.invalid,extra','Victim <victim@example.invalid>','victim@@example.invalid']){
    await prisma.teammateClosing.updateMany({where:{closingId:f.c.id},data:{matchedEmail:email}});
    await assert.rejects(auth.createFileAccessLink(f.c.id,email));
  }
});
test('GET has no redemption handler; cross-origin and form POSTs cannot consume a link',async()=>{
  assert.equal(route.GET,undefined);const f=await issue();
  for(const headers of [{origin:'https://evil.invalid','content-type':'application/json'},{'content-type':'application/json'},
    {origin:'https://betterclose.example.invalid','content-type':'application/x-www-form-urlencoded'}]){
    const r=await route.POST(new Request('https://betterclose.example.invalid/api/file-access/'+f.c.id,{method:'POST',headers,body:JSON.stringify({token:key(f.url)})}),{params:Promise.resolve({closingId:f.c.id})});assert.equal(r.status,403);
  }
  const r=await route.POST(new Request('https://betterclose.example.invalid/api/file-access/'+f.c.id,{method:'POST',headers:{origin:'https://betterclose.example.invalid','content-type':'application/json'},body:JSON.stringify({token:key(f.url),callbackUrl:'https://evil.invalid'})}),{params:Promise.resolve({closingId:f.c.id})});
  assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/no-store/);assert.equal(r.headers.get('referrer-policy'),'no-referrer');
  assert.equal(new URL((await r.json()).url).origin,'https://betterclose.example.invalid');
});
test('anonymous landing reveals no file/recipient and does not consume; signed-in member redirects without switching accounts',async()=>{
  const f=await issue();const page=h.load('src/app/file-access/[closingId]/page.tsx').default;
  h.setActor(null);const html=h.render(await page({params:Promise.resolve({closingId:f.c.id})}));
  assert.match(html,/View your file/);assert.ok(!html.includes(f.email));assert.ok(!html.includes(f.c.propertyAddress));assert.ok(!html.includes(key(f.url)));
  assert.ok(await prisma.verificationToken.findUnique({where:{token:hash(key(f.url))}}));
  const u=await prisma.user.create({data:{email:f.email}});await prisma.teammateClosing.updateMany({where:{closingId:f.c.id},data:{userId:u.id}});
  h.setActor(u);await assert.rejects(page({params:Promise.resolve({closingId:f.c.id})}),new RegExp('REDIRECT:/teammate/dashboard/'+f.c.id));h.setActor(null);
});
test('credential routes are excluded from errors, traces and breadcrumbs',()=>{
  const {withoutAccessTelemetry}=h.load('src/lib/auth/accessTelemetry.ts');
  for(const path of ['/file-access/example#key=private','/api/file-access/example','/api/auth/callback/email?token=private']){
    assert.equal(withoutAccessTelemetry({request:{url:'https://example.invalid'+path,data:{token:'private'}}}),null);
    assert.equal(withoutAccessTelemetry({breadcrumbs:[{data:{url:path}}]}),null);
  }
  assert.deepEqual(withoutAccessTelemetry({message:'ordinary error'}),{message:'ordinary error'});
});
