'use client'

import { useSearchParams } from 'next/navigation'
import StoryCalculator from '@/components/StoryCalculator'
import HomePage from './HomePageOriginal'
import HomePageCredible from '@/components/HomePageCredible'

export default function PageWrapper() {
  const searchParams = useSearchParams()
  const variant = searchParams.get('variant')

  // Variant E is a full page replacement
  if (variant === 'e') {
    return <StoryCalculator />
  }

  // Credible variant A - Split layout with savings on left, calculator on right
  if (variant === 'credible-a') {
    return <HomePageCredible heroVersion="A" />
  }

  // Credible variant B - Inline calculator in headline
  if (variant === 'credible-b') {
    return <HomePageCredible heroVersion="B" />
  }

  // Credible variant C - Clean, focused hero. One savings number (in calculator only).
  if (variant === 'credible-c') {
    return <HomePageCredible heroVersion="C" />
  }

  // Credible variant (default to A)
  if (variant === 'credible') {
    return <HomePageCredible heroVersion="A" />
  }

  // AI variant - original with AI calculator
  if (variant === 'ai') {
    return <HomePage />
  }

  // AI2 variant - new hero language, no savings cards, AI calculator
  if (variant === 'ai2') {
    return <HomePage hideSavingsCards={true} useAlternateHero={true} />
  }

  // Default to ai2 variant (new hero language, no savings cards, AI calculator)
  return <HomePage hideSavingsCards={true} useAlternateHero={true} />
}
