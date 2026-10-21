// GENERATED FILE — do not edit by hand.
// Rebuild with: npx tsx scripts/build-state-matrix.ts
//
// PUBLIC subset of the state economics matrix: engine-computed savings and
// borrower totals at the three anchor home values, for marketing-surface
// interpolation (src/lib/stateSavings.ts). Contains NO margin fields —
// safe for client bundles (unlike stateMatrix.generated.ts).

export const CURVE_GENERATED_AT = '2026-10-20T21:29:05.582Z'
export const CURVE_HOME_VALUES = [500000,1000000,2000000]

export interface CurvePoint { save: number; pay: number }
export interface StateCurve { purchase: CurvePoint[]; refinance: CurvePoint[] }

export const NATIONAL_CURVE: StateCurve = {"purchase":[{"save":370,"pay":4145},{"save":545,"pay":6985},{"save":849,"pay":12851}],"refinance":[{"save":181,"pay":1996},{"save":250,"pay":2840},{"save":350,"pay":4263}]}

export const STATE_CURVES: Record<string, StateCurve> = {
  AK: {"purchase":[{"save":276,"pay":3201},{"save":459,"pay":4243},{"save":737,"pay":5813}],"refinance":[{"save":266,"pay":2421},{"save":576,"pay":4174},{"save":903,"pay":6030}]},
  AL: {"purchase":[{"save":390,"pay":4324},{"save":540,"pay":6274},{"save":803,"pay":9961}],"refinance":[{"save":158,"pay":1925},{"save":192,"pay":2721},{"save":218,"pay":4067}]},
  AR: {"purchase":[{"save":287,"pay":3089},{"save":437,"pay":4764},{"save":737,"pay":8114}],"refinance":[{"save":172,"pay":1450},{"save":248,"pay":1881},{"save":318,"pay":2278}]},
  AZ: {"purchase":[{"save":411,"pay":2875},{"save":611,"pay":4006},{"save":926,"pay":5794}],"refinance":[{"save":141,"pay":1197},{"save":171,"pay":1367},{"save":193,"pay":1495}]},
  CA: {"purchase":[{"save":1031,"pay":1918},{"save":1129,"pay":2472},{"save":1285,"pay":3354}],"refinance":[{"save":278,"pay":1340},{"save":309,"pay":1519},{"save":395,"pay":2003}]},
  CO: {"purchase":[{"save":91,"pay":1395},{"save":99,"pay":1492},{"save":186,"pay":2083}],"refinance":[{"save":109,"pay":1177},{"save":203,"pay":1708},{"save":203,"pay":1708}]},
  CT: {"purchase":[{"save":318,"pay":3161},{"save":566,"pay":4563},{"save":1061,"pay":7368}],"refinance":[{"save":221,"pay":2392},{"save":393,"pay":3366},{"save":720,"pay":5223}]},
  DC: {"purchase":[{"save":509,"pay":11521},{"save":914,"pay":21066},{"save":1616,"pay":39544}],"refinance":[{"save":74,"pay":1411},{"save":107,"pay":1598},{"save":132,"pay":1738}]},
  DE: {"purchase":[{"save":409,"pay":13421},{"save":739,"pay":25291},{"save":1287,"pay":48393}],"refinance":[{"save":243,"pay":2294},{"save":417,"pay":3280},{"save":729,"pay":5048}]},
  FL: {"purchase":[{"save":280,"pay":5410},{"save":280,"pay":10110},{"save":280,"pay":17010}],"refinance":[{"save":260,"pay":4014},{"save":260,"pay":7414},{"save":260,"pay":13614}]},
  GA: {"purchase":[{"save":516,"pay":5028},{"save":861,"pay":8183},{"save":1551,"pay":14493}],"refinance":[{"save":119,"pay":2580},{"save":154,"pay":3976},{"save":208,"pay":6680}]},
  HI: {"purchase":[{"save":916,"pay":2891},{"save":1169,"pay":4325},{"save":1465,"pay":6003}],"refinance":[{"save":599,"pay":2081},{"save":824,"pay":3358},{"save":1107,"pay":4960}]},
  IA: {"purchase":[{"save":200,"pay":2378},{"save":350,"pay":3228},{"save":575,"pay":4503}],"refinance":[{"save":148,"pay":2162},{"save":213,"pay":2534},{"save":362,"pay":3379}]},
  ID: {"purchase":[{"save":317,"pay":2806},{"save":515,"pay":3934},{"save":878,"pay":5989}],"refinance":[{"save":323,"pay":2740},{"save":521,"pay":3868},{"save":884,"pay":5923}]},
  IL: {"purchase":[{"save":1450,"pay":5235},{"save":1450,"pay":8985},{"save":1450,"pay":16485}],"refinance":[{"save":60,"pay":1144},{"save":60,"pay":1144},{"save":144,"pay":1620}]},
  IN: {"purchase":[{"save":130,"pay":1383},{"save":192,"pay":1731},{"save":402,"pay":2921}],"refinance":[{"save":118,"pay":1140},{"save":156,"pay":1352},{"save":178,"pay":1480}]},
  KS: {"purchase":[{"save":0,"pay":1231},{"save":0,"pay":1231},{"save":0,"pay":1231}],"refinance":[{"save":88,"pay":1476},{"save":127,"pay":1697},{"save":156,"pay":1863}]},
  KY: {"purchase":[{"save":407,"pay":2951},{"save":667,"pay":4423},{"save":1187,"pay":7368}],"refinance":[{"save":190,"pay":1574},{"save":229,"pay":1795},{"save":259,"pay":1960}]},
  LA: {"purchase":[{"save":454,"pay":4084},{"save":751,"pay":5767},{"save":1246,"pay":8572}],"refinance":[{"save":163,"pay":1885},{"save":249,"pay":2374},{"save":404,"pay":3254}]},
  MA: {"purchase":[{"save":473,"pay":3512},{"save":829,"pay":5531},{"save":1541,"pay":9569}],"refinance":[{"save":168,"pay":1592},{"save":205,"pay":1802},{"save":236,"pay":1979}]},
  MD: {"purchase":[{"save":549,"pay":12033},{"save":904,"pay":22293},{"save":1463,"pay":41964}],"refinance":[{"save":124,"pay":3191},{"save":157,"pay":5378},{"save":198,"pay":9607}]},
  ME: {"purchase":[{"save":356,"pay":3689},{"save":619,"pay":6276},{"save":1144,"pay":15251}],"refinance":[{"save":124,"pay":1131},{"save":157,"pay":1318},{"save":182,"pay":1458}]},
  MI: {"purchase":[{"save":206,"pay":1946},{"save":319,"pay":2585},{"save":510,"pay":3670}],"refinance":[{"save":88,"pay":1072},{"save":127,"pay":1293},{"save":156,"pay":1459}]},
  MN: {"purchase":[{"save":262,"pay":3258},{"save":427,"pay":5152},{"save":716,"pay":8708}],"refinance":[{"save":68,"pay":1954},{"save":98,"pay":3084},{"save":120,"pay":5132}]},
  MO: {"purchase":[{"save":0,"pay":848},{"save":0,"pay":848},{"save":0,"pay":848}],"refinance":[{"save":27,"pay":817},{"save":52,"pay":960},{"save":103,"pay":1245}]},
  MS: {"purchase":[{"save":420,"pay":2912},{"save":758,"pay":4824},{"save":1110,"pay":6822}],"refinance":[{"save":136,"pay":1157},{"save":173,"pay":1373},{"save":202,"pay":1533}]},
  MT: {"purchase":[{"save":403,"pay":2696},{"save":598,"pay":3803},{"save":943,"pay":5756}],"refinance":[{"save":343,"pay":2288},{"save":507,"pay":3216},{"save":805,"pay":4900}]},
  ND: {"purchase":[{"save":270,"pay":2075},{"save":420,"pay":2925},{"save":645,"pay":4200}],"refinance":[{"save":113,"pay":1040},{"save":147,"pay":1236},{"save":173,"pay":1382}]},
  NE: {"purchase":[{"save":245,"pay":2055},{"save":395,"pay":2905},{"save":620,"pay":4180}],"refinance":[{"save":183,"pay":1516},{"save":248,"pay":1888},{"save":397,"pay":2733}]},
  NH: {"purchase":[{"save":294,"pay":6086},{"save":482,"pay":10898},{"save":857,"pay":20523}],"refinance":[{"save":113,"pay":1155},{"save":147,"pay":1351},{"save":173,"pay":1497}]},
  NJ: {"purchase":[{"save":334,"pay":3056},{"save":540,"pay":4225},{"save":953,"pay":6562}],"refinance":[{"save":154,"pay":2006},{"save":293,"pay":2792},{"save":563,"pay":4322}]},
  NM: {"purchase":[{"save":372,"pay":2607},{"save":372,"pay":3874},{"save":372,"pay":35372}],"refinance":[{"save":170,"pay":2607},{"save":170,"pay":3874},{"save":170,"pay":6242}]},
  NV: {"purchase":[{"save":359,"pay":3583},{"save":561,"pay":4726},{"save":928,"pay":6809}],"refinance":[{"save":81,"pay":1058},{"save":117,"pay":1262},{"save":144,"pay":1415}]},
  NY: {"purchase":[{"save":239,"pay":11770},{"save":239,"pay":33604},{"save":239,"pay":70195}],"refinance":[{"save":239,"pay":10759},{"save":239,"pay":21247},{"save":239,"pay":41015}]},
  OH: {"purchase":[{"save":220,"pay":2010},{"save":397,"pay":3013},{"save":709,"pay":4781}],"refinance":[{"save":78,"pay":1251},{"save":112,"pay":1447},{"save":138,"pay":1593}]},
  OK: {"purchase":[{"save":296,"pay":4457},{"save":461,"pay":5792},{"save":791,"pay":8462}],"refinance":[{"save":139,"pay":3366},{"save":210,"pay":4164},{"save":377,"pay":5910}]},
  OR: {"purchase":[{"save":224,"pay":3078},{"save":351,"pay":3796},{"save":585,"pay":5122}],"refinance":[{"save":254,"pay":2383},{"save":381,"pay":3101},{"save":615,"pay":4427}]},
  PA: {"purchase":[{"save":559,"pay":15867},{"save":901,"pay":29250},{"save":1414,"pay":55047}],"refinance":[{"save":463,"pay":3691},{"save":754,"pay":5338},{"save":1199,"pay":7857}]},
  RI: {"purchase":[{"save":530,"pay":2195},{"save":880,"pay":3595},{"save":1580,"pay":6395}],"refinance":[{"save":290,"pay":1197},{"save":410,"pay":1677},{"save":650,"pay":2637}]},
  SC: {"purchase":[{"save":290,"pay":2184},{"save":425,"pay":2949},{"save":695,"pay":4479}],"refinance":[{"save":161,"pay":1308},{"save":217,"pay":1627},{"save":325,"pay":2239}]},
  SD: {"purchase":[{"save":535,"pay":3647},{"save":697,"pay":4565},{"save":1021,"pay":6401}],"refinance":[{"save":372,"pay":2579},{"save":406,"pay":2775},{"save":432,"pay":2921}]},
  TN: {"purchase":[{"save":98,"pay":3489},{"save":98,"pay":5799},{"save":98,"pay":10419}],"refinance":[{"save":162,"pay":1849},{"save":195,"pay":2496},{"save":220,"pay":3556}]},
  TX: {"purchase":[{"save":127,"pay":3509},{"save":127,"pay":5979},{"save":127,"pay":10039}],"refinance":[{"save":127,"pay":1772},{"save":127,"pay":2760},{"save":127,"pay":4472}]},
  UT: {"purchase":[{"save":210,"pay":1986},{"save":315,"pay":2583},{"save":484,"pay":3536}],"refinance":[{"save":126,"pay":1310},{"save":189,"pay":1667},{"save":290,"pay":2240}]},
  VA: {"purchase":[{"save":468,"pay":6263},{"save":805,"pay":11176},{"save":1251,"pay":19700}],"refinance":[{"save":118,"pay":2094},{"save":149,"pay":3233},{"save":198,"pay":5429}]},
  VT: {"purchase":[{"save":418,"pay":8505},{"save":681,"pay":17342},{"save":1206,"pay":35017}],"refinance":[{"save":218,"pay":1770},{"save":265,"pay":2041},{"save":291,"pay":2187}]},
  WA: {"purchase":[{"save":382,"pay":2058},{"save":425,"pay":2295},{"save":497,"pay":2708}],"refinance":[{"save":314,"pay":1804},{"save":376,"pay":2159},{"save":470,"pay":2690}]},
  WI: {"purchase":[{"save":322,"pay":2346},{"save":409,"pay":2839},{"save":541,"pay":3587}],"refinance":[{"save":113,"pay":1015},{"save":147,"pay":1211},{"save":173,"pay":1357}]},
  WV: {"purchase":[{"save":400,"pay":2938},{"save":680,"pay":4528},{"save":1055,"pay":6653}],"refinance":[{"save":168,"pay":1463},{"save":203,"pay":1658},{"save":229,"pay":1804}]},
  WY: {"purchase":[{"save":240,"pay":2310},{"save":393,"pay":3180},{"save":672,"pay":4758}],"refinance":[{"save":88,"pay":1208},{"save":127,"pay":1429},{"save":156,"pay":1595}]},
}
