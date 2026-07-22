'use client'

import { useState } from 'react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First item open by default

  const faqs = [
    {
      question: "How can you be so much cheaper than traditional title companies?",
      answer: "We use technology to eliminate administrative costs that traditional companies pass to you. Instead of expensive offices and large sales teams, we've built an AI-powered platform that automates underwriting and processing. You get the same protection from the same A-rated underwriters (like First American, AmTrust, and Westcor) - we just run a smarter, more efficient operation."
    },
    {
      question: "Is this real title insurance?",
      answer: "Yes, absolutely. We're underwritten by industry-leading title insurance companies with A.M. Best ratings of A or higher — including First American, AmTrust, and Westcor. You get identical coverage and protection that any major title company would issue — the only difference is the price you pay."
    },
    {
      question: "Will my lender accept BetterClose?",
      answer: "Yes. We're licensed in all 50 states and meet all lender requirements. In fact, many lenders actively refer their borrowers to us because it helps reduce closing costs and improves customer satisfaction. We work seamlessly with any mortgage lender, and our policies are accepted nationwide."
    },
    {
      question: "What if there's a problem with the title?",
      answer: "You're covered on both sides of closing. If our title search turns up a problem before you close, attorneys on our team work to clear it so your closing stays on track. After closing, you're protected by industry-leading underwriters with billions of dollars in claims-paying ability - if a covered claim arises, your underwriter handles it completely, the same as they would with any other title company."
    },
    {
      question: "What if a legal issue comes up before closing?",
      answer: "We handle it. A judgment lien, a probate or estate question, a missing signer, a divorce decree on the title - when a file needs legal work to close, attorneys take care of it as part of our title and settlement work. In many states they're our own in-house and affiliated attorneys; in the rest, local real estate attorneys we partner with. You don't have to go find a lawyer, and your closing keeps moving - and if you'd like your own attorney involved, we're happy to work with them."
    },
    {
      question: "How long does the closing process take?",
      answer: "We provide same-day underwriting approval in most cases. The overall closing timeline depends on your lender and other factors, but we never slow things down. Our technology-first approach actually speeds up the process compared to traditional title companies."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No. We believe in complete transparency. When you get a quote from us, you see the exact breakdown of every fee. What you see is what you pay - no surprises at closing. This is one of the ways we're different from traditional title companies that often add unexpected charges."
    },
    {
      question: "Can I use BetterClose if my realtor or lender recommends someone else?",
      answer: "Absolutely. You have the legal right to choose your title company - it's called your 'right to shop.' While your realtor or lender may have a preferred provider, you're not required to use them. Many buyers save thousands by choosing BetterClose instead. Just let your agent and lender know you'll be using us, and we'll handle everything."
    },
    {
      question: "What states do you operate in?",
      answer: "We're licensed and operating in all 50 states. Whether you're buying in California, Texas, Florida, New York, or anywhere else in the US, we can provide you with title insurance at transparent, fair pricing."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about BetterClose
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 transition-colors"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-dark-900 pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Answer Panel */}
              <div
                className={`px-6 bg-gray-50 transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'py-5 max-h-[32rem]' : 'max-h-0 py-0 overflow-hidden'
                }`}
              >
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center p-8 bg-primary-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-dark-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help. Give us a call or send us a message.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:1-800-316-9508"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call 1-800-316-9508
            </a>
            <a
              href="mailto:contact@betterclose.co"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send us a message
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
