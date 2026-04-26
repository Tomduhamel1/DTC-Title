export default function Testimonials() {
  const testimonials = [
    {
      quote: "BetterClose saved us over $1,200 on closing costs. The process was transparent and straightforward.",
      author: "Sarah M.",
      location: "Austin, TX",
      savings: 1200,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      quote: "I was skeptical, but they delivered exactly what they promised. Same underwriter, better price.",
      author: "Michael R.",
      location: "Denver, CO",
      savings: 1850,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      quote: "We saved almost $2,000 compared to our lender's title company. Couldn't be happier!",
      author: "Jennifer K.",
      location: "Phoenix, AZ",
      savings: 1975,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    },
    {
      quote: "As a first-time homebuyer, I appreciated how simple everything was. The savings made a real difference.",
      author: "David L.",
      location: "Portland, OR",
      savings: 1450,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      quote: "The team was professional and responsive. Saved us $1,600 without any hassle.",
      author: "Maria G.",
      location: "Miami, FL",
      savings: 1600,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    },
    {
      quote: "Switched from my realtor's recommendation and saved $1,350. Wish I'd known about them sooner!",
      author: "James T.",
      location: "Seattle, WA",
      savings: 1350,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
  ]

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Thousands of Happy Homeowners
          </h2>
          <p className="text-lg text-gray-600">
            Real people, real savings on closing costs
          </p>
        </div>

        {/* Grid of Testimonials with Faces */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Savings Badge */}
              <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold">
                Saved ${testimonial.savings.toLocaleString()}
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Ready to save on your closing costs?</p>
          <a href="/start" className="inline-block bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg">
            Get Your Free Quote
          </a>
        </div>
      </div>
    </div>
  )
}
