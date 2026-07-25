# STATE_MASTER_VS_FNTE.csv — column guide

Generated 2026-07-24 from marketBaseline.ts bands + live fee-engine sweeps ($500k purchase / $400k-loan refi,
representative metro ZIP per state). Regenerable on demand.

THE ONE RULE: every market comparison is STACK vs STACK — everything a provider charges for services
(settlement/closing/escrow + search/exam + doc prep + processing + notary + CPL + small mandatory fees),
never individual line items, because providers itemize the same work differently.

- *_our_stack — OUR full service stack on a real quote (all our service lines summed). THIS is what
  the market range and verdict compare against.
- *_our_settlement_line — our settlement line alone, for reference against the FNTE fee table.
  NOT what the verdict uses. A provider's whole stack can cost more than our settlement line and
  still undercut our whole stack.
- *_FA_settlement — First American's buyer-side escrow/closing fee (their stack is usually this
  one bundled fee), from the direct-API recon.
- *_market_stack_low/high — the evidence band x our stack = observed range of competitor stacks.
- *_claimed_savings — what the live site claims at this scenario: max(0, market_low - our_stack).
- *_verdict — position of OUR STACK within the known provider range:
    CHEAPEST = strictly below every known provider   |   AT PARITY = tied (within 2%) with the cheapest known   |   MID-RANGE = between known low and high
    above ALL known = even the priciest known provider beats us   |   no direct evidence = pooled band
  "(single known provider)" flags n=1 states. Verdicts say nothing about providers we haven't observed.
- evidence_basis: published schedules > calculator harvests > inferred-capped (n=1 point) > inferred.
