'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Preloader from '@/components/Preloader'

export default function SiteChrome({ children }) {
  const pathname = usePathname()

  return (
    <>
      <Preloader />
      <Navbar />
      {children}
      {pathname !== '/' && <Footer />}
      {pathname !== '/' && <WhatsAppButton />}
    </>
  )
}
