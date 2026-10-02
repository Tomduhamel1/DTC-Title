'use client'

import { offeredStateCount } from '@/lib/stateMaster'
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'

import { useState } from 'react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First item open by default

  const faqs = [
    {
      question: "Where do the savings come from?",
      answer: "We use technology to streamline coordination and price our title and settlement services competitively. Our transparent, line-by-line pricing shows which service charges you can compare and separates title insurance premiums, recording fees, and taxes. Your savings depend on the property, services, and alternative quote."
    },
    {
      question: "Is this real title insurance?",
      answer: "Yes. We work with established title insurance underwriters, including those shown on this page. Your closing team can explain the policy, coverage, requirements, and exceptions for your property. Our savings comparisons focus on service charges, not discounts to insurance premiums."
    },
    {
      question: "Will my lender accept BetterClose?",
      answer: "You can keep your lender. Our closing team coordinates with them and confirms their settlement-agent and title requirements for your transaction before proceeding."
    },
    {
      question: "What if there's a problem with the title?",
      answer: "The closing team reviews the title search and identifies requirements and exceptions that need attention. If an issue comes up, the team will explain the next steps and any effect on timing. After closing, coverage and claim handling depend on the issued title insurance policy."
    },
    {
      question: "What if a legal issue comes up before closing?",
      answer: "Our closing team coordinates with in-house, affiliated, or local attorneys when legal work is needed for the transaction. We will explain the work required and any effect on costs or timing. You can also involve your own attorney."
    },
    {
      question: "How long does the closing process take?",
      answer: "Timing depends on the title work, lender requirements, documents, and any issues that need to be resolved. Your assigned closing team will coordinate the target date and keep you informed as the file progresses."
    },
    {
      question: "Are there any hidden fees?",
      answer: "Our pricing is transparent, line by line: see what each charge covers, how our service fees compare, and which costs come from insurers or government agencies. Your estimate reflects the details available at the time. If the file or required services change, your closing team will explain changes to the final charges."
    },
    {
      question: "Can I use BetterClose if my realtor or lender recommends someone else?",
      answer: "You can ask your agent or lender to compare BetterClose with their preferred option. Review the service fees side by side, and have your closing team confirm the transaction requirements before ordering. You do not need to change your agent or lender to request a BetterClose estimate."
    },
    {
      question: "What states do you operate in?",
      answer: `Our online estimates currently support ${offeredStateCount()} states. Enter the property's location to check availability for your transaction. If estimates are unavailable, you can request an availability notification or contact our team for licensing and service details.`
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
              href={`tel:${SUPPORT_PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call {SUPPORT_PHONE_DISPLAY}
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
