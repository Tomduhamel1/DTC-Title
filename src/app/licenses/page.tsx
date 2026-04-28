import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'

export const metadata = {
  title: 'BetterClose · State Licenses',
  description: 'Licenses, registrations, and workshare partnerships across all 50 states.',
}

// TODO: Confirm exact license numbers and the 34 directly-licensed states with
// compliance. The list below uses placeholders where the number is unknown so
// the page is publishable now; replace each "[number]" with the real value.

interface LicenseEntry {
  state: string
  number: string
}

const DIRECT_LICENSES: LicenseEntry[] = [
  { state: 'Alabama', number: '[number]' },
  { state: 'Arizona', number: '[number]' },
  { state: 'Arkansas', number: '[number]' },
  { state: 'Colorado', number: '[number]' },
  { state: 'Connecticut', number: '[number]' },
  { state: 'Delaware', number: '[number]' },
  { state: 'Florida', number: '[number]' },
  { state: 'Georgia', number: '[number]' },
  { state: 'Idaho', number: '[number]' },
  { state: 'Illinois', number: '[number]' },
  { state: 'Indiana', number: '[number]' },
  { state: 'Iowa', number: '[number]' },
  { state: 'Kansas', number: '[number]' },
  { state: 'Kentucky', number: '[number]' },
  { state: 'Louisiana', number: '[number]' },
  { state: 'Maine', number: '[number]' },
  { state: 'Maryland', number: '[number]' },
  { state: 'Massachusetts', number: '[number]' },
  { state: 'Michigan', number: '[number]' },
  { state: 'Mississippi', number: '[number]' },
  { state: 'Missouri', number: '[number]' },
  { state: 'New Hampshire', number: '[number]' },
  { state: 'New Jersey', number: '[number]' },
  { state: 'New York', number: '[number]' },
  { state: 'North Carolina', number: '[number]' },
  { state: 'Ohio', number: '[number]' },
  { state: 'Oklahoma', number: '[number]' },
  { state: 'Pennsylvania', number: '[number]' },
  { state: 'Rhode Island', number: '[number]' },
  { state: 'South Carolina', number: '[number]' },
  { state: 'Tennessee', number: '[number]' },
  { state: 'Texas', number: '[number]' },
  { state: 'Vermont', number: '[number]' },
  { state: 'Virginia', number: '[number]' },
]

// States where we close via a licensed workshare partner.
const WORKSHARE_STATES = [
  'Alaska',
  'California',
  'Hawaii',
  'Minnesota',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Mexico',
  'North Dakota',
  'Oregon',
  'South Dakota',
  'Utah',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
]

export default function LicensesPage() {
  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-50 min-h-[calc(100vh-5rem)] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Compliance
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-dark-900 mb-3">
              Where we operate
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              BetterClose is directly licensed in {DIRECT_LICENSES.length} states.
              For the remaining states, we close every transaction through a
              licensed workshare partner.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-dark-900">
                Direct state licenses ({DIRECT_LICENSES.length})
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Licensed and regulated by each state's department of insurance
                or banking.
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {DIRECT_LICENSES.map((l) => (
                <div
                  key={l.state}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="text-sm font-semibold text-dark-900">
                    {l.state}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    Lic # {l.number}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-dark-900">
                Workshare states ({WORKSHARE_STATES.length})
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                For closings in these states, BetterClose coordinates with a
                local licensed title agent to complete the transaction. You get
                the same BetterClose pricing and digital experience.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2 px-6 py-5">
              {WORKSHARE_STATES.map((s) => (
                <div key={s} className="text-sm text-dark-900 font-medium">
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            Questions about licensing or compliance? Email{' '}
            <a href="mailto:compliance@betterclose.co" className="underline font-semibold text-primary-700">
              compliance@betterclose.co
            </a>
            .
          </div>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}
