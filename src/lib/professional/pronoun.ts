export type TeammateRole = 'lender' | 'broker' | 'realtor' | 'unknown'

export function placingPartyPhrase(role: TeammateRole | null | undefined): string {
  switch (role) {
    case 'broker':
      return 'Your broker'
    case 'lender':
      return 'Your lender'
    case 'realtor':
      return 'Your real estate agent'
    default:
      return 'Your closing team'
  }
}

export function placingPartyPhraseLowercase(role: TeammateRole | null | undefined): string {
  switch (role) {
    case 'broker':
      return 'your broker'
    case 'lender':
      return 'your lender'
    case 'realtor':
      return 'your real estate agent'
    default:
      return 'your closing team'
  }
}

export function roleLabel(role: TeammateRole | null | undefined): string {
  switch (role) {
    case 'broker':
      return 'Broker'
    case 'lender':
      return 'Lender'
    case 'realtor':
      return 'Real estate agent'
    default:
      return 'Closing team'
  }
}
