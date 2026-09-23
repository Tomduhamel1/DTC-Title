import { randomUUID } from 'crypto'
import { prisma } from '@/lib/db'

/** Called only with requireUser()'s authenticated user ID, never form data.
 * The current DB email must be verified and equal the intended recipient.
 * User/invitation row locks hold that evidence stable through the single
 * conditional upsert. Existing membership ownership, role and mute are kept.
 * A forwarded link or reference alone is not permission to join a closing.
 */
export async function claimTeammateInvitation(userId: string, refId: string): Promise<boolean> {
  if (!userId || typeof refId !== 'string' || refId.length < 4 || refId.length > 64) return false

  return prisma.$transaction(async tx => {
    const rows = await tx.$queryRaw<{ id: string }[]>`
      WITH eligible AS MATERIALIZED (
        SELECT u.id AS "userId", r."closingId",
               lower(btrim(r."lenderEmail")) AS "matchedEmail"
        FROM "User" u JOIN "LenderRequest" r ON r."refId" = ${refId}
        WHERE u.id = ${userId}
          AND u."emailVerified" IS NOT NULL
          AND r."closingId" IS NOT NULL
          AND nullif(btrim(r."lenderEmail"), '') IS NOT NULL
          AND lower(btrim(u.email)) = lower(btrim(r."lenderEmail"))
        FOR SHARE OF u, r
      )
      INSERT INTO "TeammateClosing"
        (id, "userId", "closingId", "matchedEmail", role, muted, "createdAt", "updatedAt")
      SELECT ${randomUUID()}, e."userId", e."closingId", e."matchedEmail",
             'unknown', false, NOW(), NOW()
      FROM eligible e
      WHERE NOT EXISTS (
        SELECT 1 FROM "TeammateClosing" sibling
        WHERE sibling."userId" = e."userId" AND sibling."closingId" = e."closingId"
          AND sibling."matchedEmail" <> e."matchedEmail"
      )
      ON CONFLICT ("matchedEmail", "closingId") DO UPDATE
        SET "userId" = EXCLUDED."userId", "updatedAt" = NOW()
        WHERE "TeammateClosing"."userId" IS NULL
           OR "TeammateClosing"."userId" = EXCLUDED."userId"
      RETURNING id
    `
    return rows.length === 1
  }, { maxWait: 3000, timeout: 5000 })
}
