'use client'

import { useState } from 'react'
import ShareWithTeamSheet from './lender-request/ShareWithTeamSheet'

export default function PeaceOfMindSection() {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image & Visual Trust Indicators */}
          <div className="relative">
            <div className="flex items-center justify-center gap-6">
              <div className="relative">
                <img
                  src="/operator-face.png"
                  alt="Your dedicated closing specialist"
                  className="w-48 h-48 rounded-2xl object-cover border-4 border-primary-500 shadow-2xl"
                />
                <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border-4 border-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="font-bold text-sm">Email & text</span>
                </div>
                <div className="absolute -top-3 -left-3 bg-primary-600 text-white px-3 py-2 rounded-lg shadow-xl border-4 border-white">
                  <div className="font-black text-2xl leading-none">15+</div>
                  <div className="text-xs font-semibold">Years</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy */}
          <div>
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
              ✓ Start Online. Get Support Your Way.
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4 leading-tight">
              Peace of Mind.<br />
              <span className="text-primary-600">Real People When You Need Them.</span>
            </h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Your home is your biggest investment. Start online in minutes, and know that a dedicated closing specialist will be available by email or text throughout your entire journey.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-dark-900 text-lg">Start Online in 2 Minutes</div>
                  <div className="text-gray-600">Fast, simple process. No sales calls required.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-dark-900 text-lg">Email or text support</div>
                  <div className="text-gray-600">Get answers on your schedule. No phone tag.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-dark-900 text-lg">Easy to Share with Your Team</div>
                  <div className="text-gray-600">Loop in your realtor, lender, or broker in seconds.</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 group"
              >
                <span>Send BetterClose to my team</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <div className="text-sm text-gray-500">
                Takes 30 seconds • No commitment
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        source="peace_of_mind"
      />
    </section>
  )
}
