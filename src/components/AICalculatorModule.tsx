'use client'

import { useState, useEffect } from 'react'
import ChatInterface, { Message } from './ChatInterface'
import { calculateSavings, getInitialSavings, SavingsFactors } from '@/lib/savingsCalculator'
import { useSavings } from '@/contexts/SavingsContext'

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
        ? "Great! Our lender partners often find additional savings on rates and fees. We'll reach out with some options.\n\n✨ Based on your answers, here's your personalized savings breakdown below!"
        : "No problem! We'll work with your current lender.\n\n✨ Based on your answers, here's your personalized savings breakdown below!",
      updatedFactors: { ...currentFactors, lenderSwitch: checkLender }
    }
  }

  return {
    message: "Thanks for that! Feel free to ask me any questions about the process, or we can continue with the questions above."
  }
}

interface AICalculatorModuleProps {
  compact?: boolean
}

export default function AICalculatorModule({ compact = false }: AICalculatorModuleProps) {
  const { setSavings } = useSavings()
  const [transactionType, setTransactionType] = useState<'purchase' | 'refinance'>('purchase')
  const [homeValue, setHomeValue] = useState('')
  const [selectedState, setSelectedState] = useState('Texas')
  const [conversationStarted, setConversationStarted] = useState(false)
  const [chatExpanded, setChatExpanded] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [factors, setFactors] = useState<SavingsFactors>({
    remoteSigning: null,
    docsReady: null,
    hasCD: null,
    titleComplexity: null,
    lenderSwitch: null
  })

  // Get user's location
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

  // Savings calculation
  const homeValueNum = parseFloat(homeValue.replace(/[^0-9.]/g, '')) || 500000
  const savings = conversationStarted
    ? calculateSavings(transactionType, homeValueNum, selectedState, factors)
    : getInitialSavings(transactionType, homeValueNum, selectedState)

  // Update global savings context whenever local savings change
  useEffect(() => {
    setSavings(savings)
  }, [savings, setSavings])

  // Rotating savings ideas
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0)
  const savingsIdeas = getSavingsIdeas(savings.totalSavings)

  useEffect(() => {
    if (savingsIdeas.length > 0) {
      const interval = setInterval(() => {
        setCurrentIdeaIndex(prev => (prev + 1) % savingsIdeas.length)
      }, 3000) // Rotate every 3 seconds

      return () => clearInterval(interval)
    }
  }, [savingsIdeas.length])

  // Initialize conversation
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

  const handleHomeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value) {
      const formatted = parseInt(value).toLocaleString()
      setHomeValue(formatted)
    } else {
      setHomeValue('')
    }
  }

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
    <div className={`bg-white rounded-2xl shadow-xl ${compact ? 'p-4' : 'p-8'}`}>
      {!compact && (
        <h2 className="text-2xl font-bold text-dark-900 mb-6 text-center">Calculate Your Savings</h2>
      )}

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
        compact
          ? (chatExpanded ? 'h-[240px]' : 'h-[180px]')
          : (chatExpanded ? 'h-[320px]' : 'h-[240px]')
      }`}>
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Answer or ask anything"
        />
      </div>

      {/* Estimate Row - Redesigned */}
      <div className={`bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg border-2 border-emerald-200 ${compact ? 'p-3' : 'p-4'}`}>
        <div className={`flex items-start ${compact ? 'gap-3' : 'gap-6'}`}>
          {/* Left: Label and Amount Stacked */}
          <div className="flex flex-col gap-1">
            <div className={`text-emerald-700 font-semibold uppercase tracking-wide ${compact ? 'text-xs' : 'text-xs'}`}>EST. SAVINGS:</div>
            <div className={`font-black text-emerald-600 leading-none transition-all ${compact ? 'text-3xl' : 'text-5xl'} ${
              isLoading ? 'scale-110' : ''
            }`}>
              ${savings.totalSavings.toLocaleString()}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="border-l-2 border-emerald-300 self-stretch"></div>

          {/* Right: Details Vertically Centered */}
          <div className={`flex flex-col gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-semibold text-gray-700">Closing:</span>
              <span className="font-bold text-emerald-600">${savings.estimatedClosingCost.toLocaleString()}</span>
              <span className="text-gray-400">vs ${savings.averageClosingCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-semibold text-gray-700">Monthly:</span>
              <span className="font-bold text-emerald-600">${savings.estimatedMonthlyImpact.toLocaleString()}/mo</span>
              <span className="text-gray-400">vs ${savings.averageMonthlyImpact.toLocaleString()}/mo</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-semibold text-gray-700">Lifetime:</span>
              <span className="font-bold text-emerald-600">${savings.lifetimeSavings.toLocaleString()} saved over loan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
