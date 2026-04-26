'use client'

import { useSearchParams } from 'next/navigation'
import AICalculatorWithIdeas from './AICalculatorWithIdeas'
import StoryCalculator from './StoryCalculator'

interface HomePageContentProps {
  originalCalculator: React.ReactNode
}

export default function HomePageContent({ originalCalculator }: HomePageContentProps) {
  const searchParams = useSearchParams()
  const variant = searchParams.get('variant')

  if (variant === 'ai' || variant === 'ai2') {
    return <AICalculatorWithIdeas />
  }

  if (variant === 'e') {
    return <StoryCalculator />
  }

  return <>{originalCalculator}</>
}
