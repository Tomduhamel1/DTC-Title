'use client'

import HomePageCredible from '@/components/HomePageCredible'

export default function PageWrapper() {
  // Retire the public ?variant= experiments on both / and /preview. Old links
  // show the current homepage; other query parameters remain available to it.
  return <HomePageCredible heroVersion="magic" />
}
