'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChatInterface, { Message } from './ChatInterface'
import Testimonials from './Testimonials'
import UnderwriterLogos from './UnderwriterLogos'
import TrustBadges from './TrustBadges'
import { calculateSavings, getInitialSavings, SavingsFactors } from '@/lib/savingsCalculator'

// Item catalog with actual prices (singular form for multiples)
const itemCatalog = [
  // Small items ($30-$100)
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
  { name: 'paint and sip night', plural: 'paint and sip nights', price: 50, emoji: '🎨' },
  { name: 'comedy club VIP night', plural: 'comedy club VIP nights', price: 90, emoji: '😂' },
  { name: 'trampoline park pass', plural: 'trampoline park passes', price: 60, emoji: '🤸' },
  { name: 'go-kart racing session', plural: 'go-kart racing sessions', price: 80, emoji: '🏎️' },
  { name: 'bowling night with the crew', plural: 'bowling nights with the crew', price: 70, emoji: '🎳' },

  // Medium items ($150-$350)
  { name: 'steakhouse dinner for two', plural: 'steakhouse dinners for two', price: 180, emoji: '🥩' },
  { name: 'Six Flags day trip', plural: 'Six Flags day trips', price: 150, emoji: '🎢' },
  { name: 'professional photoshoot', plural: 'professional photoshoots', price: 200, emoji: '📸' },
  { name: 'hot air balloon ride', plural: 'hot air balloon rides', price: 250, emoji: '🎈' },
  { name: 'spa day with treatments', plural: 'spa days with treatments', price: 220, emoji: '💅' },
  { name: 'night at Hamilton on Broadway', plural: 'nights at Hamilton on Broadway', price: 280, emoji: '🎭' },
  { name: 'pair of AirPods Pro', plural: 'pairs of AirPods Pro', price: 250, emoji: '🎧' },
  { name: 'Nintendo Switch bundle', plural: 'Nintendo Switch bundles', price: 350, emoji: '🎮' },
  { name: 'Nike & Lululemon haul', plural: 'Nike & Lululemon hauls', price: 300, emoji: '👟' },
  { name: 'NFL club seat ticket', plural: 'NFL club seat tickets', price: 350, emoji: '🏈' },
  { name: 'fancy hotel staycation', plural: 'fancy hotel staycations', price: 300, emoji: '🏨' },
  { name: 'designer sunglasses', plural: 'pairs of designer sunglasses', price: 200, emoji: '🕶️' },
  { name: 'concert ticket (good seats)', plural: 'concert tickets (good seats)', price: 200, emoji: '🎵' },
  { name: 'indoor skydiving session', plural: 'indoor skydiving sessions', price: 150, emoji: '🪂' },

  // Large items ($400-$1000)
  { name: 'weekend in Nashville', plural: 'weekends in Nashville', price: 450, emoji: '🎸' },
  { name: 'Austin BBQ crawl weekend', plural: 'Austin BBQ crawl weekends', price: 500, emoji: '🍖' },
  { name: 'Yosemite camping trip', plural: 'Yosemite camping trips', price: 400, emoji: '⛺' },
  { name: 'beachside Airbnb weekend', plural: 'beachside Airbnb weekends', price: 550, emoji: '🏖️' },
  { name: 'New Orleans food tour', plural: 'New Orleans food tours', price: 600, emoji: '🎺' },
  { name: 'Miami Beach weekend', plural: 'Miami Beach weekends', price: 700, emoji: '🌴' },
  { name: 'MacBook Air', plural: 'MacBook Airs', price: 999, emoji: '💻' },
  { name: 'mountain bike', plural: 'mountain bikes', price: 800, emoji: '🚵' },

  // Premium items ($1000+) - usually don't need multiples
  { name: 'Caribbean cruise', plural: 'Caribbean cruises', price: 1400, emoji: '🚢' },
  { name: 'Disney World family trip', plural: 'Disney World family trips', price: 1800, emoji: '🏰' },
  { name: 'week in Maui', plural: 'weeks in Maui', price: 2200, emoji: '🌺' },
  { name: 'Cancun all-inclusive resort week', plural: 'Cancun all-inclusive resort weeks', price: 1900, emoji: '🏝️' },
  { name: 'wine country getaway', plural: 'wine country getaways', price: 1200, emoji: '🍇' }
]

