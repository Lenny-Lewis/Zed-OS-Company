'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Preloader from '@/components/Preloader'
import { PageTransitionProvider, PageTransitionOverlay } from '@/components/transition/PageTransition'

export default function SiteChrome({ children }) {
  const pathname = usePathname()
  // A service page ends by scrolling on to the next service, so there's no footer to reach.
  const showFooter = pathname !== '/' && !pathname.startsWith('/services/')

  return (
    <PageTransitionProvider>
      <Preloader />
      <Navbar />
      {children}
      {showFooter && <Footer />}
      {pathname !== '/' && <WhatsAppButton />}
      <PageTransitionOverlay />
    </PageTransitionProvider>
  )
}
