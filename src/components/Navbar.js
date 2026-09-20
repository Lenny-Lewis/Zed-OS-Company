'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Menu from '@/components/ui/navbar'
import MobileNav from '@/components/ui/mobile-nav'

const menus = [
  { id: 1, title: 'Home', url: '/', dropdown: false },
  { id: 2, title: 'Products', url: '/products', dropdown: true, items: [
    { id: 21, title: 'Digital Systems', url: '/products' },
    { id: 22, title: 'General Supplies', url: '/products' },
  ] },
  { id: 3, title: 'Services', url: '/services', dropdown: true, mega: true, items: [
    { id: 31, title: 'General Supplies', url: '/services', description: 'Dependable procurement for every workplace.', imageSrc: '/images/service-supplies.jpg' },
    { id: 32, title: 'Vehicle Hire', url: '/services', description: 'Reliable mobility for teams and field work.', imageSrc: '/images/carhire.jpg' },
    { id: 33, title: 'Conference Facilities', url: '/services', description: 'Spaces equipped for productive gatherings.', imageSrc: '/images/service-conference.jpg' },
    { id: 34, title: 'Consultancy Services', url: '/services', description: 'Practical guidance for better operations.', imageSrc: '/images/service-consultancy.jpg' },
    { id: 35, title: 'Software Systems', url: '/services', description: 'Custom tools that streamline your workflows.', imageSrc: '/images/digital-systems.jpg' },
    { id: 36, title: 'Websites', url: '/services', description: 'Clear, modern digital experiences for your brand.', imageSrc: '/images/digital-websites.jpg' },
    { id: 37, title: 'Data Analytics', url: '/services', description: 'Insights that make decisions more confident.', imageSrc: '/images/digital-analytics.jpg' },
    { id: 38, title: 'AI & ML', url: '/services', description: 'Intelligent automation for ambitious teams.', imageSrc: '/images/AI and ML.jpg' },
  ] },
  { id: 4, title: 'About', url: '/about', dropdown: false },
  { id: 5, title: 'Contact', url: '/contact', dropdown: false },
]

function ZedMark() {
  return <svg viewBox="0 0 40 40" className="h-8 w-8 fill-current" aria-hidden="true"><rect x="8" y="10" width="11" height="25" rx="5.5" transform="rotate(-35 8 10)" /><rect x="22" y="7" width="11" height="25" rx="5.5" transform="rotate(-35 22 7)" /></svg>
}

export default function Navbar() {
  const pathname = usePathname()
  const [isOnDark, setIsOnDark] = useState(pathname !== '/')
  const isInteriorPage = pathname !== '/'

  useEffect(() => {
    let frame

    const updateTheme = () => {
      const hero = document.querySelector('[data-home-hero]')
      const nextIsOnDark = pathname !== '/' || Boolean(hero && hero.getBoundingClientRect().bottom <= 72)
      setIsOnDark(nextIsOnDark)
      document.documentElement.dataset.navTheme = nextIsOnDark ? 'dark' : 'light'
    }

    frame = requestAnimationFrame(updateTheme)
    window.addEventListener('scroll', updateTheme, { passive: true })
    window.addEventListener('resize', updateTheme)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateTheme)
      window.removeEventListener('resize', updateTheme)
    }
  }, [pathname])

  return (
    <>
      {isInteriorPage && <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-20 bg-black/90 backdrop-blur-md lg:h-24" />}
      <Link href="/" aria-label="ZedOS Technologies home" className={`fixed left-4 top-4 z-[60] hidden items-center gap-2 text-sm font-semibold tracking-tight transition-colors duration-300 lg:flex md:left-8 md:top-6 ${isOnDark ? 'text-white' : 'text-black'}`}><ZedMark /><span>ZedOS Technologies</span></Link>
      <header className={`fixed left-1/2 top-4 z-[60] hidden -translate-x-1/2 transition-colors duration-300 lg:block md:top-6 ${isOnDark ? 'text-white' : 'text-black'}`}><Menu list={menus} /></header>
      <MobileNav isOnDark={isOnDark} isInteriorPage={isInteriorPage} />
    </>
  )
}
