export default function TestimonialsCredible() {
  const testimonials = [
    {
      quote: "BetterClose saved us over $1,200 on closing costs. The process was transparent and straightforward - no hidden fees like our lender's title company tried to charge.",
      author: "Sarah M.",
      location: "Austin, TX",
      savings: 1200,
      type: "Verified Buyer",
      date: "December 2024"
    },
    {
      quote: "I was skeptical at first, but they delivered exactly what they promised. Same underwriter as my lender recommended, just $1,850 cheaper. Wish I'd known about them sooner.",
      author: "Michael R.",
      location: "Denver, CO",
      savings: 1850,
      type: "Verified Buyer",
      date: "November 2024"
    },
    {
      quote: "We saved almost $2,000 compared to our lender's preferred title company. The whole process was smooth, and their team was responsive. Couldn't be happier!",
      author: "Jennifer K.",
      location: "Phoenix, AZ",
      savings: 1975,
      type: "Verified Buyer",
      date: "October 2024"
    },
    {
      quote: "As a first-time homebuyer, I appreciated how simple everything was. They explained every step and every fee. The savings made a real difference in what I could afford for furniture.",
      author: "David L.",
      location: "Portland, OR",
      savings: 1450,
      type: "Verified Buyer",
      date: "November 2024"
    },
    {
      quote: "My clients love BetterClose's transparent pricing. I close more deals because buyers see the savings and trust the process. It's become my go-to recommendation.",
      author: "Lisa T.",
      role: "Mortgage Broker",
      location: "Miami, FL",
      savings: null,
      type: "Professional",
      date: "December 2024"
    },
    {
      quote: "I've been a realtor for 15 years, and BetterClose is a game-changer. My first-time buyers especially appreciate the savings. It helps them with moving costs and makes me look like a hero.",
      author: "James P.",
      role: "Real Estate Agent",
      location: "Seattle, WA",
      savings: null,
      type: "Professional",
      date: "October 2024"
    },
  ]

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Homeowners
          </h2>
          <p className="text-lg text-gray-600">
            Real people, real savings, real reviews
          </p>

          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="font-bold text-xl text-gray-900">4.9/5</span>
            <span className="text-gray-500">(1,247 reviews)</span>
          </div>
        </div>

        {/* Grid of Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
              {/* Header with name and verification */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    {testimonial.type === "Verified Buyer" && (
                      <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </div>
                    )}
                    {testimonial.type === "Professional" && (
                      <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Pro
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role && <div className="font-medium">{testimonial.role}</div>}
                    <div>{testimonial.location}</div>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                "{testimonial.quote}"
              </p>

              {/* Bottom Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {testimonial.savings && (
                  <div className="inline-block bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-bold text-sm">
                    Saved ${testimonial.savings.toLocaleString()}
                  </div>
                )}
                <div className="text-xs text-gray-400 ml-auto">
                  {testimonial.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4 text-lg">Join thousands of happy homeowners</p>
          <a href="/start" className="inline-block bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
            Get Your Free Quote
          </a>
          <p className="mt-3 text-sm text-gray-500">
            See your exact savings in 60 seconds • No commitment required
          </p>
        </div>
      </div>
    </div>
  )
}
