'use client'

import { useSearchParams } from 'next/navigation'
import AICalculator from './AICalculator'
import StoryCalculator from './StoryCalculator'

interface HomePageContentProps {
  originalCalculator: React.ReactNode
}

export default function HomePageContent({ originalCalculator }: HomePageContentProps) {
  const searchParams = useSearchParams()
  const variant = searchParams.get('variant')

  if (variant === 'ai') {
    return <AICalculator />
  }

  if (variant === 'e') {
    return <StoryCalculator />
  }

  return <>{originalCalculator}</>
}
