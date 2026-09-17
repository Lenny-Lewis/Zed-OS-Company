'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface AnimeNavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface AnimeNavBarProps {
  items: AnimeNavItem[]
  className?: string
  defaultActive?: string
}

export function AnimeNavBar({ items, className, defaultActive = 'Home' }: AnimeNavBarProps) {
  const pathname = usePathname()
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState(defaultActive)

  const pathnameActive = items.find((item) => item.url === '/' ? pathname === '/' : pathname.startsWith(item.url))?.name
  const activeTab = pathnameActive ?? selectedTab

  return <div className={cn('fixed left-0 right-0 top-5 z-[9999] hidden md:block', className)}>
    <div className="flex justify-center pt-6">
      <motion.nav className="relative flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-2 shadow-lg backdrop-blur-lg" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} aria-label="Primary navigation">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name
          const isHovered = hoveredTab === item.name

          return <Link key={item.name} href={item.url} onClick={() => setSelectedTab(item.name)} onMouseEnter={() => setHoveredTab(item.name)} onMouseLeave={() => setHoveredTab(null)} className={cn('relative cursor-pointer rounded-full px-4 py-3 font-body text-sm font-semibold text-white/70 transition-all duration-300 hover:text-white lg:px-6', isActive && 'text-white')}>
            {isActive && <motion.div className="absolute inset-0 -z-10 overflow-hidden rounded-full" initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />
              <div className="absolute inset-[-4px] rounded-full bg-white/15 blur-xl" />
              <div className="absolute inset-0 animate-[shine_3s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
            </motion.div>}

            <span className="relative z-10">{item.name}</span>
            <Icon className="sr-only" aria-hidden="true" />

            <AnimatePresence>{isHovered && !isActive && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute inset-0 -z-10 rounded-full bg-white/10" />}</AnimatePresence>

            {isActive && <motion.div layoutId="anime-mascot" className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2" initial={false} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="relative h-12 w-12">
                <motion.div className="absolute left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-white" animate={hoveredTab ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0], transition: { duration: 0.5, ease: 'easeInOut' } } : { y: [0, -3, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}>
                  <span className="absolute left-[25%] top-[40%] h-2 w-2 rounded-full bg-black" /><span className="absolute right-[25%] top-[40%] h-2 w-2 rounded-full bg-black" />
                  <span className="absolute left-[15%] top-[55%] h-1.5 w-2 rounded-full bg-pink-300" /><span className="absolute right-[15%] top-[55%] h-1.5 w-2 rounded-full bg-pink-300" />
                  <motion.span className="absolute left-[30%] top-[60%] h-2 w-4 rounded-full border-b-2 border-black" animate={hoveredTab ? { scaleY: 1.5, y: -1 } : { scaleY: 1, y: 0 }} />
                  <AnimatePresence>{hoveredTab && <><motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className="absolute -right-1 -top-1 text-xs text-yellow-300">✨</motion.span><motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ delay: 0.1 }} className="absolute -top-2 left-0 text-xs text-yellow-300">✨</motion.span></>}</AnimatePresence>
                </motion.div>
                <motion.div className="absolute -bottom-1 left-1/2 h-4 w-4 -translate-x-1/2" animate={hoveredTab ? { y: [0, -4, 0], transition: { duration: 0.3, repeat: Infinity, repeatType: 'reverse' } } : { y: [0, 2, 0], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.5 } }}><span className="block h-full w-full rotate-45 bg-white" /></motion.div>
              </div>
            </motion.div>}
          </Link>
        })}
      </motion.nav>
    </div>
  </div>
}
