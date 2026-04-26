import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationCredible />
      {/* Spacer for fixed header */}
      <div className="h-20" />
      <main>{children}</main>
      <FooterComprehensive />
    </>
  )
}