// Simple scaled items generator - one item type with multiples
const getSavingsIdeas = (amount: number) => {
  const ideas = []

  for (const item of itemCatalog) {
    // How many of this item can we afford?
    const quantity = Math.floor(amount / item.price)

    if (quantity >= 1 && quantity <= 10) {
      // If exactly 1, use singular
      if (quantity === 1) {
        ideas.push({
          text: item.name,
          emoji: item.emoji
        })
      } else {
        // Multiple items
        ideas.push({
          text: `${quantity} ${item.plural}`,
          emoji: item.emoji
        })
      }
    }
  }

  // Shuffle and return
  return ideas.sort(() => Math.random() - 0.5).slice(0, 25)
}

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
]

export default function StoryCalculator() {
  // Form state
  const [transactionType, setTransactionType] = useState<'purchase' | 'refinance'>('purchase')
  const [homeValue, setHomeValue] = useState('')
  const [selectedState, setSelectedState] = useState('Texas')

  // Get user's location to set default state
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.region && STATES.includes(data.region)) {
          setSelectedState(data.region)
        }
      })
      .catch(() => {})
  }, [])

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationStarted, setConversationStarted] = useState(false)
  const [chatExpanded, setChatExpanded] = useState(false)

  // Savings factors state
  const [factors, setFactors] = useState<SavingsFactors>({
    remoteSigning: null,
    docsReady: null,
    hasCD: null,
    titleComplexity: null,
    lenderSwitch: null
  })

  // Savings calculation
  const homeValueNum = parseFloat(homeValue.replace(/[^0-9.]/g, '')) || 500000
  const savings = conversationStarted
    ? calculateSavings(transactionType, homeValueNum, selectedState, factors)
    : getInitialSavings(transactionType, homeValueNum, selectedState)

  // Rotating savings ideas
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0)
  const savingsIdeas = getSavingsIdeas(savings.totalSavings)

  useEffect(() => {
    if (savingsIdeas.length > 0) {
      const interval = setInterval(() => {
        setCurrentIdeaIndex(prev => (prev + 1) % savingsIdeas.length)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [savingsIdeas.length])

  // Format currency input
  const handleHomeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value) {
      const formatted = parseInt(value).toLocaleString()
      setHomeValue(formatted)
    } else {
      setHomeValue('')
    }
  }

  // Initialize conversation on mount
  useEffect(() => {
    setConversationStarted(true)
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Hi! Any questions? Want to see if you can save more?`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    if (!chatExpanded) {
      setChatExpanded(true)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    const currentMessageCount = messages.length + 1

    setTimeout(() => {
      const aiResponse = generateAIResponse(content, currentMessageCount, factors)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])

      if (aiResponse.updatedFactors) {
        setFactors(aiResponse.updatedFactors)
      }

      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - eLEND Style */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <svg className="h-10" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path
                      d="M8 20L20 8L32 20V34C32 35.1046 31.1046 36 30 36H10C8.89543 36 8 35.1046 8 34V20Z"
                      fill="#0693e3"
                      stroke="#0693e3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 24L18 28L26 18"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <text x="42" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontSize="22" fontWeight="700" fill="#0693e3" letterSpacing="-0.5">
                    BetterClose
                  </text>
                </svg>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
                Calculate Savings
              </Link>
              <Link href="/quote" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
                Fee estimate
              </Link>
              <Link href="#how-it-works" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
                How It Works
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <a href="tel:1-800-316-9508" className="hidden lg:flex items-center gap-3 text-dark-800 hover:text-primary-600 font-medium transition-colors group">
                <div className="relative">
                  <img
                    src="/operator-face.png"
                    alt="Customer service representative"
                    className="w-16 h-16 rounded-full object-cover border-3 border-primary-400 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-medium">Talk to a real person</div>
                  <div className="font-bold text-lg text-primary-600 group-hover:text-primary-700">1.800.316.9508</div>
                </div>
              </a>
              <Link href="/quote" className="bg-primary-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-primary-700 transition-colors">
                Get fee estimate
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* Headline Section */}
      <div className="w-full bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-dark-900 mb-4 leading-tight">
            Don't overpay for closing costs!<br />
            <span className="text-primary-600">You have a choice.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-semibold">
            Same realtor. Same lender. Same insurer.<br />
            <span className="text-primary-600">Better closing cost.</span>
          </p>
        </div>
      </div>

      {/* The Savings Banner - FULL WIDTH */}
      <div className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-white/80 text-sm md:text-base font-semibold mb-2">
            In {selectedState} for a ${(homeValueNum || 500000).toLocaleString()} home
          </div>
          <div className="text-white text-3xl md:text-5xl font-black mb-2 tracking-wide">
            YOU SAVE
          </div>
          <div className="text-white text-[100px] md:text-[140px] font-black leading-none mb-4">
            ${savings.totalSavings.toLocaleString()}
          </div>
          <div className="text-white/90 text-base md:text-lg mb-6">
            vs. traditional closing costs
          </div>

          {/* Rotating Savings Ideas - Inside Banner */}
          {savingsIdeas.length > 0 && (
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-emerald-400 rounded-lg p-4 shadow-lg">
                <div className="text-emerald-900 text-xs uppercase tracking-wide font-bold mb-1">That's enough for</div>
                <div className="text-xl md:text-2xl font-black text-green-900 transition-all duration-500">
                  <span className="text-3xl mr-2">{savingsIdeas[currentIdeaIndex].emoji}</span>
                  {savingsIdeas[currentIdeaIndex].text}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real People, Real Support Section */}
      <div className="w-full bg-white py-16 border-y-2 border-blue-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Image & Visual Trust Indicators */}
            <div className="relative">
              <div className="flex items-center justify-center gap-6">
                {/* Main Operator Image */}
                <div className="relative">
                  <img
                    src="/operator-face.png"
                    alt="Your dedicated closing specialist"
                    className="w-48 h-48 rounded-2xl object-cover border-4 border-primary-500 shadow-2xl"
                  />
                  {/* Online Chat Indicator */}
                  <div className="absolute -bottom-3 -right-3 bg-green-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border-4 border-white">
                    <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-sm">Chat Available</span>
                  </div>
                  {/* Years of Experience Badge */}
                  <div className="absolute -top-3 -left-3 bg-primary-600 text-white px-3 py-2 rounded-lg shadow-xl border-4 border-white">
                    <div className="font-black text-2xl leading-none">15+</div>
                    <div className="text-xs font-semibold">Years</div>
                  </div>
                </div>

                {/* Communication Channel Icons */}
                <div className="hidden md:flex flex-col gap-3">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 border-3 border-white shadow-lg flex items-center justify-center" title="Live Chat">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 border-3 border-white shadow-lg flex items-center justify-center" title="Text/Email">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="text-center text-xs font-bold text-gray-600">
                    Chat, text,<br/>or email
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Reassuring Copy */}
            <div>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
                ✓ Start Online. Get Support Your Way.
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4 leading-tight">
                Simple Online Process.<br />
                <span className="text-primary-600">Real People When You Need Them.</span>
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Your home is your biggest investment. Start online in minutes, and know that a dedicated closing specialist will be available by chat, text, or email throughout your entire journey.
              </p>

              {/* Trust Points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-dark-900 text-lg">Start Online in 2 Minutes</div>
                    <div className="text-gray-600">Fast, simple process. No sales calls required.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-dark-900 text-lg">Chat, Text, or Email Support</div>
                    <div className="text-gray-600">Get answers on your schedule. No phone tag.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-dark-900 text-lg">Easy to Share with Your Team</div>
                    <div className="text-gray-600">Loop in your realtor, lender, or broker in seconds.</div>
                  </div>
                </div>
              </div>

              {/* Primary CTA - Online */}
              <div className="space-y-3 mb-6">
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-primary-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 group w-full justify-center"
                >
                  <span>Get my fee estimate</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <div className="text-center text-sm text-gray-500">
                  Takes 30 seconds • No commitment
                </div>
              </div>

              {/* Secondary CTAs - Share with Team or Contact Options */}
              <div className="grid md:grid-cols-2 gap-3">
                <Link
                  href="/share"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share with My Team</span>
                </Link>

                <button
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span>Chat or Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What Stays The Same - Full Width Section */}
      <div className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-dark-900 mb-3">
              Everything Else Stays <span className="text-blue-600">Exactly The Same</span>
            </h2>
            <p className="text-xl text-gray-600">Same people. Same protection. Same quality.</p>
          </div>

          {/* Three Column Layout */}
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Your Realtor */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Your Realtor</h3>
              <p className="text-gray-600">Same trusted advisor</p>
            </div>

            {/* Your Lender */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Your Lender</h3>
              <p className="text-gray-600">Works with all banks</p>
            </div>

            {/* Title Insurance */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Title Insurance</h3>
              <p className="text-gray-600">Same protection</p>
            </div>
          </div>

          {/* Logos - Simple Grid */}
          <div className="border-t border-gray-200 pt-12">
            <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
              <img src="/lenders/Rocket-Companies-Logo-New-500x281.png" alt="Rocket Mortgage" className="h-8 object-contain opacity-60 hover:opacity-100 transition" />
              <img src="/lenders/Chase_logo_2007.svg.png" alt="Chase" className="h-7 object-contain opacity-60 hover:opacity-100 transition" />
              <img src="/lenders/wells-fargo-logo-transparent.png" alt="Wells Fargo" className="h-7 object-contain opacity-60 hover:opacity-100 transition" />
              <img src="/lenders/Bank_of_America-Logo.wine.svg" alt="Bank of America" className="h-7 object-contain opacity-60 hover:opacity-100 transition" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <img src="/underwriters/fidelity-national-title-insurance-company-vector-logo.png" alt="Fidelity" className="h-7 object-contain opacity-60 hover:opacity-100 transition" />
              <img src="/underwriters/First_American_Title_logo.svg.png" alt="First American" className="h-7 object-contain opacity-60 hover:opacity-100 transition" />
              <img src="/underwriters/old-republic-title-logo-vector.png" alt="Old Republic" className="h-7 object-contain opacity-60 hover:opacity-100 transition" />
              <img src="/underwriters/stewart-title-logo-vector.png" alt="Stewart" className="h-7 object-contain opacity-60 hover:opacity-100 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Easy Ways to Get Started Section */}
      <div className="w-full bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600">
              Choose the option that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Get Started Online - PRIMARY */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-black text-2xl text-white mb-3">See your fees</h3>
              <p className="text-white/90 text-sm mb-6 leading-relaxed">
                Get a personalized fee estimate for your closing. Takes 30 seconds. No commitment.
              </p>
              <Link
                href="/quote"
                className="block w-full bg-white text-primary-600 px-6 py-3 rounded-lg font-bold text-center hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get my estimate →
              </Link>
            </div>

            {/* Share with Team */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-emerald-500 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="font-black text-2xl text-dark-900 mb-3">Share with Team</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Send BetterClose info to your realtor, lender, or broker. They can coordinate your closing directly with us.
              </p>
              <Link
                href="/share"
                className="block w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-emerald-700 transition-colors"
              >
                Send Link
              </Link>
            </div>

            {/* Chat with Us */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-black text-2xl text-dark-900 mb-3">Chat with Us</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Have questions? Get instant answers from our team. We're here to help you understand your options.
              </p>
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>

            {/* Call Us */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-gray-400 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="font-black text-2xl text-dark-900 mb-3">Call Us</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Prefer to talk? Call to speak with a closing specialist who can answer all your questions.
              </p>
              <a
                href="tel:1-800-316-9508"
                className="block w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-gray-900 transition-colors"
              >
                1.800.316.9508
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div id="calculator" className="w-full bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-dark-900 mb-6 text-center">Calculate Your Personal Savings</h2>

            {/* Single Line Input Row */}
            <div className="flex gap-2 mb-4">
              {/* Purchase/Refi Toggle */}
              <div className="flex gap-1 border-2 border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setTransactionType('purchase')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    transactionType === 'purchase'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Purchase
                </button>
                <button
                  onClick={() => setTransactionType('refinance')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    transactionType === 'refinance'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Refi
                </button>
              </div>

              {/* Home Value */}
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dark-900 pointer-events-none">$</span>
                <input
                  type="text"
                  value={homeValue}
                  onChange={handleHomeValueChange}
                  placeholder="500,000"
                  className="w-full pl-6 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm text-dark-900 placeholder-gray-400"
                />
              </div>

              {/* State */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm text-dark-900"
              >
                {STATES.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Chat Interface */}
            <div className={`mb-4 transition-all duration-500 ease-in-out ${
              chatExpanded ? 'h-[320px]' : 'h-[240px]'
            }`}>
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Answer or ask anything"
              />
            </div>

            {/* Single Line Estimate Row */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border-2 border-green-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-green-700 font-semibold">EST. SAVINGS:</span>
                  <span className={`text-2xl font-black text-green-600 transition-all ${
                    isLoading ? 'scale-110' : ''
                  }`}>
                    ${savings.totalSavings.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">Closing:</span> ${savings.estimatedClosingCost.toLocaleString()} <span className="text-gray-400">vs ${savings.averageClosingCost.toLocaleString()}</span>
                  <span className="mx-2">•</span>
                  <span className="font-semibold">Monthly:</span> ${savings.estimatedMonthlyImpact.toLocaleString()}/mo <span className="text-gray-400">vs ${savings.averageMonthlyImpact.toLocaleString()}/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <Testimonials />

      {/* Underwriter Logos */}
      <UnderwriterLogos />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">BetterClose</div>
              <p className="text-gray-400">
                Transparent, discounted title insurance and settlement services for your home purchase or refinance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Calculate Savings
                  </Link>
                </li>
                <li>
                  <Link href="/quote" className="hover:text-white transition-colors">
                    Fee estimate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Questions? We're here to help.<br />
                Reach out for a quote or support.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BetterClose. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Mock AI response generator
function generateAIResponse(
  userMessage: string,
  messageCount: number,
  currentFactors: SavingsFactors
): { message: string; updatedFactors?: SavingsFactors } {
  const lowerMessage = userMessage.toLowerCase()

  if (messageCount === 2) {
    return {
      message: "Perfect! Let's start with a quick question:\n\nAre you comfortable signing your documents remotely (electronically)? It's just as secure and legally binding, and you can save an additional $150 by avoiding in-person notary fees.\n\nType 'yes' for remote signing or 'no' if you prefer in-person."
    }
  }

  if (messageCount === 4 && currentFactors.remoteSigning === null) {
    const remoteSigning = lowerMessage.includes('yes') || lowerMessage.includes('remote') || lowerMessage.includes('electronic')
    return {
      message: remoteSigning
        ? "Great choice! Remote signing will save you $150. ✓\n\nNext question: Do you have all your documents ready (ID, bank statements, proof of income, etc.)? Having them ready speeds up processing and can save you another $100.\n\nType 'yes' or 'no'."
        : "No problem! We offer in-person signing too.\n\nNext question: Do you have all your documents ready (ID, bank statements, proof of income, etc.)? Having them ready speeds up processing and can save you $100.\n\nType 'yes' or 'no'.",
      updatedFactors: { ...currentFactors, remoteSigning }
    }
  }

  if (messageCount === 6 && currentFactors.docsReady === null) {
    const docsReady = lowerMessage.includes('yes') || lowerMessage.includes('ready') || lowerMessage.includes('have')
    return {
      message: docsReady
        ? "Excellent! Being prepared saves you $100. ✓\n\nNow, how complex is your property situation?\n• Type 'simple' - First purchase, clear title\n• Type 'moderate' - Standard property\n• Type 'complex' - Inherited property, multiple owners, or liens"
        : "No worries! We can help you gather what you need.\n\nNow, how complex is your property situation?\n• Type 'simple' - First purchase, clear title\n• Type 'moderate' - Standard property\n• Type 'complex' - Inherited property, multiple owners, or liens",
      updatedFactors: { ...currentFactors, docsReady }
    }
  }

  if (messageCount === 8 && currentFactors.titleComplexity === null) {
    let titleComplexity: 'simple' | 'moderate' | 'complex' = 'moderate'
    if (lowerMessage.includes('simple')) titleComplexity = 'simple'
    if (lowerMessage.includes('complex')) titleComplexity = 'complex'

    const complexityMessage = titleComplexity === 'simple'
      ? "Perfect! A simple title search saves you an additional $200. ✓"
      : titleComplexity === 'complex'
      ? "Got it. Complex properties require more thorough research, which adds about $100 to the process."
      : "Understood. Standard title complexity."

    return {
      message: `${complexityMessage}\n\nLast question: Are you happy with your current lender, or would you like us to check if we can save you even more on your rate?\n\nType 'yes to check' or 'no thanks'`,
      updatedFactors: { ...currentFactors, titleComplexity }
    }
  }

  if (messageCount === 10 && currentFactors.lenderSwitch === null) {
    const checkLender = lowerMessage.includes('yes') || lowerMessage.includes('check')
    return {
      message: checkLender
        ? "Great! Our lender partners often find additional savings on rates and fees. We'll reach out with some options.\n\n✨ Based on your answers, here's your personalized savings breakdown! Check the panel on the left for the final numbers."
        : "No problem! We'll work with your current lender.\n\n✨ Based on your answers, here's your personalized savings breakdown! Check the panel on the left for the final numbers.",
      updatedFactors: { ...currentFactors, lenderSwitch: checkLender }
    }
  }

  return {
    message: "Thanks for that! Feel free to ask me any questions about the process, or we can continue with the questions above."
  }
}
