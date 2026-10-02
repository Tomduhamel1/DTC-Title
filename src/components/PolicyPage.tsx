import type { ReactNode } from 'react'
import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'

export default function PolicyPage({ title, introduction, children }: {
  title: string
  introduction: string
  children: ReactNode
}) {
  return <>
    <NavigationCredible />
    <div className="h-20" />
    <main className="bg-gray-50 min-h-[calc(100vh-5rem)] py-12 md:py-16 px-6">
      <article className="max-w-3xl mx-auto text-gray-700">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-primary-700 mb-3">BetterClose</p>
          <h1 className="text-4xl md:text-5xl font-black text-dark-900 mb-4">{title}</h1>
          <p className="text-lg leading-relaxed">{introduction}</p>
          <p className="mt-4 text-sm text-gray-600">Effective date: <time dateTime="2026-10-01">October 1, 2026</time></p>
        </header>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-9 space-y-8 leading-relaxed">
          {children}
          <PolicySection title="Contact BetterClose">
            <p>Questions about this page? Email{' '}
              <a className="text-primary-700 underline underline-offset-4 break-words" href="mailto:contact@betterclose.co">contact@betterclose.co</a>{' '}
              or call{' '}<a className="text-primary-700 underline underline-offset-4 whitespace-nowrap" href={`tel:${SUPPORT_PHONE_TEL}`}>{SUPPORT_PHONE_DISPLAY}</a>.
              Please do not include Social Security numbers, bank account numbers, or sensitive documents in a general email inquiry.
            </p>
          </PolicySection>
        </div>
        <nav aria-label="Policy pages" className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-sm font-semibold text-primary-700">
          <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
          <Link href="/terms" className="underline underline-offset-4">Terms of Service</Link>
          <Link href="/licenses" className="underline underline-offset-4">Licensing Information</Link>
        </nav>
      </article>
    </main>
    <FooterComprehensive />
  </>
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return <section>
    <h2 className="text-xl font-bold text-dark-900 mb-3">{title}</h2>
    <div className="space-y-3">{children}</div>
  </section>
}
