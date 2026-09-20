'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function SiteChrome({ children }) {
  const pathname = usePathname()

  return (
    <>
      <Navbar />
      {children}
      {pathname !== '/' && <Footer />}
      {pathname !== '/' && <WhatsAppButton />}
    </>
  )
}
