import { REPORT_MODEL_VERSION, type FeeReport } from './feeReport'

// One fixed purchase example, calculated by fetchElendFeeEstimate against
// the public fee API. No customer file/PII, geolocation, placeholder fees,
// or adjustment of prices to reach a marketing target.
// The recorded upstream response is replayed through the real engine in
// test/homepage-content.test.cjs; preserve every returned buyer-side line.
export const PURCHASE_SAMPLE_INPUT = {
  transactionType: 'purchase' as const,
  zip: '02903',
  homeValue: 600000,
  loanAmount: 480000,
}
export const PURCHASE_SAMPLE_LOCATION = 'Providence, RI'

const purchaseExample: FeeReport = {
  modelVersion: REPORT_MODEL_VERSION,
  state: 'RI',
  zip: PURCHASE_SAMPLE_INPUT.zip,
  county: 'Providence',
  homeValue: PURCHASE_SAMPLE_INPUT.homeValue,
  loanAmount: PURCHASE_SAMPLE_INPUT.loanAmount,
  transactionType: PURCHASE_SAMPLE_INPUT.transactionType,
  generatedAt: '2026-10-20T20:54:43.118Z',
  isSample: true,
  lineItems: [
    { id: 'elend-0', label: "Owner's Title Insurance", category: 'title-settlement', ourCost: 950, isFixed: true, feeSource: 'underwriter' },
    { id: 'elend-1', label: "Lender's Title Insurance", category: 'title-settlement', ourCost: 1200, isFixed: true, feeSource: 'underwriter' },
    { id: 'elend-2', label: 'Settlement Fee', category: 'title-settlement', ourCost: 250, isFixed: false, feeSource: 'service', typicalRange: { low: 420, high: 500 } },
    { id: 'elend-5', label: 'Conveyance Deed - Recording Fee', category: 'recording', ourCost: 87, isFixed: true, feeSource: 'county' },
    { id: 'elend-6', label: 'Mortgage (Deed of Trust) - Recording Fee', category: 'recording', ourCost: 88, isFixed: true, feeSource: 'county' },
    { id: 'elend-8', label: 'Closing Protection Letter', category: 'other', ourCost: 35, isFixed: true },
    { id: 'elend-17', label: 'Notary Fee', category: 'title-settlement', ourCost: 140, isFixed: false, feeSource: 'service', typicalRange: { low: 140, high: 140 } },
    { id: 'elend-22', label: 'Recording Service Fee', category: 'recording', ourCost: 25, isFixed: true, feeSource: 'service' },
    { id: 'elend-23', label: 'Attorney Fee', category: 'title-settlement', ourCost: 40, isFixed: false, feeSource: 'service', typicalRange: { low: 40, high: 40 } },
    { id: 'elend-25', label: 'Abstractor Title Search', category: 'title-settlement', ourCost: 90, isFixed: false, feeSource: 'service', typicalRange: { low: 90, high: 90 } },
    { id: 'betterclose-bucks', label: 'BetterClose Bucks', category: 'title-settlement', ourCost: -430, isFixed: false, isCredit: true, description: 'Introductory BetterClose credit, applied at closing.' },
  ],
}

export function buildSampleFeeReport(): FeeReport {
  // Consumers cannot mutate the shared evidence-backed example.
  return structuredClone(purchaseExample)
}
