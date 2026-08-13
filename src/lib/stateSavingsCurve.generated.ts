// GENERATED FILE — do not edit by hand.
// Rebuild with: npx tsx scripts/build-state-matrix.ts
//
// PUBLIC subset of the state economics matrix: engine-computed savings and
// borrower totals at the three anchor home values, for marketing-surface
// interpolation (src/lib/stateSavings.ts). Contains NO margin fields —
// safe for client bundles (unlike stateMatrix.generated.ts).

export const CURVE_GENERATED_AT = '2026-08-13T05:22:50.734Z'
export const CURVE_HOME_VALUES = [500000,1000000,2000000]

export interface CurvePoint { save: number; pay: number }
export interface StateCurve { purchase: CurvePoint[]; refinance: CurvePoint[] }

export const NATIONAL_CURVE: StateCurve = {"purchase":[{"save":366,"pay":4230},{"save":568,"pay":7099},{"save":912,"pay":13049}],"refinance":[{"save":168,"pay":2035},{"save":252,"pay":2884},{"save":379,"pay":4320}]}

export const STATE_CURVES: Record<string, StateCurve> = {
  AK: {"purchase":[{"save":276,"pay":3229},{"save":459,"pay":4271},{"save":737,"pay":5841}],"refinance":[{"save":266,"pay":2449},{"save":576,"pay":4202},{"save":903,"pay":6058}]},
  AL: {"purchase":[{"save":350,"pay":4363},{"save":500,"pay":6313},{"save":763,"pay":10000}],"refinance":[{"save":118,"pay":1964},{"save":152,"pay":2760},{"save":178,"pay":4106}]},
  AR: {"purchase":[{"save":247,"pay":3128},{"save":397,"pay":4803},{"save":697,"pay":8153}],"refinance":[{"save":132,"pay":1489},{"save":208,"pay":1920},{"save":278,"pay":2317}]},
  AZ: {"purchase":[{"save":376,"pay":2910},{"save":576,"pay":4041},{"save":891,"pay":5829}],"refinance":[{"save":106,"pay":1232},{"save":136,"pay":1402},{"save":158,"pay":1530}]},
  CA: {"purchase":[{"save":1021,"pay":1928},{"save":1119,"pay":2482},{"save":1275,"pay":3364}],"refinance":[{"save":268,"pay":1350},{"save":299,"pay":1529},{"save":385,"pay":2013}]},
  CO: {"purchase":[{"save":87,"pay":1382},{"save":95,"pay":1476},{"save":177,"pay":2046}],"refinance":[{"save":109,"pay":1187},{"save":203,"pay":1718},{"save":203,"pay":1718}]},
  CT: {"purchase":[{"save":318,"pay":3206},{"save":566,"pay":4608},{"save":1061,"pay":7413}],"refinance":[{"save":221,"pay":2437},{"save":393,"pay":3411},{"save":720,"pay":5268}]},
  DC: {"purchase":[{"save":509,"pay":11556},{"save":914,"pay":21101},{"save":1616,"pay":39579}],"refinance":[{"save":74,"pay":1446},{"save":107,"pay":1633},{"save":132,"pay":1773}]},
  DE: {"purchase":[{"save":384,"pay":13384},{"save":714,"pay":25254},{"save":1262,"pay":48356}],"refinance":[{"save":218,"pay":2265},{"save":392,"pay":3251},{"save":704,"pay":5019}]},
  FL: {"purchase":[{"save":390,"pay":5385},{"save":765,"pay":9710},{"save":1140,"pay":16235}],"refinance":[{"save":185,"pay":3994},{"save":365,"pay":7214},{"save":635,"pay":13144}]},
  GA: {"purchase":[{"save":471,"pay":5048},{"save":816,"pay":8203},{"save":1506,"pay":14513}],"refinance":[{"save":74,"pay":2600},{"save":109,"pay":3996},{"save":163,"pay":6700}]},
  HI: {"purchase":[{"save":916,"pay":2891},{"save":1169,"pay":4325},{"save":1465,"pay":6003}],"refinance":[{"save":599,"pay":2081},{"save":824,"pay":3358},{"save":1107,"pay":4960}]},
  IA: {"purchase":[{"save":200,"pay":2468},{"save":350,"pay":3318},{"save":575,"pay":4593}],"refinance":[{"save":148,"pay":2252},{"save":213,"pay":2624},{"save":362,"pay":3469}]},
  ID: {"purchase":[{"save":317,"pay":2853},{"save":515,"pay":3981},{"save":878,"pay":6036}],"refinance":[{"save":323,"pay":2787},{"save":521,"pay":3915},{"save":884,"pay":5970}]},
  IL: {"purchase":[{"save":1440,"pay":5245},{"save":1440,"pay":8995},{"save":1440,"pay":16495}],"refinance":[{"save":60,"pay":1154},{"save":60,"pay":1154},{"save":144,"pay":1630}]},
  KS: {"purchase":[{"save":0,"pay":1241},{"save":0,"pay":1241},{"save":0,"pay":1241}],"refinance":[{"save":88,"pay":1486},{"save":127,"pay":1707},{"save":156,"pay":1873}]},
  KY: {"purchase":[{"save":397,"pay":2961},{"save":657,"pay":4433},{"save":1177,"pay":7378}],"refinance":[{"save":180,"pay":1584},{"save":219,"pay":1805},{"save":249,"pay":1970}]},
  MA: {"purchase":[{"save":433,"pay":3552},{"save":789,"pay":5571},{"save":1501,"pay":9609}],"refinance":[{"save":128,"pay":1632},{"save":165,"pay":1842},{"save":196,"pay":2019}]},
  MD: {"purchase":[{"save":529,"pay":11053},{"save":884,"pay":20313},{"save":1443,"pay":37984}],"refinance":[{"save":104,"pay":3211},{"save":137,"pay":5398},{"save":178,"pay":9627}]},
  ME: {"purchase":[{"save":336,"pay":3709},{"save":599,"pay":6296},{"save":1124,"pay":15271}],"refinance":[{"save":104,"pay":1151},{"save":137,"pay":1338},{"save":162,"pay":1478}]},
  MI: {"purchase":[{"save":206,"pay":1956},{"save":319,"pay":2595},{"save":510,"pay":3680}],"refinance":[{"save":88,"pay":1082},{"save":127,"pay":1303},{"save":156,"pay":1469}]},
  MN: {"purchase":[{"save":262,"pay":3268},{"save":427,"pay":5162},{"save":716,"pay":8718}],"refinance":[{"save":68,"pay":1964},{"save":98,"pay":3094},{"save":120,"pay":5142}]},
  MO: {"purchase":[{"save":69,"pay":1270},{"save":129,"pay":1610},{"save":249,"pay":2290}],"refinance":[{"save":27,"pay":823},{"save":52,"pay":966},{"save":103,"pay":1251}]},
  MS: {"purchase":[{"save":350,"pay":2582},{"save":650,"pay":4282},{"save":950,"pay":5982}],"refinance":[{"save":126,"pay":1167},{"save":163,"pay":1383},{"save":192,"pay":1543}]},
  MT: {"purchase":[{"save":393,"pay":2706},{"save":588,"pay":3813},{"save":933,"pay":5766}],"refinance":[{"save":333,"pay":2298},{"save":497,"pay":3226},{"save":795,"pay":4910}]},
  ND: {"purchase":[{"save":260,"pay":2085},{"save":410,"pay":2935},{"save":635,"pay":4210}],"refinance":[{"save":103,"pay":1050},{"save":137,"pay":1246},{"save":163,"pay":1392}]},
  NE: {"purchase":[{"save":235,"pay":2065},{"save":385,"pay":2915},{"save":610,"pay":4190}],"refinance":[{"save":173,"pay":1526},{"save":238,"pay":1898},{"save":387,"pay":2743}]},
  NH: {"purchase":[{"save":284,"pay":6096},{"save":472,"pay":10908},{"save":847,"pay":20533}],"refinance":[{"save":103,"pay":1165},{"save":137,"pay":1361},{"save":163,"pay":1507}]},
  NJ: {"purchase":[{"save":334,"pay":3091},{"save":540,"pay":4260},{"save":953,"pay":6597}],"refinance":[{"save":154,"pay":2041},{"save":293,"pay":2827},{"save":563,"pay":4357}]},
  NM: {"purchase":[{"save":266,"pay":3759},{"save":456,"pay":4836},{"save":811,"pay":35979}],"refinance":[{"save":266,"pay":2409},{"save":456,"pay":3486},{"save":811,"pay":5499}]},
  NV: {"purchase":[{"save":359,"pay":3593},{"save":561,"pay":4736},{"save":928,"pay":6819}],"refinance":[{"save":81,"pay":1068},{"save":117,"pay":1272},{"save":144,"pay":1425}]},
  NY: {"purchase":[{"save":380,"pay":11790},{"save":775,"pay":33229},{"save":1403,"pay":69192}],"refinance":[{"save":249,"pay":10710},{"save":442,"pay":21005},{"save":797,"pay":40418}]},
  OH: {"purchase":[{"save":220,"pay":2020},{"save":397,"pay":3023},{"save":709,"pay":4791}],"refinance":[{"save":78,"pay":1261},{"save":112,"pay":1457},{"save":138,"pay":1603}]},
  OK: {"purchase":[{"save":296,"pay":4539},{"save":461,"pay":5874},{"save":791,"pay":8544}],"refinance":[{"save":139,"pay":3448},{"save":210,"pay":4246},{"save":377,"pay":5992}]},
  OR: {"purchase":[{"save":224,"pay":3103},{"save":351,"pay":3821},{"save":585,"pay":5147}],"refinance":[{"save":254,"pay":2408},{"save":381,"pay":3126},{"save":615,"pay":4452}]},
  PA: {"purchase":[{"save":544,"pay":15882},{"save":886,"pay":29265},{"save":1399,"pay":55062}],"refinance":[{"save":448,"pay":3706},{"save":739,"pay":5353},{"save":1184,"pay":7872}]},
  RI: {"purchase":[{"save":500,"pay":2225},{"save":850,"pay":3625},{"save":1550,"pay":6425}],"refinance":[{"save":260,"pay":1227},{"save":380,"pay":1707},{"save":620,"pay":2667}]},
  SC: {"purchase":[{"save":245,"pay":2229},{"save":380,"pay":2994},{"save":650,"pay":4524}],"refinance":[{"save":116,"pay":1353},{"save":172,"pay":1672},{"save":280,"pay":2284}]},
  SD: {"purchase":[{"save":353,"pay":3829},{"save":515,"pay":4747},{"save":839,"pay":6583}],"refinance":[{"save":190,"pay":2761},{"save":224,"pay":2957},{"save":250,"pay":3103}]},
  TN: {"purchase":[{"save":53,"pay":3534},{"save":53,"pay":5844},{"save":53,"pay":10464}],"refinance":[{"save":117,"pay":1882},{"save":150,"pay":2529},{"save":175,"pay":3589}]},
  TX: {"purchase":[{"save":428,"pay":3461},{"save":799,"pay":5560},{"save":1408,"pay":9011}],"refinance":[{"save":170,"pay":1782},{"save":318,"pay":2622},{"save":575,"pay":4077}]},
  UT: {"purchase":[{"save":210,"pay":1996},{"save":315,"pay":2593},{"save":484,"pay":3546}],"refinance":[{"save":126,"pay":1320},{"save":189,"pay":1677},{"save":290,"pay":2250}]},
  VA: {"purchase":[{"save":448,"pay":6283},{"save":785,"pay":11196},{"save":1231,"pay":19720}],"refinance":[{"save":98,"pay":2114},{"save":129,"pay":3253},{"save":178,"pay":5449}]},
  VT: {"purchase":[{"save":338,"pay":8585},{"save":601,"pay":17422},{"save":1126,"pay":35097}],"refinance":[{"save":138,"pay":1850},{"save":185,"pay":2121},{"save":211,"pay":2267}]},
  WA: {"purchase":[{"save":372,"pay":2073},{"save":415,"pay":2310},{"save":487,"pay":2723}],"refinance":[{"save":304,"pay":1819},{"save":366,"pay":2174},{"save":460,"pay":2705}]},
  WI: {"purchase":[{"save":312,"pay":2356},{"save":399,"pay":2849},{"save":531,"pay":3597}],"refinance":[{"save":103,"pay":1025},{"save":137,"pay":1221},{"save":163,"pay":1367}]},
  WV: {"purchase":[{"save":369,"pay":2869},{"save":639,"pay":4399},{"save":999,"pay":6439}],"refinance":[{"save":148,"pay":1458},{"save":183,"pay":1653},{"save":209,"pay":1799}]},
  WY: {"purchase":[{"save":240,"pay":2320},{"save":393,"pay":3190},{"save":672,"pay":4768}],"refinance":[{"save":88,"pay":1218},{"save":127,"pay":1439},{"save":156,"pay":1605}]},
}
