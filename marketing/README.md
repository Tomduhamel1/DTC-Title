# Printable handouts

The agent, broker and closing-comparison handouts are maintained as HTML in this directory. Their downloadable PDFs live in `public/pdfs/`.

Every handout must include the complete disclosure in `src/lib/marketing-disclosure.json`, including the DBA/LLC identity, estimate and availability qualifications, policy and attorney-role qualifications, and independent payment-instruction verification warning. Keep the identity and warning lead-in bold and the fine print at least 8pt. The comparison-kit webpage uses the same text through `MarketingDisclosure`.

Do not make a blanket financial-strength rating claim about the underwriting panel. Do not substitute another rating without dated, carrier-specific verification. Pricing and savings calculations are separate from this copy policy.

After editing HTML, run `sh marketing/build-pdfs.sh` (set `CHROME_PATH` if needed). This uses an isolated headless browser, blocks remote resource requests, and checks disclosure completeness and page geometry before rendering. Inspect all three generated PDFs at print size, confirm one page each, and verify the extracted PDF text includes the entire disclosure. Never rely only on the HTML source check.

Run `node --test test/marketing-disclosures.test.cjs` to check rating-copy regressions and disclosure consistency. Retain the transaction-specific assumptions alongside the common disclosure. Old copies already downloaded or emailed cannot be changed; redistribute the revised PDFs after release.
