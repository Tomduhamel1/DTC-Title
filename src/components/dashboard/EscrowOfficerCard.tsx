'use client'

import Image from 'next/image'

interface EscrowOfficer {
  name: string | null
  title: string | null
  email: string | null
  phone: string | null
  nmls: string | null
  photoUrl: string | null
}

interface EscrowOfficerCardProps {
  officer: EscrowOfficer
  /**
   * "rail" — compact vertical layout for the right-rail aside.
   * "main" — full-width horizontal layout for the main column card.
   */
  variant?: 'rail' | 'main'
}

export default function EscrowOfficerCard({ officer, variant = 'main' }: EscrowOfficerCardProps) {
  const assigned = Boolean(officer.name)

  if (variant === 'rail') {
    return (
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 mb-3">
          Your closing officer
        </div>
        {assigned ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-gray-100 ring-2 ring-emerald-100">
                {officer.photoUrl ? (
                  <Image
                    src={officer.photoUrl}
                    alt={officer.name || ''}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-700 font-bold text-lg">
                    {(officer.name || '').slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-dark-900 leading-tight truncate">
                  {officer.name}
                </div>
                <div className="text-[11px] text-gray-500 leading-tight mt-0.5 truncate">
                  {officer.title || 'Escrow Officer'}
                </div>
                {officer.nmls && (
                  <div className="text-[10px] text-gray-400 mt-0.5">NMLS #{officer.nmls}</div>
                )}
              </div>
            </div>
            <div className="space-y-1.5 text-[12px]">
              {officer.email && (
                <a
                  href={`mailto:${officer.email}`}
                  className="block text-emerald-700 hover:text-emerald-800 truncate font-medium"
                >
                  {officer.email}
                </a>
              )}
              {officer.phone && (
                <a
                  href={`tel:${officer.phone.replace(/[^\d+]/g, '')}`}
                  className="block text-gray-700 hover:text-emerald-700 font-medium"
                >
                  {officer.phone}
                </a>
              )}
            </div>
          </>
        ) : (
          <RailPlaceholder />
        )}
      </div>
    )
  }

  // main variant
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-dark-900 leading-tight">
          Your dedicated closing officer
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          One person handles your closing end-to-end.
        </p>
      </div>
      <div className="p-5">
        {assigned ? (
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-100 ring-4 ring-emerald-50">
              {officer.photoUrl ? (
                <Image
                  src={officer.photoUrl}
                  alt={officer.name || ''}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-700 font-bold text-3xl">
                  {(officer.name || '').slice(0, 1)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-black text-dark-900 leading-tight">
                {officer.name}
              </div>
              <div className="text-sm text-emerald-700 font-semibold mt-0.5">
                {officer.title || 'Escrow Officer'}
              </div>
              {officer.nmls && (
                <div className="text-[11px] text-gray-500 mt-1">NMLS #{officer.nmls}</div>
              )}
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {(officer.name || '').split(' ')[0]} is your direct contact for everything related to
                this closing — questions, status updates, document review, and the closing itself.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {officer.email && (
                  <a
                    href={`mailto:${officer.email}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    <span>✉️</span>
                    {officer.email}
                  </a>
                )}
                {officer.phone && (
                  <a
                    href={`tel:${officer.phone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    <span>📞</span>
                    {officer.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <MainPlaceholder />
        )}
      </div>
    </div>
  )
}

function RailPlaceholder() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div className="text-[12px] text-gray-500 leading-snug">
        Assigned when your order is opened — usually within 1 business day.
      </div>
    </div>
  )
}

function MainPlaceholder() {
  return (
    <div className="flex flex-col sm:flex-row gap-5 items-start">
      <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 ring-4 ring-gray-50 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
          Assignment pending
        </div>
        <div className="text-xl font-black text-dark-900 leading-tight mt-2">
          Your officer will be assigned shortly
        </div>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Once your lender opens the order with us, we&apos;ll match you with the right closing
          officer for your transaction — typically within one business day. They&apos;ll
          introduce themselves by email and be your single point of contact through closing.
        </p>
      </div>
    </div>
  )
}
