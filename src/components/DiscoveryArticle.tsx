import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'

export default function DiscoveryArticle({ title, introduction, children }: {
  title: string; introduction: string; children: React.ReactNode
}) {
  return <div className="min-h-screen bg-white">
    <NavigationCredible />
    <main className="pt-20">
      <header className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-5">
          <p className="font-bold text-primary-700 text-sm mb-4">BETTERCLOSE · CLOSING GUIDES</p>
          <h1 className="text-3xl md:text-5xl font-black text-dark-900 leading-tight mb-6">{title}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{introduction}</p>
        </div>
      </header>
      <article className="max-w-3xl mx-auto px-5 py-12 text-gray-700 leading-relaxed space-y-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-dark-900 [&_h2]:mb-4 [&_h3]:font-bold [&_h3]:text-dark-900 [&_p]:mb-4 [&_li]:mb-3 [&_a]:text-primary-700 [&_a]:underline [&_a]:underline-offset-4">
        {children}
        <aside className="rounded-2xl bg-primary-50 border border-primary-100 p-6 print:hidden">
          <h2>Compare your own closing.</h2>
          <p>Start with an itemized estimate for your property and loan. Availability and fees depend on the transaction and location.</p>
          <Link href="/quote" className="inline-block font-bold">Get a BetterClose estimate →</Link>
        </aside>
      </article>
    </main>
    <FooterComprehensive />
  </div>
}
