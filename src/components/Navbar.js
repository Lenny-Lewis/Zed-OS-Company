'use client'

import Link from 'next/link'
import { BriefcaseBusiness, Contact, Home, Info, Package, Wrench } from 'lucide-react'
import Logo from '@/components/Logo'
import { AnimeNavBar } from '@/components/ui/anime-navbar'
import CurvedMenu from '@/components/ui/curved-menu'

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: Info },
  { href: '/services', label: 'Services', icon: Wrench },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/partner', label: 'Partner', icon: BriefcaseBusiness },
  { href: '/contact', label: 'Contact', icon: Contact },
]

export default function Navbar() {
  return (
    <>
      <AnimeNavBar items={navLinks.map(({ label: name, href: url, icon }) => ({ name, url, icon }))} />
      <header className="sticky top-0 z-50 bg-black/85 px-4 py-4 backdrop-blur-xl md:hidden">
      <div className="liquid-glass mx-auto flex max-w-[1400px] items-center justify-between rounded-full px-4 py-2">
        <Logo size="nav" />
        <div className="flex items-center gap-2">
          <Link href="/contact" className="rounded-full bg-white px-4 py-2 font-body text-sm font-medium text-black transition-colors hover:bg-white/85">Talk to Us</Link>
          <CurvedMenu navItems={navLinks.map(({ label, href }) => ({ heading: label, href }))} />
        </div>
      </div>
      </header>
    </>
  )
}
