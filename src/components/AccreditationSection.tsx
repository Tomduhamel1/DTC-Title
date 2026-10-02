export default function AccreditationSection() {
  const trustBadges = [
    { name: 'Line-by-line pricing', logo: '✓' },
    { name: 'A dedicated closing team', logo: '✓' },
  ]

  return (
    <section aria-labelledby="accreditation-heading" className="py-10 bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 id="accreditation-heading" className="text-center text-sm text-gray-500 mb-4 font-semibold">
          TRANSPARENT PRICING. REAL PEOPLE.
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {trustBadges.map(badge => (
            <div key={badge.name} className="flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">{badge.logo}</span>
              <span className="text-sm font-medium text-gray-700">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
