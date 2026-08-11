// GENERATED FILE — do not edit by hand.
// Rebuild with: npx tsx scripts/build-state-matrix.ts
//
// PUBLIC subset of the state economics matrix: engine-computed savings and
// borrower totals at the three anchor home values, for marketing-surface
// interpolation (src/lib/stateSavings.ts). Contains NO margin fields —
// safe for client bundles (unlike stateMatrix.generated.ts).

export const CURVE_GENERATED_AT = '2026-08-11T17:40:34.937Z'
export const CURVE_HOME_VALUES = [500000,1000000,2000000]

export interface CurvePoint { save: number; pay: number }
export interface StateCurve { purchase: CurvePoint[]; refinance: CurvePoint[] }

export const NATIONAL_CURVE: StateCurve = {"purchase":[{"save":364,"pay":4232},{"save":565,"pay":7102},{"save":905,"pay":13056}],"refinance":[{"save":165,"pay":1908},{"save":249,"pay":2758},{"save":374,"pay":4195}]}

export const STATE_CURVES: Record<string, StateCurve> = {
  AK: {"purchase":[{"save":276,"pay":3229},{"save":459,"pay":4271},{"save":737,"pay":5841}],"refinance":[{"save":266,"pay":2269},{"save":576,"pay":4022},{"save":903,"pay":5878}]},
  AL: {"purchase":[{"save":351,"pay":4363},{"save":501,"pay":6313},{"save":764,"pay":10000}],"refinance":[{"save":104,"pay":1669},{"save":138,"pay":2465},{"save":164,"pay":3811}]},
  AR: {"purchase":[{"save":248,"pay":3128},{"save":398,"pay":4803},{"save":698,"pay":8153}],"refinance":[{"save":118,"pay":1194},{"save":194,"pay":1625},{"save":264,"pay":2022}]},
  AZ: {"purchase":[{"save":377,"pay":2910},{"save":577,"pay":4041},{"save":892,"pay":5829}],"refinance":[{"save":94,"pay":982},{"save":124,"pay":1152},{"save":146,"pay":1280}]},
  CA: {"purchase":[{"save":1022,"pay":1928},{"save":1120,"pay":2482},{"save":1276,"pay":3364}],"refinance":[{"save":269,"pay":1350},{"save":300,"pay":1529},{"save":386,"pay":2013}]},
  CO: {"purchase":[{"save":87,"pay":1382},{"save":95,"pay":1476},{"save":177,"pay":2046}],"refinance":[{"save":109,"pay":1187},{"save":203,"pay":1718},{"save":203,"pay":1718}]},
  CT: {"purchase":[{"save":318,"pay":3206},{"save":566,"pay":4608},{"save":1061,"pay":7413}],"refinance":[{"save":221,"pay":2087},{"save":393,"pay":3061},{"save":720,"pay":4918}]},
  DC: {"purchase":[{"save":509,"pay":11556},{"save":914,"pay":21101},{"save":1616,"pay":39579}],"refinance":[{"save":74,"pay":1196},{"save":107,"pay":1383},{"save":132,"pay":1523}]},
  DE: {"purchase":[{"save":385,"pay":13384},{"save":715,"pay":25254},{"save":1263,"pay":48356}],"refinance":[{"save":211,"pay":2115},{"save":385,"pay":3101},{"save":697,"pay":4869}]},
  FL: {"purchase":[{"save":390,"pay":5385},{"save":765,"pay":9710},{"save":1140,"pay":16235}],"refinance":[{"save":185,"pay":3994},{"save":365,"pay":7214},{"save":635,"pay":13144}]},
  GA: {"purchase":[{"save":471,"pay":5048},{"save":816,"pay":8203},{"save":1506,"pay":14513}],"refinance":[{"save":74,"pay":2250},{"save":109,"pay":3646},{"save":163,"pay":6350}]},
  HI: {"purchase":[{"save":916,"pay":2891},{"save":1169,"pay":4325},{"save":1465,"pay":6003}],"refinance":[{"save":599,"pay":2081},{"save":824,"pay":3358},{"save":1107,"pay":4960}]},
  IA: {"purchase":[{"save":200,"pay":2468},{"save":350,"pay":3318},{"save":575,"pay":4593}],"refinance":[{"save":148,"pay":1902},{"save":213,"pay":2274},{"save":362,"pay":3119}]},
  ID: {"purchase":[{"save":317,"pay":2853},{"save":515,"pay":3981},{"save":878,"pay":6036}],"refinance":[{"save":323,"pay":2412},{"save":521,"pay":3540},{"save":884,"pay":5595}]},
  IL: {"purchase":[{"save":1441,"pay":5245},{"save":1441,"pay":8995},{"save":1441,"pay":16495}],"refinance":[{"save":60,"pay":1154},{"save":60,"pay":1154},{"save":144,"pay":1630}]},
  KS: {"purchase":[{"save":0,"pay":1241},{"save":0,"pay":1241},{"save":0,"pay":1241}],"refinance":[{"save":88,"pay":1486},{"save":127,"pay":1707},{"save":156,"pay":1873}]},
  KY: {"purchase":[{"save":398,"pay":2961},{"save":658,"pay":4433},{"save":1178,"pay":7378}],"refinance":[{"save":181,"pay":1584},{"save":220,"pay":1805},{"save":250,"pay":1970}]},
  MA: {"purchase":[{"save":434,"pay":3552},{"save":790,"pay":5571},{"save":1502,"pay":9609}],"refinance":[{"save":114,"pay":1332},{"save":151,"pay":1542},{"save":182,"pay":1719}]},
  MD: {"purchase":[{"save":529,"pay":11053},{"save":884,"pay":20313},{"save":1443,"pay":37984}],"refinance":[{"save":100,"pay":3111},{"save":133,"pay":5298},{"save":174,"pay":9527}]},
  ME: {"purchase":[{"save":337,"pay":3709},{"save":600,"pay":6296},{"save":1125,"pay":15271}],"refinance":[{"save":100,"pay":1051},{"save":133,"pay":1238},{"save":158,"pay":1378}]},
  MI: {"purchase":[{"save":206,"pay":1956},{"save":319,"pay":2595},{"save":510,"pay":3680}],"refinance":[{"save":88,"pay":1082},{"save":127,"pay":1303},{"save":156,"pay":1469}]},
  MN: {"purchase":[{"save":262,"pay":3268},{"save":427,"pay":5162},{"save":716,"pay":8718}],"refinance":[{"save":68,"pay":1964},{"save":98,"pay":3094},{"save":120,"pay":5142}]},
  MO: {"purchase":[{"save":69,"pay":1270},{"save":129,"pay":1610},{"save":249,"pay":2290}],"refinance":[{"save":27,"pay":823},{"save":52,"pay":966},{"save":103,"pay":1251}]},
  MS: {"purchase":[{"save":351,"pay":2582},{"save":651,"pay":4282},{"save":951,"pay":5982}],"refinance":[{"save":127,"pay":1167},{"save":164,"pay":1383},{"save":193,"pay":1543}]},
  MT: {"purchase":[{"save":393,"pay":2706},{"save":588,"pay":3813},{"save":933,"pay":5766}],"refinance":[{"save":333,"pay":2298},{"save":497,"pay":3226},{"save":795,"pay":4910}]},
  ND: {"purchase":[{"save":261,"pay":2085},{"save":411,"pay":2935},{"save":636,"pay":4210}],"refinance":[{"save":104,"pay":1050},{"save":138,"pay":1246},{"save":164,"pay":1392}]},
  NE: {"purchase":[{"save":236,"pay":2065},{"save":386,"pay":2915},{"save":611,"pay":4190}],"refinance":[{"save":174,"pay":1526},{"save":239,"pay":1898},{"save":388,"pay":2743}]},
  NH: {"purchase":[{"save":285,"pay":6096},{"save":473,"pay":10908},{"save":848,"pay":20533}],"refinance":[{"save":104,"pay":1165},{"save":138,"pay":1361},{"save":164,"pay":1507}]},
  NJ: {"purchase":[{"save":334,"pay":3091},{"save":540,"pay":4260},{"save":953,"pay":6597}],"refinance":[{"save":154,"pay":1791},{"save":293,"pay":2577},{"save":563,"pay":4107}]},
  NM: {"purchase":[{"save":266,"pay":3759},{"save":456,"pay":4836},{"save":811,"pay":35979}],"refinance":[{"save":266,"pay":2379},{"save":456,"pay":3456},{"save":811,"pay":5469}]},
  NV: {"purchase":[{"save":359,"pay":3593},{"save":561,"pay":4736},{"save":928,"pay":6819}],"refinance":[{"save":81,"pay":1068},{"save":117,"pay":1272},{"save":144,"pay":1425}]},
  NY: {"purchase":[{"save":380,"pay":11790},{"save":775,"pay":33229},{"save":1403,"pay":69192}],"refinance":[{"save":249,"pay":10360},{"save":442,"pay":20655},{"save":797,"pay":40068}]},
  OH: {"purchase":[{"save":220,"pay":2020},{"save":397,"pay":3023},{"save":709,"pay":4791}],"refinance":[{"save":78,"pay":1261},{"save":112,"pay":1457},{"save":138,"pay":1603}]},
  OK: {"purchase":[{"save":296,"pay":4539},{"save":461,"pay":5874},{"save":791,"pay":8544}],"refinance":[{"save":139,"pay":2723},{"save":210,"pay":3521},{"save":377,"pay":5267}]},
  OR: {"purchase":[{"save":224,"pay":3103},{"save":351,"pay":3821},{"save":585,"pay":5147}],"refinance":[{"save":254,"pay":2258},{"save":381,"pay":2976},{"save":615,"pay":4302}]},
  PA: {"purchase":[{"save":545,"pay":15882},{"save":887,"pay":29265},{"save":1400,"pay":55062}],"refinance":[{"save":446,"pay":3656},{"save":737,"pay":5303},{"save":1182,"pay":7822}]},
  RI: {"purchase":[{"save":409,"pay":2315},{"save":672,"pay":3802},{"save":1197,"pay":6777}],"refinance":[{"save":231,"pay":1157},{"save":321,"pay":1667},{"save":501,"pay":2687}]},
  SC: {"purchase":[{"save":247,"pay":2229},{"save":382,"pay":2994},{"save":652,"pay":4524}],"refinance":[{"save":100,"pay":1003},{"save":156,"pay":1322},{"save":264,"pay":1934}]},
  SD: {"purchase":[{"save":355,"pay":3829},{"save":517,"pay":4747},{"save":841,"pay":6583}],"refinance":[{"save":191,"pay":2743},{"save":225,"pay":2939},{"save":251,"pay":3085}]},
  TN: {"purchase":[{"save":54,"pay":3534},{"save":54,"pay":5844},{"save":54,"pay":10464}],"refinance":[{"save":100,"pay":1532},{"save":133,"pay":2179},{"save":158,"pay":3239}]},
  TX: {"purchase":[{"save":428,"pay":3461},{"save":799,"pay":5560},{"save":1408,"pay":9011}],"refinance":[{"save":170,"pay":1632},{"save":318,"pay":2472},{"save":575,"pay":3927}]},
  UT: {"purchase":[{"save":210,"pay":1996},{"save":315,"pay":2593},{"save":484,"pay":3546}],"refinance":[{"save":126,"pay":1320},{"save":189,"pay":1677},{"save":290,"pay":2250}]},
  VA: {"purchase":[{"save":449,"pay":6283},{"save":786,"pay":11196},{"save":1232,"pay":19720}],"refinance":[{"save":94,"pay":2014},{"save":125,"pay":3153},{"save":174,"pay":5349}]},
  VT: {"purchase":[{"save":339,"pay":8585},{"save":602,"pay":17422},{"save":1127,"pay":35097}],"refinance":[{"save":139,"pay":1850},{"save":186,"pay":2121},{"save":212,"pay":2267}]},
  WA: {"purchase":[{"save":372,"pay":2073},{"save":415,"pay":2310},{"save":487,"pay":2723}],"refinance":[{"save":304,"pay":1769},{"save":366,"pay":2124},{"save":460,"pay":2655}]},
  WI: {"purchase":[{"save":313,"pay":2356},{"save":400,"pay":2849},{"save":532,"pay":3597}],"refinance":[{"save":104,"pay":1025},{"save":138,"pay":1221},{"save":164,"pay":1367}]},
  WV: {"purchase":[{"save":370,"pay":2869},{"save":640,"pay":4399},{"save":1000,"pay":6439}],"refinance":[{"save":144,"pay":1358},{"save":179,"pay":1553},{"save":205,"pay":1699}]},
  WY: {"purchase":[{"save":240,"pay":2320},{"save":393,"pay":3190},{"save":672,"pay":4768}],"refinance":[{"save":88,"pay":1218},{"save":127,"pay":1439},{"save":156,"pay":1605}]},
}
