'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import OrderByEmailCard from '@/components/lender-portal/OrderByEmailCard'

function LenderPageInner() {
  const searchParams = useSearchParams()
  const refId = searchParams.get('ref') || undefined

  const scrollTo = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider mb-5">
              For lenders & realtors
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-900 leading-tight tracking-tight mb-5">
              A client asked you to consider BetterClose for their closing.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Same A-rated underwriters. Lower closing costs. Five-minute review.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={scrollTo('place-order')}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Email your order →
              </button>
              <button
                onClick={scrollTo('how-we-work')}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-bold text-lg px-8 py-4 rounded-lg transition-colors"
              >
                How we work
              </button>
            </div>
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
                body="First American · Old Republic · Stewart · Fidelity. The title insurance is identical to what you already place with anyone else."
              />
              <ReasonCard
                emoji="📊"
                title="Transparent flat-rate pricing"
                body="Your client sees every line item before signing. No junk fees, no surprises at the table — fewer last-minute escalations on your end."
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
            <OrderByEmailCard refId={refId} />
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

export default function ForMyLenderPage() {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <LenderPageInner />
    </Suspense>
  )
}
