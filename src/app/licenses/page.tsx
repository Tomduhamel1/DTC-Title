import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'

export const metadata = {
  title: 'BetterClose · Licensing Information',
  description: 'Contact BetterClose for licensing information for your state.',
}

export default function LicensesPage() {
  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-50 min-h-[calc(100vh-5rem)] py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Licensing information
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-dark-900 mb-4">
              Contact us for licensing information
            </h1>
            <p className="text-lg text-gray-600">
              Ask our team for licensing details and service availability for
              your state. Please include the state where the property is located.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 text-center">
            <a href="mailto:contact@betterclose.co?subject=Licensing%20information"
              className="text-primary-700 font-semibold underline underline-offset-4 break-words">
              contact@betterclose.co
            </a>
            <p className="mt-5 text-gray-600">
              Or call{' '}
              <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-primary-700 font-semibold underline underline-offset-4">
                {SUPPORT_PHONE_DISPLAY}
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}
