'use client'

import { useSearchParams } from 'next/navigation'
import AICalculator from '@/components/AICalculator'
import StoryCalculator from '@/components/StoryCalculator'
import HomePage from './HomePageOriginal'

export default function PageWrapper() {
  const searchParams = useSearchParams()
  const variant = searchParams.get('variant')

  // Render variant pages without the default page wrapper
  if (variant === 'ai') {
    return <AICalculator />
  }

  if (variant === 'e') {
    return <StoryCalculator />
  }

  // Render default page
  return <HomePage />
}
