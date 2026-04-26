'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { getInitialSavings, SavingsBreakdown } from '@/lib/savingsCalculator'

interface SavingsContextType {
  savings: SavingsBreakdown
  setSavings: (savings: SavingsBreakdown) => void
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined)

export function SavingsProvider({ children }: { children: ReactNode }) {
  const [savings, setSavings] = useState<SavingsBreakdown>(
    getInitialSavings('purchase', 500000, 'Texas')
  )

  return (
    <SavingsContext.Provider value={{ savings, setSavings }}>
      {children}
    </SavingsContext.Provider>
  )
}

export function useSavings() {
  const context = useContext(SavingsContext)
  if (context === undefined) {
    throw new Error('useSavings must be used within a SavingsProvider')
  }
  return context
}
