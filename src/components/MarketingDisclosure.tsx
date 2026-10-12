import disclosure from '@/lib/marketing-disclosure.json'

/** Keep the printable handout footers in sync; marketing-disclosures.test.cjs checks them. */
export default function MarketingDisclosure() {
  return <div className="text-xs leading-relaxed text-slate-600 border-t border-slate-200 pt-4" data-marketing-disclosure>
    <p><strong>{disclosure.identity}</strong> {disclosure.scope}</p>
    <p><strong>{disclosure.fundsLabel}</strong> {disclosure.funds}</p>
  </div>
}
