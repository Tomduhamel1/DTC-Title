// Representative ZIPs per US state + DC, used by the broker estimate form
// when the broker has a state but no ZIP. We need *some* ZIP to hand to the
// upstream elend public-calc (it takes only PostalCode as a location input),
// so we pick a populous, well-known ZIP per state and pass it through.
//
// These are intentionally large-metro ZIPs that the upstream calc is known to
// resolve cleanly. They are NOT the borrower's actual ZIP — the broker is
// told as much in the result UI. If the broker enters a real ZIP, that takes
// precedence; this map is only the "state-only" fallback.

const REPRESENTATIVE_ZIP_BY_STATE: Record<string, string> = {
  AL: '35203', AK: '99501', AZ: '85003', AR: '72201', CA: '90012',
  CO: '80202', CT: '06103', DE: '19801', FL: '33130', GA: '30303',
  HI: '96813', ID: '83702', IL: '60601', IN: '46204', IA: '50309',
  KS: '66603', KY: '40202', LA: '70112', ME: '04101', MD: '21201',
  MA: '02108', MI: '48226', MN: '55401', MS: '39201', MO: '63101',
  MT: '59601', NE: '68102', NV: '89101', NH: '03301', NJ: '07102',
  NM: '87501', NY: '10007', NC: '27601', ND: '58501', OH: '43215',
  OK: '73102', OR: '97204', PA: '19102', RI: '02903', SC: '29201',
  SD: '57501', TN: '37201', TX: '78701', UT: '84111', VT: '05602',
  VA: '23219', WA: '98104', WV: '25301', WI: '53703', WY: '82001',
  DC: '20001',
}

/**
 * Resolve a 5-digit ZIP from a 2-letter state code. Returns undefined for an
 * unknown code so callers can decide to error rather than silently substitute.
 */
export function representativeZipForState(stateCode: string | undefined | null): string | undefined {
  if (!stateCode) return undefined
  return REPRESENTATIVE_ZIP_BY_STATE[stateCode.toUpperCase()]
}
