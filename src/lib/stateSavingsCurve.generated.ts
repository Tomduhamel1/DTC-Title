// GENERATED FILE — do not edit by hand.
// Rebuild with: npx tsx scripts/build-state-matrix.ts
//
// PUBLIC subset of the state economics matrix: engine-computed savings and
// borrower totals at the three anchor home values, for marketing-surface
// interpolation (src/lib/stateSavings.ts). Contains NO margin fields —
// safe for client bundles (unlike stateMatrix.generated.ts).

export const CURVE_GENERATED_AT = '2026-10-21T23:48:08.810Z'
export const CURVE_HOME_VALUES = [500000,1000000,2000000]

export interface CurvePoint { save: number; pay: number }
export interface StateCurve { purchase: CurvePoint[]; refinance: CurvePoint[] }

export const NATIONAL_CURVE: StateCurve = {"purchase":[{"save":373,"pay":4141},{"save":548,"pay":6980},{"save":852,"pay":12846}],"refinance":[{"save":184,"pay":1991},{"save":253,"pay":2835},{"save":354,"pay":4258}]}

export const STATE_CURVES: Record<string, StateCurve> = {
  AK: {"purchase":[{"save":276,"pay":3196},{"save":459,"pay":4238},{"save":737,"pay":5808}],"refinance":[{"save":266,"pay":2416},{"save":576,"pay":4169},{"save":903,"pay":6025}]},
  AL: {"purchase":[{"save":395,"pay":4319},{"save":545,"pay":6269},{"save":808,"pay":9956}],"refinance":[{"save":163,"pay":1920},{"save":197,"pay":2716},{"save":223,"pay":4062}]},
  AR: {"purchase":[{"save":292,"pay":3084},{"save":442,"pay":4759},{"save":742,"pay":8109}],"refinance":[{"save":177,"pay":1445},{"save":253,"pay":1876},{"save":323,"pay":2273}]},
  AZ: {"purchase":[{"save":416,"pay":2870},{"save":616,"pay":4001},{"save":931,"pay":5789}],"refinance":[{"save":146,"pay":1192},{"save":176,"pay":1362},{"save":198,"pay":1490}]},
  CA: {"purchase":[{"save":1036,"pay":1913},{"save":1134,"pay":2467},{"save":1290,"pay":3349}],"refinance":[{"save":283,"pay":1335},{"save":314,"pay":1514},{"save":400,"pay":1998}]},
  CO: {"purchase":[{"save":91,"pay":1390},{"save":99,"pay":1487},{"save":186,"pay":2078}],"refinance":[{"save":109,"pay":1172},{"save":203,"pay":1703},{"save":203,"pay":1703}]},
  CT: {"purchase":[{"save":318,"pay":3156},{"save":566,"pay":4558},{"save":1061,"pay":7363}],"refinance":[{"save":221,"pay":2387},{"save":393,"pay":3361},{"save":720,"pay":5218}]},
  DC: {"purchase":[{"save":509,"pay":11516},{"save":914,"pay":21061},{"save":1616,"pay":39539}],"refinance":[{"save":74,"pay":1406},{"save":107,"pay":1593},{"save":132,"pay":1733}]},
  DE: {"purchase":[{"save":414,"pay":13416},{"save":744,"pay":25286},{"save":1292,"pay":48388}],"refinance":[{"save":248,"pay":2289},{"save":422,"pay":3275},{"save":734,"pay":5043}]},
  FL: {"purchase":[{"save":285,"pay":5405},{"save":285,"pay":10105},{"save":285,"pay":17005}],"refinance":[{"save":265,"pay":4009},{"save":265,"pay":7409},{"save":265,"pay":13609}]},
  GA: {"purchase":[{"save":521,"pay":5023},{"save":866,"pay":8178},{"save":1556,"pay":14488}],"refinance":[{"save":124,"pay":2575},{"save":159,"pay":3971},{"save":213,"pay":6675}]},
  HI: {"purchase":[{"save":916,"pay":2891},{"save":1169,"pay":4325},{"save":1465,"pay":6003}],"refinance":[{"save":599,"pay":2081},{"save":824,"pay":3358},{"save":1107,"pay":4960}]},
  IA: {"purchase":[{"save":200,"pay":2373},{"save":350,"pay":3223},{"save":575,"pay":4498}],"refinance":[{"save":148,"pay":2157},{"save":213,"pay":2529},{"save":362,"pay":3374}]},
  ID: {"purchase":[{"save":317,"pay":2801},{"save":515,"pay":3929},{"save":878,"pay":5984}],"refinance":[{"save":323,"pay":2735},{"save":521,"pay":3863},{"save":884,"pay":5918}]},
  IL: {"purchase":[{"save":1455,"pay":5230},{"save":1455,"pay":8980},{"save":1455,"pay":16480}],"refinance":[{"save":60,"pay":1139},{"save":60,"pay":1139},{"save":144,"pay":1615}]},
  IN: {"purchase":[{"save":135,"pay":1378},{"save":197,"pay":1726},{"save":407,"pay":2916}],"refinance":[{"save":123,"pay":1135},{"save":161,"pay":1347},{"save":183,"pay":1475}]},
  KS: {"purchase":[{"save":0,"pay":1226},{"save":0,"pay":1226},{"save":0,"pay":1226}],"refinance":[{"save":88,"pay":1471},{"save":127,"pay":1692},{"save":156,"pay":1858}]},
  KY: {"purchase":[{"save":412,"pay":2946},{"save":672,"pay":4418},{"save":1192,"pay":7363}],"refinance":[{"save":195,"pay":1569},{"save":234,"pay":1790},{"save":264,"pay":1955}]},
  LA: {"purchase":[{"save":459,"pay":4079},{"save":756,"pay":5762},{"save":1251,"pay":8567}],"refinance":[{"save":168,"pay":1880},{"save":254,"pay":2369},{"save":409,"pay":3249}]},
  MA: {"purchase":[{"save":478,"pay":3507},{"save":834,"pay":5526},{"save":1546,"pay":9564}],"refinance":[{"save":173,"pay":1587},{"save":210,"pay":1797},{"save":241,"pay":1974}]},
  MD: {"purchase":[{"save":554,"pay":12028},{"save":909,"pay":22288},{"save":1468,"pay":41959}],"refinance":[{"save":129,"pay":3186},{"save":162,"pay":5373},{"save":203,"pay":9602}]},
  ME: {"purchase":[{"save":361,"pay":3684},{"save":624,"pay":6271},{"save":1149,"pay":15246}],"refinance":[{"save":129,"pay":1126},{"save":162,"pay":1313},{"save":187,"pay":1453}]},
  MI: {"purchase":[{"save":206,"pay":1941},{"save":319,"pay":2580},{"save":510,"pay":3665}],"refinance":[{"save":88,"pay":1067},{"save":127,"pay":1288},{"save":156,"pay":1454}]},
  MN: {"purchase":[{"save":262,"pay":3253},{"save":427,"pay":5147},{"save":716,"pay":8703}],"refinance":[{"save":68,"pay":1949},{"save":98,"pay":3079},{"save":120,"pay":5127}]},
  MO: {"purchase":[{"save":0,"pay":843},{"save":0,"pay":843},{"save":0,"pay":843}],"refinance":[{"save":27,"pay":812},{"save":52,"pay":955},{"save":103,"pay":1240}]},
  MS: {"purchase":[{"save":425,"pay":2907},{"save":763,"pay":4819},{"save":1115,"pay":6817}],"refinance":[{"save":141,"pay":1152},{"save":178,"pay":1368},{"save":207,"pay":1528}]},
  MT: {"purchase":[{"save":408,"pay":2691},{"save":603,"pay":3798},{"save":948,"pay":5751}],"refinance":[{"save":348,"pay":2283},{"save":512,"pay":3211},{"save":810,"pay":4895}]},
  ND: {"purchase":[{"save":275,"pay":2070},{"save":425,"pay":2920},{"save":650,"pay":4195}],"refinance":[{"save":118,"pay":1035},{"save":152,"pay":1231},{"save":178,"pay":1377}]},
  NE: {"purchase":[{"save":250,"pay":2050},{"save":400,"pay":2900},{"save":625,"pay":4175}],"refinance":[{"save":188,"pay":1511},{"save":253,"pay":1883},{"save":402,"pay":2728}]},
  NH: {"purchase":[{"save":299,"pay":6081},{"save":487,"pay":10893},{"save":862,"pay":20518}],"refinance":[{"save":118,"pay":1150},{"save":152,"pay":1346},{"save":178,"pay":1492}]},
  NJ: {"purchase":[{"save":334,"pay":3051},{"save":540,"pay":4220},{"save":953,"pay":6557}],"refinance":[{"save":154,"pay":2001},{"save":293,"pay":2787},{"save":563,"pay":4317}]},
  NM: {"purchase":[{"save":377,"pay":2602},{"save":377,"pay":3869},{"save":377,"pay":35367}],"refinance":[{"save":175,"pay":2602},{"save":175,"pay":3869},{"save":175,"pay":6237}]},
  NV: {"purchase":[{"save":359,"pay":3578},{"save":561,"pay":4721},{"save":928,"pay":6804}],"refinance":[{"save":81,"pay":1053},{"save":117,"pay":1257},{"save":144,"pay":1410}]},
  NY: {"purchase":[{"save":244,"pay":11765},{"save":244,"pay":33599},{"save":244,"pay":70190}],"refinance":[{"save":244,"pay":10754},{"save":244,"pay":21242},{"save":244,"pay":41010}]},
  OH: {"purchase":[{"save":220,"pay":2005},{"save":397,"pay":3008},{"save":709,"pay":4776}],"refinance":[{"save":78,"pay":1246},{"save":112,"pay":1442},{"save":138,"pay":1588}]},
  OK: {"purchase":[{"save":296,"pay":4452},{"save":461,"pay":5787},{"save":791,"pay":8457}],"refinance":[{"save":139,"pay":3361},{"save":210,"pay":4159},{"save":377,"pay":5905}]},
  OR: {"purchase":[{"save":224,"pay":3073},{"save":351,"pay":3791},{"save":585,"pay":5117}],"refinance":[{"save":254,"pay":2378},{"save":381,"pay":3096},{"save":615,"pay":4422}]},
  PA: {"purchase":[{"save":564,"pay":15862},{"save":906,"pay":29245},{"save":1419,"pay":55042}],"refinance":[{"save":468,"pay":3686},{"save":759,"pay":5333},{"save":1204,"pay":7852}]},
  RI: {"purchase":[{"save":535,"pay":2190},{"save":885,"pay":3590},{"save":1585,"pay":6390}],"refinance":[{"save":295,"pay":1192},{"save":415,"pay":1672},{"save":655,"pay":2632}]},
  SC: {"purchase":[{"save":295,"pay":2179},{"save":430,"pay":2944},{"save":700,"pay":4474}],"refinance":[{"save":166,"pay":1303},{"save":222,"pay":1622},{"save":330,"pay":2234}]},
  SD: {"purchase":[{"save":540,"pay":3642},{"save":702,"pay":4560},{"save":1026,"pay":6396}],"refinance":[{"save":377,"pay":2574},{"save":411,"pay":2770},{"save":437,"pay":2916}]},
  TN: {"purchase":[{"save":103,"pay":3484},{"save":103,"pay":5794},{"save":103,"pay":10414}],"refinance":[{"save":167,"pay":1844},{"save":200,"pay":2491},{"save":225,"pay":3551}]},
  TX: {"purchase":[{"save":132,"pay":3504},{"save":132,"pay":5974},{"save":132,"pay":10034}],"refinance":[{"save":132,"pay":1767},{"save":132,"pay":2755},{"save":132,"pay":4467}]},
  UT: {"purchase":[{"save":210,"pay":1981},{"save":315,"pay":2578},{"save":484,"pay":3531}],"refinance":[{"save":126,"pay":1305},{"save":189,"pay":1662},{"save":290,"pay":2235}]},
  VA: {"purchase":[{"save":473,"pay":6258},{"save":810,"pay":11171},{"save":1256,"pay":19695}],"refinance":[{"save":123,"pay":2089},{"save":154,"pay":3228},{"save":203,"pay":5424}]},
  VT: {"purchase":[{"save":423,"pay":8500},{"save":686,"pay":17337},{"save":1211,"pay":35012}],"refinance":[{"save":223,"pay":1765},{"save":270,"pay":2036},{"save":296,"pay":2182}]},
  WA: {"purchase":[{"save":387,"pay":2053},{"save":430,"pay":2290},{"save":502,"pay":2703}],"refinance":[{"save":319,"pay":1799},{"save":381,"pay":2154},{"save":475,"pay":2685}]},
  WI: {"purchase":[{"save":327,"pay":2341},{"save":414,"pay":2834},{"save":546,"pay":3582}],"refinance":[{"save":118,"pay":1010},{"save":152,"pay":1206},{"save":178,"pay":1352}]},
  WV: {"purchase":[{"save":405,"pay":2933},{"save":685,"pay":4523},{"save":1060,"pay":6648}],"refinance":[{"save":173,"pay":1458},{"save":208,"pay":1653},{"save":234,"pay":1799}]},
  WY: {"purchase":[{"save":240,"pay":2305},{"save":393,"pay":3175},{"save":672,"pay":4753}],"refinance":[{"save":88,"pay":1203},{"save":127,"pay":1424},{"save":156,"pay":1590}]},
}
