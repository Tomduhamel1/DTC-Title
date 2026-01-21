'use client'

import { useState } from 'react'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      quote: "TrueFee Closing saved us over $1,200 on closing costs for our new home. The process was transparent and straightforward - no surprises at closing.",
      author: "Sarah M.",
      location: "Austin, TX",
      savings: 1200,
    },
    {
      quote: "I was skeptical about the savings, but they delivered exactly what they promised. Same underwriter, same coverage, but at a fraction of the cost.",
      author: "Michael R.",
      location: "Denver, CO",
      savings: 980,
    },
    {
      quote: "The team made our refinance closing smooth and saved us nearly $900. Highly recommend for anyone looking to reduce closing costs.",
      author: "Jennifer L.",
      location: "Seattle, WA",
      savings: 890,
    },
  ]

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600">
            Real experiences from homeowners who saved with TrueFee Closing
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-primary-50 rounded-2xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center">
            {/* Quote Icon */}
            <div className="text-6xl text-primary-200 mb-4">"</div>

            {/* Testimonial Content */}
            <div className="mb-8">
              <p className="text-xl md:text-2xl text-gray-800 mb-6 italic">
                {testimonials[currentIndex].quote}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentIndex].author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentIndex].location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Saved</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {formatCurrency(testimonials[currentIndex].savings)}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-between items-center">
              <button
                onClick={goToPrev}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-primary-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Testimonials represent actual client experiences. Savings amounts verified at closing.
          </p>
        </div>
      </div>
    </div>
  )
}
