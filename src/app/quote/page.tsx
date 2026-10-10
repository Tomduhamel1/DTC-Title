import EstimateExplanation from '@/components/quote/EstimateExplanation'
import QuoteEntry from '@/components/quote/QuoteEntry'
import { publicMetadata } from '@/lib/publicMetadata'
export const metadata = publicMetadata('/quote', 'Title & Settlement Fee Estimate | BetterClose', 'Get an itemized BetterClose title and settlement fee estimate for your property and loan. No login required.')
export default function QuotePage() { return <><QuoteEntry /><EstimateExplanation /></> }
