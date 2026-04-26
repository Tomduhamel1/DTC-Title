# BetterClose — Private Beta Deploy Checklist

End-to-end steps to take this from local prototype to a private beta on
**betterclose.co**, hosted on Render, with real magic-link auth and SES email.

## 1. AWS

### 1a. SES production access
1. AWS Console → Simple Email Service → Account dashboard.
2. Click **Request production access**. Use case: "Transactional email for
   web app users (sign-in magic links and lender introductions)." Daily volume:
   estimate ~100 to start, ~5k as we grow. Submit.
3. Approval typically lands in a few hours to 1 day.

### 1b. Verify the domain
1. SES → **Verified identities** → **Create identity** → **Domain** →
   `betterclose.co`. Enable Easy DKIM.
2. AWS will show 3 CNAME records — copy them.
3. Publish the CNAMEs at your DNS registrar.
4. Wait for SES status to flip to **Verified** (usually <30 min).
5. Add **SPF** TXT record at the apex:
   `v=spf1 include:amazonses.com ~all`
6. Add **DMARC** TXT at `_dmarc.betterclose.co`:
   `v=DMARC1; p=none; rua=mailto:dmarc@betterclose.co`

### 1c. IAM user for the app
1. IAM → Users → **Create user** → name: `betterclose-app`. No console access.
2. Attach an inline policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       { "Effect": "Allow", "Action": ["ses:SendEmail", "ses:SendRawEmail"], "Resource": "*" },
       { "Effect": "Allow", "Action": ["s3:PutObject", "s3:GetObject"], "Resource": "arn:aws:s3:::betterclose-uploads/*" }
     ]
   }
   ```
3. Create access keys → record `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
   for Render env.

### 1d. S3 bucket (only if you'll use the legacy /start doc-upload path)
1. S3 → **Create bucket**: `betterclose-uploads`, same region as SES.
2. Block public access (default). The IAM user gets PutObject above.

## 2. Email inboxes

You'll send from `noreply@betterclose.co` and want to *receive* on
`hello@betterclose.co` and `orders@betterclose.co`.

Easiest: **Google Workspace** ($6/user/mo) on `betterclose.co`.

1. Sign up → verify domain → add the **MX records** Google gives you.
2. Create users (or aliases): `hello@`, `orders@`.

## 3. Render

### 3a. Postgres
1. Render dashboard → **New** → **PostgreSQL**. Name: `betterclose-db`.
   Plan: Starter ($7/mo) is fine to start.
2. Wait until status = Available. Note the **Internal Database URL**.

### 3b. Web service
1. **New** → **Web Service** → connect to the GitHub repo.
2. Settings:
   - **Build command**:
     ```
     npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start command**: `npm start`
   - **Health check path**: `/api/health`
   - **Auto-deploy**: on for `main`
3. Environment tab — set every variable from `.env.example`. Notable:
   - `DATABASE_URL` = the Internal Database URL from step 3a.
   - `NEXTAUTH_SECRET` = `openssl rand -hex 32`
   - `NEXTAUTH_URL` = `https://betterclose.co`
   - `AUTH_EMAIL_DRY_RUN` = `false`
   - `ORDER_INGEST_SECRET` = `openssl rand -hex 32` (keep private)
   - AWS keys + SES from address from §1.

### 3c. Custom domain
1. In the web service → Settings → Custom Domains → add `betterclose.co` and
   `www.betterclose.co`.
2. Render shows DNS targets. At your registrar:
   - apex `betterclose.co` → ALIAS / ANAME → Render's target
     (or A record to Render's IP if your registrar doesn't support ALIAS)
   - `www` → CNAME → same target
3. Render auto-issues a Let's Encrypt cert (~1 min).

## 4. First deploy verification

After Render shows "Live":

1. Visit `https://betterclose.co/api/health` → expect `{"ok":true}`.
2. Visit `https://betterclose.co/login`, enter your email → check inbox for the
   magic-link email. Click it → land on `/dashboard`.
3. Visit `/?variant=credible-c` → click the green CTA → run the share-sheet
   "We'll email your lender" flow with your own email as the lender → check
   that the email arrives, formatted correctly, with you CC'd.
4. Test the order webhook:
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

## 5. Post-launch monitoring

- **Render logs**: tail the web service for any errors during the first day.
- **Sentry** (if configured): create a project, paste DSN into env, redeploy.
- **SES dashboard**: watch bounce/complaint rates — keep complaints <0.1%.

## 6. Things to revisit before opening to public

- Move rate-limit from in-memory to Redis (Upstash) so it survives multi-instance.
- Move from sandbox AWS region to a region with reserved sender IPs.
- Add a way for users to delete their account / closing.
- Term & privacy policy pages (currently link to `/terms` and `/privacy` which 404).
- Real `/admin` for ops to view recent closings and lender-requests.
