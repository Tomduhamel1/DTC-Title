# BetterClose — Private Beta Deploy Checklist (AWS Amplify)

End-to-end steps to take this from local prototype to a private beta on
**betterclose.co**, hosted on AWS Amplify, with RDS Postgres + SES email.

The AWS-side resources have already been provisioned via CLI in account
`621852467690` (`fnte` profile, us-east-1):

- RDS instance `betterclose-db` (db.t4g.micro Postgres 16)
- Security group `sg-0a942f22bd1acaabe` allowing :5432 from your laptop only
- DB password in Secrets Manager `betterclose/db/master`
- SES domain identity `betterclose.co` (DKIM tokens captured below)
- IAM user `betterclose-app` with SES + S3 permissions
- S3 bucket `betterclose-uploads` (public access blocked)
- Access key for the app user (in Amplify env vars below)

## What's left for you to do

### 1. Add DNS records at GoDaddy

Log into GoDaddy → My Products → DNS → Manage Zones → `betterclose.co`. Add:

**SES DKIM (3 CNAMEs):**
| Type  | Name                                                   | Value                                                              |
|-------|--------------------------------------------------------|--------------------------------------------------------------------|
| CNAME | `ljedsgoumykbxvi25udmmyjmforaz34r._domainkey`          | `ljedsgoumykbxvi25udmmyjmforaz34r.dkim.amazonses.com`             |
| CNAME | `niam67csuiqdddrrfelyf23z77htpx7i._domainkey`          | `niam67csuiqdddrrfelyf23z77htpx7i.dkim.amazonses.com`             |
| CNAME | `gn5inssofcyhhlbysmqvwe7fbutua3ej._domainkey`          | `gn5inssofcyhhlbysmqvwe7fbutua3ej.dkim.amazonses.com`             |

**SPF + DMARC:**
| Type | Name    | Value                                                              |
|------|---------|--------------------------------------------------------------------|
| TXT  | `@`     | `v=spf1 include:amazonses.com include:spf.privateemail.com ~all`   |
| TXT  | `_dmarc`| `v=DMARC1; p=none; rua=mailto:dmarc@betterclose.co`               |

**Amplify CNAMEs (added later, once the app is deployed):**
Amplify generates these in its Domain management UI — copy them when you reach
step 4 below.

**Namecheap MX records (added later, once you sign up for Private Email):**
Namecheap will give you specific MX values to add at GoDaddy.

DNS propagation: 5–60 minutes. Verify with `dig` once added:
```
dig +short TXT betterclose.co
dig +short CNAME ljedsgoumykbxvi25udmmyjmforaz34r._domainkey.betterclose.co
```

### 2. Request SES production access (web console)

1. AWS Console → SES → Account dashboard → **Request production access**.
2. Use case: "Transactional email for web app sign-in (magic links) and
   service introduction emails to lenders/realtors."
3. Estimate: 100/day to start, ~5,000/day in 3 months. Expected complaint
   rate <0.1%.
4. Approval typically lands within hours. While you wait, sandbox mode lets
   you send only to verified addresses — `tomduhamel@gmail.com` was already
   verified for you (check your inbox for the verification email).

### 3. Connect Amplify to GitHub

1. AWS Console → Amplify → **Create new app** → **Host web app**.
2. Connect to GitHub. Authorize the AWS Amplify app.
3. Select the `GARDEN DTC` repo. Branch: `main`.
4. Amplify auto-detects `amplify.yml` in repo root.
5. **Service role**: let Amplify create one (the wizard does this).
6. **App name**: `betterclose`.

### 4. Set Amplify environment variables

In the same wizard (or later in App settings → Environment variables), paste:

```
DATABASE_URL=postgresql://betterclose:<see-secrets-manager>@betterclose-db.c1w4gw68gn8k.us-east-1.rds.amazonaws.com:5432/betterclose?schema=public
NEXTAUTH_SECRET=<generate: openssl rand -hex 32>
NEXTAUTH_URL=https://betterclose.co
AUTH_EMAIL_DRY_RUN=false
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<see /tmp/new-app-key.json on the deploy machine, or rotate via aws iam create-access-key --user-name betterclose-app>
AWS_SECRET_ACCESS_KEY=<see /tmp/new-app-key.json>
# NOTE: Never commit real keys. Generate with the IAM console or CLI; paste only into Amplify env vars.
AWS_SES_FROM_EMAIL=noreply@betterclose.co
HELLO_EMAIL=hello@betterclose.co
ORDER_INGEST_SECRET=<generate: openssl rand -hex 32>
AWS_S3_BUCKET=betterclose-uploads
```

Get the RDS endpoint from the AWS console (RDS → `betterclose-db` →
Connectivity → Endpoint) once it shows status "Available".

