'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { BriefcaseBusiness, Camera, MessageCircle, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export interface CurvedMenuItem {
  heading: string
  href: string
}

interface CurvedMenuProps {
  navItems: CurvedMenuItem[]
}

const menuSlide = {
  initial: { x: 'calc(100% + 100px)' },
  enter: { x: '0', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
  exit: { x: 'calc(100% + 100px)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
}

function MenuFooter() {
  const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/zedostechnologies?igsh=MXFyamJ2NjFvY2F0eQ==', icon: Camera },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zedos-technologies-576bb3414', icon: BriefcaseBusiness },
    { label: 'X', href: 'https://x.com/zedostechnology', icon: MessageCircle },
  ]

  return <div className="flex w-full items-center gap-5 px-8 py-5 text-black sm:px-10" aria-label="Social links">
    {socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="transition-opacity hover:opacity-60"><Icon size={20} strokeWidth={1.5} /></a>)}
  </div>
}

function Curve() {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight)
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const initialPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q-100 ${height / 2} 100 0`
  const targetPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q100 ${height / 2} 100 0`

  return <svg className="pointer-events-none absolute top-0 -left-[99px] h-full w-[100px] fill-white" aria-hidden="true">
    <motion.path initial={{ d: initialPath }} animate={{ d: targetPath }} exit={{ d: initialPath }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} />
  </svg>
}

function CurvedNavbar({ navItems, onClose }: { navItems: CurvedMenuItem[]; onClose: () => void }) {
  return <motion.aside variants={menuSlide} initial="initial" animate="enter" exit="exit" id="curved-mobile-navigation" className="fixed right-0 top-0 z-[60] flex h-[100dvh] w-3/4 flex-col bg-white text-black shadow-2xl" aria-label="Mobile navigation" role="dialog" aria-modal="true">
    <button type="button" onClick={onClose} className="absolute right-5 top-5 z-10 flex size-10 items-center justify-center rounded-full border border-black/15 transition-colors hover:bg-black/5" aria-label="Close navigation menu"><X size={21} strokeWidth={1.5} /></button>
    <div className="flex flex-1 flex-col justify-between overflow-y-auto pb-3 pt-10">
      <div className="px-8 sm:px-10">
        <p className="border-b border-black/30 pb-3 font-body text-xs uppercase tracking-[0.16em]">Navigation</p>
        <nav className="mt-2">
          {navItems.map((item, index) => <motion.div key={item.href} initial="initial" whileHover="hover" className="border-b border-black/25 py-4 sm:py-5">
            <Link href={item.href} onClick={onClose} className="group flex items-start font-body uppercase" aria-label={item.heading}>
              <span className="mr-2 text-2xl font-light sm:text-3xl">{String(index + 1).padStart(2, '0')}.</span>
              <motion.span variants={{ initial: { x: 0 }, hover: { x: -8 } }} transition={{ type: 'spring', stiffness: 300 }} className="text-3xl font-light leading-none sm:text-4xl">
                {item.heading.split('').map((letter, letterIndex) => <motion.span key={`${letter}-${letterIndex}`} variants={{ initial: { x: 0 }, hover: { x: 8 } }} transition={{ type: 'spring', stiffness: 300 }} className="inline-block">{letter}</motion.span>)}
              </motion.span>
            </Link>
          </motion.div>)}
        </nav>
      </div>
      <MenuFooter />
    </div>
    <Curve />
  </motion.aside>
}

function MobileMenuLayer({ navItems, onClose }: { navItems: CurvedMenuItem[]; onClose: () => void }) {
  return <motion.div className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button type="button" aria-label="Close navigation menu" className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-sm" onClick={onClose} />
    <CurvedNavbar navItems={navItems} onClose={onClose} />
  </motion.div>
}

export default function CurvedMenu({ navItems }: CurvedMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return <div className="md:hidden">
    <button type="button" onClick={() => setIsOpen((open) => !open)} className={`relative z-[70] flex h-10 w-10 items-center justify-center text-white transition-opacity ${isOpen ? 'pointer-events-none opacity-0' : ''}`} aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isOpen} aria-controls="curved-mobile-navigation">
      <span className="flex h-5 w-6 flex-col justify-between" aria-hidden="true">
        <span className={`h-px w-full bg-current transition-transform duration-300 ${isOpen ? 'translate-y-[9px] rotate-45' : ''}`} />
        <span className={`h-px w-full bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`h-px w-full bg-current transition-transform duration-300 ${isOpen ? '-translate-y-[9px] -rotate-45' : ''}`} />
      </span>
    </button>
    <AnimatePresence mode="wait">{isOpen && <MobileMenuLayer navItems={navItems} onClose={() => setIsOpen(false)} />}</AnimatePresence>
  </div>
}
