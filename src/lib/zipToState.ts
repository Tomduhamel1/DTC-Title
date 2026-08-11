// 3-digit ZIP prefix → state, for PRE-FLIGHT availability gating only.
//
// Purpose: refuse an OFF-state quote before burning the 11–18s upstream
// fee-calculator call. This table is advisory — the authoritative check runs
// in the elendCalc backstop against the upstream's own stateCode/county.
// Unknown or ambiguous prefixes return undefined and the request proceeds
// (fail open); a wrong entry here could wrongly block a customer, so
// ambiguous prefixes are deliberately omitted.
//
// Source: standard USPS 3-digit ZIP prefix allocations. Known cross-state
// quirks encoded: 201 VA, 569 DC, 733/885 TX, 004/005 NY.

const RANGES: Array<[start: number, end: number, state: string]> = [
  [4, 5, 'NY'], // 004–005 Holtsville/mid-island NY
  [10, 27, 'MA'],
  [28, 29, 'RI'],
  [30, 38, 'NH'],
  [39, 49, 'ME'],
  [50, 59, 'VT'],
  [60, 69, 'CT'],
  [70, 89, 'NJ'],
  [100, 149, 'NY'],
  [150, 196, 'PA'],
  [197, 199, 'DE'],
  [200, 200, 'DC'],
  [201, 201, 'VA'],
  [202, 205, 'DC'],
  [206, 219, 'MD'],
  [220, 246, 'VA'],
  [247, 268, 'WV'],
  [270, 289, 'NC'],
  [290, 299, 'SC'],
  [300, 319, 'GA'],
  [320, 339, 'FL'],
  [341, 342, 'FL'],
  [344, 344, 'FL'],
  [346, 347, 'FL'],
  [349, 349, 'FL'],
  [350, 369, 'AL'],
  [370, 385, 'TN'],
  [386, 397, 'MS'],
  [398, 399, 'GA'],
  [400, 427, 'KY'],
  [430, 459, 'OH'],
  [460, 479, 'IN'],
  [480, 499, 'MI'],
  [500, 528, 'IA'],
  [530, 549, 'WI'],
  [550, 567, 'MN'],
  [569, 569, 'DC'],
  [570, 577, 'SD'],
  [580, 588, 'ND'],
  [590, 599, 'MT'],
  [600, 629, 'IL'],
  [630, 658, 'MO'],
  [660, 679, 'KS'],
  [680, 693, 'NE'],
  [700, 714, 'LA'],
  [716, 729, 'AR'],
  [730, 732, 'OK'],
  [733, 733, 'TX'],
  [734, 749, 'OK'],
  [750, 799, 'TX'],
  [800, 816, 'CO'],
  [820, 831, 'WY'],
  [832, 838, 'ID'],
  [840, 847, 'UT'],
  [850, 865, 'AZ'],
  [870, 884, 'NM'],
  [885, 885, 'TX'],
  [889, 898, 'NV'],
  [900, 961, 'CA'],
  [967, 968, 'HI'],
  [970, 979, 'OR'],
  [980, 994, 'WA'],
  [995, 999, 'AK'],
]

export function stateForZip(zip: string | undefined | null): string | undefined {
  if (!zip || !/^\d{5}/.test(zip)) return undefined
  const prefix = parseInt(zip.slice(0, 3), 10)
  for (const [start, end, state] of RANGES) {
    if (prefix >= start && prefix <= end) return state
  }
  return undefined
}
