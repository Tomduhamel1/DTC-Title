'use client'

import { useState, useEffect } from 'react'
import AICalculatorModule from './AICalculatorModule'
import { calculateSavings, getInitialSavings, SavingsFactors } from '@/lib/savingsCalculator'

// Item catalog (same as in AICalculatorModule)
const itemCatalog = [
  { name: 'bottomless mimosa brunch', plural: 'bottomless mimosa brunches', price: 40, emoji: '🥂' },
  { name: 'fancy pizza date night', plural: 'fancy pizza date nights', price: 50, emoji: '🍕' },
  { name: 'TopGolf session', plural: 'TopGolf sessions', price: 50, emoji: '⛳' },
  { name: 'hibachi dinner for two', plural: 'hibachi dinners for two', price: 70, emoji: '🔥' },
  { name: 'axe throwing date night', plural: 'axe throwing date nights', price: 70, emoji: '🪓' },
  { name: 'wine tasting for two', plural: 'wine tastings for two', price: 80, emoji: '🍷' },
  { name: 'rage room session', plural: 'rage room sessions', price: 80, emoji: '😤' },
  { name: 'escape room adventure', plural: 'escape room adventures', price: 60, emoji: '🔐' },
  { name: 'couples massage', plural: 'couples massages', price: 120, emoji: '💆‍♀️' },
  { name: 'sushi-making class', plural: 'sushi-making classes', price: 120, emoji: '🍣' },
  { name: 'steakhouse dinner for two', plural: 'steakhouse dinners for two', price: 180, emoji: '🥩' },
  { name: 'Six Flags day trip', plural: 'Six Flags day trips', price: 150, emoji: '🎢' },
  { name: 'professional photoshoot', plural: 'professional photoshoots', price: 200, emoji: '📸' },
  { name: 'hot air balloon ride', plural: 'hot air balloon rides', price: 250, emoji: '🎈' },
  { name: 'spa day with treatments', plural: 'spa days with treatments', price: 220, emoji: '💅' },
  { name: 'night at Hamilton on Broadway', plural: 'nights at Hamilton on Broadway', price: 280, emoji: '🎭' },
  { name: 'pair of AirPods Pro', plural: 'pairs of AirPods Pro', price: 250, emoji: '🎧' },
  { name: 'Nintendo Switch bundle', plural: 'Nintendo Switch bundles', price: 350, emoji: '🎮' },
  { name: 'Nike & Lululemon haul', plural: 'Nike & Lululemon hauls', price: 300, emoji: '👟' },
  { name: 'weekend in Nashville', plural: 'weekends in Nashville', price: 450, emoji: '🎸' },
  { name: 'Austin BBQ crawl weekend', plural: 'Austin BBQ crawl weekends', price: 500, emoji: '🍖' },
  { name: 'beachside Airbnb weekend', plural: 'beachside Airbnb weekends', price: 550, emoji: '🏖️' },
  { name: 'MacBook Air', plural: 'MacBook Airs', price: 999, emoji: '💻' },
  { name: 'mountain bike', plural: 'mountain bikes', price: 800, emoji: '🚵' },
  { name: 'Caribbean cruise', plural: 'Caribbean cruises', price: 1400, emoji: '🚢' },
  { name: 'Disney World family trip', plural: 'Disney World family trips', price: 1800, emoji: '🏰' },
  { name: 'week in Maui', plural: 'weeks in Maui', price: 2200, emoji: '🌺' }
]

const getSavingsIdeas = (amount: number) => {
  const ideas = []
  for (const item of itemCatalog) {
    const quantity = Math.floor(amount / item.price)
    if (quantity >= 1 && quantity <= 10) {
      if (quantity === 1) {
        ideas.push({ text: item.name, emoji: item.emoji })
      } else {
        ideas.push({ text: `${quantity} ${item.plural}`, emoji: item.emoji })
      }
    }
  }
  return ideas.sort(() => Math.random() - 0.5).slice(0, 25)
}

interface AICalculatorWithIdeasProps {
  compact?: boolean
}

export default function AICalculatorWithIdeas({ compact = false }: AICalculatorWithIdeasProps) {
  // Track savings to display ideas
  const [transactionType] = useState<'purchase' | 'refinance'>('purchase')
  const [homeValue] = useState('500000')
  const [selectedState] = useState('Texas')
  const [factors] = useState<SavingsFactors>({
    remoteSigning: null,
    docsReady: null,
    hasCD: null,
    titleComplexity: null,
    lenderSwitch: null
  })

  const homeValueNum = parseFloat(homeValue.replace(/[^0-9.]/g, '')) || 500000
  const savings = getInitialSavings(transactionType, homeValueNum, selectedState)

  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0)
  const [savingsIdeas, setSavingsIdeas] = useState<Array<{text: string, emoji: string}>>([])

  // Compute savings ideas on client side only to avoid hydration mismatch
  useEffect(() => {
    setSavingsIdeas(getSavingsIdeas(savings.totalSavings))
  }, [savings.totalSavings])

  useEffect(() => {
    if (savingsIdeas.length > 0) {
      const interval = setInterval(() => {
        setCurrentIdeaIndex(prev => (prev + 1) % savingsIdeas.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [savingsIdeas.length])

  return (
    <div className={`flex flex-col ${compact ? 'gap-2' : 'gap-4'}`}>
      <AICalculatorModule compact={compact} />

      {/* Rotating Savings Ideas - Below Calculator */}
      {savingsIdeas.length > 0 && (
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border border-emerald-200 shadow-md ${
            compact ? 'px-5 py-4' : 'px-8 py-6'
          }`}
        >
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
          <div className={`flex items-center ${compact ? 'gap-4' : 'gap-6'}`}>
            <div
              key={`emoji-${currentIdeaIndex}`}
              className={`flex-shrink-0 flex items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-emerald-100 animate-[fadeSwap_500ms_ease-out] ${
                compact ? 'w-14 h-14 text-3xl' : 'w-20 h-20 text-5xl'
              }`}
              aria-hidden="true"
            >
              {savingsIdeas[currentIdeaIndex].emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={`text-emerald-700 uppercase tracking-[0.15em] font-semibold leading-none ${
                  compact ? 'text-[11px] mb-1.5' : 'text-xs mb-2'
                }`}
              >
                That's enough for
              </div>
              <div
                key={`text-${currentIdeaIndex}`}
                className={`font-bold text-dark-900 leading-tight animate-[fadeSwap_500ms_ease-out] ${
                  compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'
                }`}
              >
                {savingsIdeas[currentIdeaIndex].text}
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeSwap {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
