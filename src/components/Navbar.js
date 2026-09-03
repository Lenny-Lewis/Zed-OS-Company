'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'
import { images } from '@/data/images'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/partner', label: 'Partner' },
  { href: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-neutral-900 shadow-md">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo */}
          <Logo size="nav" />

          {/* Center: Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search Pill + Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Pill Search Input */}
            <div className="relative flex items-center bg-neutral-900 rounded-full px-4 py-2 text-sm w-44 lg:w-52 border border-neutral-800 focus-within:border-neutral-600 transition-all">
              <svg className="w-4 h-4 text-neutral-400 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-neutral-500 text-xs w-full font-medium"
              />
            </div>

            {/* Heart / Wishlist Icon */}
            <button className="text-neutral-300 hover:text-white p-2 rounded-full hover:bg-neutral-900 transition-colors" aria-label="Wishlist">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Cart Icon */}
            <button className="text-neutral-300 hover:text-white p-2 rounded-full hover:bg-neutral-900 transition-colors relative" aria-label="Cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>

            {/* Developer Logo Link pointing to lennoxlewis.co.ke */}
            <Link
              href="https://www.lennoxlewis.co.ke"
              target="_blank"
              rel="noreferrer"
              title="Lennox Lewis Developer"
              className="relative w-9 h-9 rounded-full overflow-hidden border border-neutral-800 shrink-0 hover:border-neutral-600 transition-all block shadow-xs"
            >
              <Image
                src={images.devLogo}
                alt="Lennox Lewis Developer"
                fill
                className="object-cover"
              />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <nav className="lg:hidden pb-6 pt-2 flex flex-col gap-4 border-t border-neutral-900">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-semibold transition-colors duration-200 py-1 ${
                  isActive(link.href) ? 'text-white font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="bg-white text-black px-5 py-3 rounded-full font-bold text-sm text-center shadow-sm"
            >
              Contact Us
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
