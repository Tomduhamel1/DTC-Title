'use client'

import { useState, useEffect } from 'react'
import ChatInterface, { Message } from './ChatInterface'
import SavingsDisplay from './SavingsDisplay'
import { calculateSavings, getInitialSavings, SavingsFactors } from '@/lib/savingsCalculator'

// Fun things you could do with your savings
const getSavingsIdeas = (amount: number) => {
  const ideas = []

  if (amount >= 300) {
    ideas.push(
      { text: `${Math.floor(amount / 5)} Starbucks lattes`, emoji: '☕' },
      { text: `${Math.floor(amount / 12)} movie tickets with popcorn`, emoji: '🍿' },
      { text: `${Math.floor(amount / 3)} bubble teas`, emoji: '🧋' },
      { text: 'a nice dinner for two', emoji: '🍝' }
    )
  }

  if (amount >= 500) {
    ideas.push(
      { text: `${Math.floor(amount / 15)} pizza nights`, emoji: '🍕' },
      { text: 'a year of your favorite streaming service', emoji: '📺' },
      { text: `${Math.floor(amount / 8)} burritos`, emoji: '🌯' },
      { text: 'new running shoes and workout gear', emoji: '👟' }
    )
  }

  if (amount >= 800) {
    ideas.push(
      { text: 'a weekend camping trip', emoji: '⛺' },
      { text: 'a decent used bike', emoji: '🚲' },
      { text: `${Math.floor(amount / 50)} concert tickets`, emoji: '🎵' },
      { text: 'a new phone', emoji: '📱' }
    )
  }

  if (amount >= 1000) {
    ideas.push(
      { text: 'an electric guitar', emoji: '🎸' },
      { text: 'a flight anywhere in the US', emoji: '✈️' },
      { text: 'a new laptop', emoji: '💻' },
      { text: 'six months of yoga classes', emoji: '🧘' },
      { text: 'an e-bike', emoji: '🚴' }
    )
  }

  if (amount >= 1500) {
    ideas.push(
      { text: 'a round trip to Hawaii', emoji: '🌺' },
      { text: 'a year of gym memberships', emoji: '💪' },
      { text: 'a gaming console and 10 games', emoji: '🎮' },
      { text: 'a fancy espresso machine', emoji: '☕' },
      { text: 'professional camera gear', emoji: '📷' }
    )
  }

  if (amount >= 2000) {
    ideas.push(
      { text: 'a beach vacation for two', emoji: '🏝️' },
      { text: 'a custom gaming PC', emoji: '⚡' },
      { text: 'a designer couch', emoji: '🛋️' },
      { text: 'four months of rent', emoji: '🏠' },
      { text: 'a professional mountain bike', emoji: '🚵' },
      { text: '200 fancy dinners', emoji: '🥂' }
    )
  }

  if (amount >= 3000) {
    ideas.push(
      { text: 'a used car down payment', emoji: '🚗' },
      { text: 'five weekend getaways', emoji: '🗺️' },
      { text: 'a 75" TV and sound system', emoji: '🎬' },
      { text: 'a whole year of groceries', emoji: '🛒' },
      { text: 'a hot tub', emoji: '♨️' }
    )
  }

  if (amount >= 4000) {
    ideas.push(
      { text: 'an epic road trip across the country', emoji: '🚙' },
      { text: 'a backyard makeover', emoji: '🌳' },
      { text: 'scuba diving certification and gear', emoji: '🤿' },
      { text: '400 fancy coffees', emoji: '☕' }
    )
  }

  if (amount >= 5000) {
    ideas.push(
      { text: 'a really nice used car', emoji: '🚙' },
      { text: 'a kitchen renovation', emoji: '🔨' },
      { text: 'two tickets to Europe', emoji: '🌍' },
      { text: 'a jet ski', emoji: '🛥️' },
      { text: 'solar panels for your home', emoji: '☀️' },
      { text: 'a wedding ring', emoji: '💍' }
    )
  }

  if (amount >= 7000) {
    ideas.push(
      { text: 'a boat', emoji: '⛵' },
      { text: 'a honeymoon in Bali', emoji: '🏖️' },
      { text: 'a she-shed or man-cave', emoji: '🏡' },
      { text: 'a year of car payments', emoji: '🚗' }
    )
  }

  return ideas
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

export default function AICalculator() {
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
      .catch(() => {
        // Silently fail and keep default
      })
  }, [])

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationStarted, setConversationStarted] = useState(false)

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
      }, 3000) // Rotate every 3 seconds

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
    if (!conversationStarted) {
      setConversationStarted(true)
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Add your basics above, or ask me anything to get started!`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Calculate message count after adding user message
    const currentMessageCount = messages.length + 1

    // Simulate API call (we'll replace this with actual API call later)
    setTimeout(() => {
      const aiResponse = generateAIResponse(content, currentMessageCount, factors)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])

      // Update factors if the response changed them
      if (aiResponse.updatedFactors) {
        setFactors(aiResponse.updatedFactors)
      }

      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-dark-900 mb-4 text-center">Let's discuss your savings</h2>

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
      <div className="mb-4 h-[320px]">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Answer or ask anything"
        />
      </div>

      {/* Single Line Estimate Row */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-3 border-2 border-emerald-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-emerald-700 font-semibold">EST. SAVINGS:</span>
            <span className={`text-2xl font-black text-emerald-600 transition-all ${
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

      {/* Fun Savings Ideas */}
      {savingsIdeas.length > 0 && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-full px-4 py-2 transition-all duration-500">
            <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
              {savingsIdeas[currentIdeaIndex].emoji}
            </span>
            <span className="text-sm font-medium text-primary-700">
              That's <span className="font-bold">{savingsIdeas[currentIdeaIndex].text}</span>!
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Mock AI response generator (will be replaced with actual API call)
function generateAIResponse(
  userMessage: string,
  messageCount: number,
  currentFactors: SavingsFactors
): { message: string; updatedFactors?: SavingsFactors } {
  const lowerMessage = userMessage.toLowerCase()

  // First user message: ask about remote signing
  if (messageCount === 2) {
    return {
      message: "Perfect! Let's start with a quick question:\n\nAre you comfortable signing your documents remotely (electronically)? It's just as secure and legally binding, and you can save an additional $150 by avoiding in-person notary fees.\n\nType 'yes' for remote signing or 'no' if you prefer in-person."
    }
  }

  // Handle remote signing response
  if (messageCount === 4 && currentFactors.remoteSigning === null) {
    const remoteSigning = lowerMessage.includes('yes') || lowerMessage.includes('remote') || lowerMessage.includes('electronic')
    return {
      message: remoteSigning
        ? "Great choice! Remote signing will save you $150. ✓\n\nNext question: Do you have all your documents ready (ID, bank statements, proof of income, etc.)? Having them ready speeds up processing and can save you another $100.\n\nType 'yes' or 'no'."
        : "No problem! We offer in-person signing too.\n\nNext question: Do you have all your documents ready (ID, bank statements, proof of income, etc.)? Having them ready speeds up processing and can save you $100.\n\nType 'yes' or 'no'.",
      updatedFactors: { ...currentFactors, remoteSigning }
    }
  }

  // Handle docs ready response
  if (messageCount === 6 && currentFactors.docsReady === null) {
    const docsReady = lowerMessage.includes('yes') || lowerMessage.includes('ready') || lowerMessage.includes('have')
    return {
      message: docsReady
        ? "Excellent! Being prepared saves you $100. ✓\n\nNow, how complex is your property situation?\n• Type 'simple' - First purchase, clear title\n• Type 'moderate' - Standard property\n• Type 'complex' - Inherited property, multiple owners, or liens"
        : "No worries! We can help you gather what you need.\n\nNow, how complex is your property situation?\n• Type 'simple' - First purchase, clear title\n• Type 'moderate' - Standard property\n• Type 'complex' - Inherited property, multiple owners, or liens",
      updatedFactors: { ...currentFactors, docsReady }
    }
  }

  // Handle title complexity response
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

  // Handle lender question response
  if (messageCount === 10 && currentFactors.lenderSwitch === null) {
    const checkLender = lowerMessage.includes('yes') || lowerMessage.includes('check')
    return {
      message: checkLender
        ? "Great! Our lender partners often find additional savings on rates and fees. We'll reach out with some options.\n\n✨ Based on your answers, here's your personalized savings breakdown! Check the panel on the left for the final numbers."
        : "No problem! We'll work with your current lender.\n\n✨ Based on your answers, here's your personalized savings breakdown! Check the panel on the left for the final numbers.",
      updatedFactors: { ...currentFactors, lenderSwitch: checkLender }
    }
  }

  // Default response for other messages
  return {
    message: "Thanks for that! Feel free to ask me any questions about the process, or we can continue with the questions above."
  }
}
