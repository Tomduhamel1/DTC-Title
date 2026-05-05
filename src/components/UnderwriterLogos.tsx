'use client'

import Image from 'next/image'

export default function UnderwriterLogos() {
  const underwriters = [
    {
      name: 'First American Financial',
      logoUrl: '/logos/FAF.png',
    },
    {
      name: 'AmTrust Title',
      logoUrl: '/logos/amtrust.jpg',
    },
    {
      name: 'Westcor Land Title',
      logoUrl: '/logos/westcor.png',
    },
    {
      name: 'CATIC',
      logoUrl: '/logos/catic_logo-1-768x137.png',
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-dark-900 mb-3">
            Backed By America's Most Trusted Underwriters
          </h2>
          <p className="text-xl text-gray-600">
            Same protection. Same reliability. <span className="text-primary-600 font-bold">Better price.</span>
          </p>
        </div>

        {/* Logo Grid with REAL Logo Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto items-center">
          {underwriters.map((underwriter) => (
            <div
              key={underwriter.name}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-28 border border-gray-200"
            >
              <img
                src={underwriter.logoUrl}
                alt={underwriter.name}
                className="max-h-16 max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
