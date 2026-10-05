'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Loader from '@/components/ui/loader-5'

const SESSION_KEY = 'zedos:intro-seen'
const HOLD_MS = 3300
const FADE_MS = 700
const REDUCED_HOLD_MS = 600

type Phase = 'visible' | 'leaving' | 'done'

function Intro() {
  // Starts visible so the overlay is server-rendered: the first paint is already
  // black, the page behind it never shows through.
  const [phase, setPhase] = useState<Phase>('visible')

  useEffect(() => {
    // The inline script in the document head flags repeat visits before first
    // paint, so the overlay is already hidden by CSS and just needs unmounting.
    if (document.documentElement.hasAttribute('data-intro-seen')) {
      const stop = setTimeout(() => setPhase('done'), 0)
      return () => clearTimeout(stop)
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hold = reduceMotion ? REDUCED_HOLD_MS : HOLD_MS

    const leave = setTimeout(() => setPhase('leaving'), hold)
    // Flagged as seen only once the intro has played out, so a remount in the
    // same tick (React strict mode) still gets to show it.
    const done = setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        // ignore storage failures
      }
      setPhase('done')
    }, hold + FADE_MS)

    return () => {
      clearTimeout(leave)
      clearTimeout(done)
    }
  }, [])

  // Hold the page still while the intro is on screen.
  useEffect(() => {
    if (phase === 'done') return

    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previous
    }
  }, [phase])

  if (phase === 'done') return null

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        Loading Zed OS Technologies
      </p>

      <div
        aria-hidden="true"
        data-intro
        className={`fixed inset-0 z-[100] overflow-hidden bg-black transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          phase === 'leaving' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Loader />
      </div>
    </>
  )
}

export default function Preloader() {
  const pathname = usePathname()

  if (pathname !== '/') return null

  return <Intro />
}