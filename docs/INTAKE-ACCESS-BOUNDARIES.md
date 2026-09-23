# Intake and invitation access boundaries

Status: implementation for review, not deployed. No schema migration.

## Intake

Public `/api/orders/open` and authenticated broker quote conversion pass an
internal, server-controlled `matchExisting: false` option to the shared creation
helper. Customer-supplied contact/address details do not authorize selecting or
joining an existing file. These paths create a new Closing, seed its milestones
and associate the submitted teammate with that new record only.

Public request fields cannot override the option or select a Garden file number.
Validation, availability checks, rate limits and existing notification behavior
remain. A repeated public submission can produce a second record; no contact-
based deduplication is performed. Ops must review possible duplicates and authorize
any explicit linking. This change does not implement a new linking UI or perform
historical cleanup. Broker same-quote retries still use the existing advisory lock
and convertedClosingId, so they reuse the same newly converted file.

Admin intake and legacy authenticated TPS defaults are unchanged by this patch.
Garden's separate v2 integration patch supplies its own exact-file identity rules.
No other intake or reporting feature is declared audited by this work.

## Invitation claims

The teammate dashboard passes only requireUser()'s authenticated ID and the invite
reference to claimTeammateInvitation. The helper checks the user's current database
email and emailVerified value. Normalized email must match the intended recipient;
the invitation must be associated with a closing. A reference alone is insufficient.

A bounded database transaction locks the identity/invitation evidence while a
conditional upsert creates or claims the membership. It cannot change a different
user's existing ownership. Existing role and mute settings are preserved. Repeated
legitimate claims are idempotent; conflicting legacy memberships fail closed and
require operator review, not silent reassignment. Missing/denied/error cases show
one generic help message without revealing the recipient or closing's details.

## Verification / rollout

`test/access-boundaries.pg.test.cjs` uses real, guarded localhost PostgreSQL and
synthetic rows. External email and authentication providers are mocked; route,
helper, membership SQL and page presentation code execute for real. Tests cover
contact-match isolation, forged request options, legitimate intake, rate limits,
admin authorization, broker concurrent retries, wrong/unverified/changed recipients,
ownership preservation, repeated claims, and actual lock-contention races.

CI provisions its own garden_ldi_betterclose_access database and runs that suite.
No production mutation, migration, credential change, email or activation is part
of verification. Deployment requires separate authorization. There is no automatic
repair of pre-existing memberships: any historical investigation and remediation
must be separately authorized and evidence-based. Full type-check/build verification
also requires the independent baseline type fixes in PR #102.
