import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import OrderByEmailCard from '@/components/lender-portal/OrderByEmailCard'
import {
  buildOrderMailto,
  getLenderRequestContext,
} from '@/lib/teammate/lender-request-context'
import HeroCtas from './HeroCtas'

// Renamed from /for-my-lender. Recipients of a borrower's outreach (lender,
// broker, or realtor) land here. When the URL has ?ref=<refId> we hydrate
// the linked LenderRequest + Closing server-side and prefill the order
// mailto with everything we already know about the borrower's transaction.

export const dynamic = 'force-dynamic'

interface Props {
  searchParams?: { ref?: string }
}

export default async function ForMyTeamPage({ searchParams }: Props) {
  const refId = searchParams?.ref
  const ctx = await getLenderRequestContext(refId)
  const { subject, body } = buildOrderMailto(ctx)
  const isPersonalized = Boolean(ctx?.closing)

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider mb-5">
              For lenders, brokers, &amp; realtors
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-900 leading-tight tracking-tight mb-5">
              A client asked you to consider BetterClose for their closing.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Same A-rated underwriters. Lower closing costs. Five-minute review.
            </p>
            <HeroCtas
              primaryLabel="Email your order →"
              primaryTarget="place-order"
              secondaryLabel="How we work"
              secondaryTarget="how-we-work"
            />
          </div>
        </div>
      </section>

      {/* 3 reasons */}
      <section id="how-we-work" className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-dark-900 mb-3">
                Why your client is reaching out
              </h2>
              <p className="text-lg text-gray-600">
                Same protection your client expects. Lower price. Easier on you.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <ReasonCard
                emoji="🛡️"
                title="Same A-rated underwriters"
                body="First American · AmTrust · Westcor · Old Republic. The title insurance is identical to what you already place with anyone else."
              />
              <ReasonCard
                emoji="📊"
                title="Transparent flat-rate pricing"
                body="Your client sees every line item ahead of time. No junk fees, no surprises at the table — fewer last-minute escalations on your end."
              />
              <ReasonCard
                emoji="🤝"
                title="We coordinate the closing"
                body="We work with you, the realtor, and the borrower directly. You name BetterClose in closing instructions; we handle scheduling, docs, and disbursement."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tools strip */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">
              Find us in the tools you already use
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-base font-bold text-gray-700">
              <span>SmartFees</span>
              <span className="text-gray-300">·</span>
              <span>Encompass</span>
              <span className="text-gray-300">·</span>
              <span>Qualia</span>
              <span className="text-gray-300">·</span>
              <span>ResWare</span>
            </div>
          </div>
        </div>
      </section>

      {/* Place an order */}
      <section id="place-order" className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <OrderByEmailCard
              refId={refId}
              prefilledSubject={subject}
              prefilledBody={body}
              isPersonalized={isPersonalized}
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <UnderwriterLogos />

      <FooterComprehensive />
    </>
  )
}

function ReasonCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-4xl mb-3" aria-hidden="true">{emoji}</div>
      <h3 className="text-lg font-bold text-dark-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
    </div>
  )
}
