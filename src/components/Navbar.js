'use client'

import { useEffect } from 'react'
import { Component as SterlingGateKineticNavigation } from '@/components/ui/sterling-gate-kinetic-navigation'

export default function Navbar() {
  useEffect(() => {
    document.documentElement.dataset.navTheme = 'dark'
  }, [])

  return (
    <div data-site-chrome suppressHydrationWarning>
      <SterlingGateKineticNavigation />
    </div>
  )
}
