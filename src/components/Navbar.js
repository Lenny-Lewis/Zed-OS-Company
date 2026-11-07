'use client'

import { useEffect } from 'react'
import { CurtainNavigation } from '@/components/ui/curtain-navigation'

export default function Navbar() {
  useEffect(() => {
    document.documentElement.dataset.navTheme = 'dark'
  }, [])

  return (
    <div data-site-chrome suppressHydrationWarning>
      <CurtainNavigation />
    </div>
  )
}
