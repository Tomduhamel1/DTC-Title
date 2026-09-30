import { redirect } from 'next/navigation'

export default function HowItWorksPage() {
  // Keep previously shared URLs useful without a separate section-only page.
  redirect('/')
}
