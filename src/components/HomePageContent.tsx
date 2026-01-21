'use client'

import { useSearchParams } from 'next/navigation'
import AICalculator from './AICalculator'

interface HomePageContentProps {
  originalCalculator: React.ReactNode
}

export default function HomePageContent({ originalCalculator }: HomePageContentProps) {
  const searchParams = useSearchParams()
  const variant = searchParams.get('variant')
  const useAI = variant === 'ai'

  if (useAI) {
    return <AICalculator />
  }

  return <>{originalCalculator}</>
}
