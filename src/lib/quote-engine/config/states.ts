import { StateConfig } from '../types'

export const stateConfigs: Record<string, StateConfig> = {
  CA: {
    state: 'CA',
    stateName: 'California',
    recordingTaxRate: 0,
    recordingTaxType: 'percentage',
    transferTaxRate: 1.1,
    transferTaxType: 'per_thousand',
    recordingFeeBase: 30,
    recordingFeePerPage: 3,
    countyOverrides: {
      'Los Angeles': {
        recordingFeeBase: 35,
        transferTaxRate: 1.45,
      },
      'San Francisco': {
        transferTaxRate: 2.5,
      },
      'Alameda': {
        recordingFeeBase: 33,
      },
    },
    stateSpecificDisclosures: [
      'California Natural Hazard Disclosure required',
      'Proposition 60/90 may apply for property tax transfers',
    ],
  },
  TX: {
    state: 'TX',
    stateName: 'Texas',
    recordingTaxRate: 0,
    recordingTaxType: 'percentage',
    transferTaxRate: 0,
    transferTaxType: 'percentage',
    recordingFeeBase: 25,
    countyOverrides: {
      'Harris': {
        recordingFeeBase: 28,
      },
      'Dallas': {
        recordingFeeBase: 30,
      },
    },
    stateSpecificDisclosures: [
      'Texas does not have state transfer taxes',
      'Home equity loans have specific constitutional protections',
    ],
  },
  NY: {
    state: 'NY',
    stateName: 'New York',
    recordingTaxRate: 0.4,
    recordingTaxType: 'percentage',
    transferTaxRate: 4.0,
    transferTaxType: 'per_thousand',
    recordingFeeBase: 125,
    recordingFeePerPage: 5,
    countyOverrides: {
      'New York': {
        transferTaxRate: 10.0, // NYC has higher rates
        recordingFeeBase: 200,
      },
      'Kings': {
        transferTaxRate: 10.0,
        recordingFeeBase: 200,
      },
      'Queens': {
        transferTaxRate: 10.0,
        recordingFeeBase: 200,
      },
    },
    stateSpecificDisclosures: [
      'NY Mansion Tax may apply to properties over $1M',
      'Additional NYC transfer taxes apply in the five boroughs',
    ],
  },
  FL: {
    state: 'FL',
    stateName: 'Florida',
    recordingTaxRate: 0.7,
    recordingTaxType: 'per_thousand',
    transferTaxRate: 7.0,
    transferTaxType: 'per_thousand',
    recordingFeeBase: 10,
    countyOverrides: {
      'Miami-Dade': {
        transferTaxRate: 6.0,
        recordingFeeBase: 15,
      },
    },
    stateSpecificDisclosures: [
      'Documentary stamp taxes apply to mortgages and deeds',
      'Florida has homestead exemption protections',
    ],
  },
  WA: {
    state: 'WA',
    stateName: 'Washington',
    recordingTaxRate: 0,
    recordingTaxType: 'percentage',
    transferTaxRate: 1.28,
    transferTaxType: 'percentage',
    recordingFeeBase: 50,
    countyOverrides: {
      'King': {
        recordingFeeBase: 55,
      },
    },
    stateSpecificDisclosures: [
      'Washington State Excise Tax applies to property transfers',
      'Local jurisdictions may impose additional transfer taxes',
    ],
  },
}

export function getStateConfig(state: string): StateConfig {
  const config = stateConfigs[state.toUpperCase()]
  if (!config) {
    // Return a default configuration for unknown states
    return {
      state: state.toUpperCase(),
      stateName: state,
      recordingTaxRate: 0,
      recordingTaxType: 'percentage',
      transferTaxRate: 0,
      transferTaxType: 'percentage',
      recordingFeeBase: 50,
      stateSpecificDisclosures: [
        'State-specific regulations may apply',
      ],
    }
  }
  return config
}

export function getCountyConfig(state: string, county: string): Partial<StateConfig> {
  const stateConfig = getStateConfig(state)
  return stateConfig.countyOverrides?.[county] || {}
}