Get the DB password:
```
aws --profile fnte --region us-east-1 secretsmanager get-secret-value \
  --secret-id betterclose/db/master --query SecretString --output text
```

### 5. First deploy

1. Trigger build (auto on connect, or in the Amplify console click "Run job").
2. The build does NOT run migrations. Apply schema changes manually from
   your laptop *before* pushing schema-changing commits:
   ```
   DB_PW=$(aws --profile fnte --region us-east-1 secretsmanager get-secret-value \
     --secret-id betterclose/db/master --query SecretString --output text | jq -r .password)
   DATABASE_URL="postgresql://betterclose:${DB_PW}@betterclose-db.c1w4gw68gn8k.us-east-1.rds.amazonaws.com:5432/betterclose?schema=public" \
     npx prisma migrate deploy
   ```
   This keeps RDS locked to your IP only (no public exposure).
3. ~5 min later you get an Amplify-hosted URL like `main.d1xxx.amplifyapp.com`.
4. Visit `<that-url>/api/health` — expect `{"ok":true}`.

### 6. Custom domain

1. Amplify → App → Domain management → **Add domain** → `betterclose.co`.
2. Amplify shows DNS records to add at GoDaddy:
   - one CNAME for `betterclose.co` (or apex via ALIAS-equivalent)
   - one CNAME for `www.betterclose.co`
   - one CNAME for ACM cert validation
3. Add them at GoDaddy. ACM validation takes a few minutes.
4. Amplify auto-deploys the cert once DNS validates.

### 7. Email inboxes (Namecheap Private Email)

1. namecheap.com → Private Email → buy a plan (~$1.50/mo per mailbox is fine
   for beta).
2. Domain: `betterclose.co` (you'll select "external" since it's at GoDaddy).
3. Namecheap gives you MX records — add them at GoDaddy.
4. Create mailboxes:
   - `hello@betterclose.co` (general inquiries / replies)
   - `orders@betterclose.co` (lender orders by email)
   - `dmarc@betterclose.co` (DMARC aggregate reports)
   - `noreply@betterclose.co` (set up so bounces aren't lost)

### 8. Smoke tests

After custom domain resolves and SES production access is granted:

- `https://betterclose.co/api/health` → `{"ok": true}`
- `/login` → enter `tomduhamel@gmail.com` → check inbox → click magic link →
  `/dashboard` → onboarding form
- Submit onboarding → 6 section cards + milestone timeline
- `/?variant=credible-c` → "Send BetterClose to my team" → "We'll email your
  lender" → enter your own email → preview → send → check inbox
- Order webhook test:
  ```
  curl -X POST https://betterclose.co/api/orders/ingest \
    -H "Authorization: Bearer $ORDER_INGEST_SECRET" \
    -H "Content-Type: application/json" \
    -d '{
      "borrowerEmail":"newuser@example.com",
      "borrowerName":"Casey Doe",
      "propertyAddress":"123 Main St",
      "propertyState":"TX",
      "propertyType":"purchase",
      "closingDate":"2026-08-15",
      "lenderName":"Sarah Smith",
      "lenderCompany":"Acme Lending",
      "lenderEmail":"sarah@acme.example"
    }'
  ```
  The borrower should get a welcome email with a sign-in link.

## Useful commands later

**Get RDS endpoint:**
```
aws --profile fnte --region us-east-1 rds describe-db-instances \
  --db-instance-identifier betterclose-db \
  --query 'DBInstances[0].Endpoint.Address' --output text
```

**Connect to RDS from your laptop:**
```
psql "postgresql://betterclose:<password>@<endpoint>:5432/betterclose"
```

**Reset your laptop's IP in the security group (if your IP changes):**
```
# get new IP
NEW_IP=$(curl -s https://checkip.amazonaws.com)/32
# revoke old, authorize new (replace OLD_CIDR)
aws --profile fnte --region us-east-1 ec2 revoke-security-group-ingress \
  --group-id sg-0a942f22bd1acaabe --protocol tcp --port 5432 --cidr <OLD>
aws --profile fnte --region us-east-1 ec2 authorize-security-group-ingress \
  --group-id sg-0a942f22bd1acaabe --protocol tcp --port 5432 --cidr $NEW_IP
```

## Things to revisit before opening to the public

- Switch in-memory rate limit to Upstash Redis (multi-instance survival).
- Move RDS to private subnets behind a VPC connector (no public IP).
- Enable RDS Multi-AZ for HA (~+$13/mo).
- Replace long-lived IAM access keys with Amplify-bound IAM role (no env keys).
- Add `/admin` page for ops to view recent closings + lender requests.
- Real `/terms` and `/privacy` pages (currently 404).
- Add a way for users to delete their account / closing.
