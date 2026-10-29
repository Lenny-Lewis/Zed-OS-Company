'use client'

import { useEffect, useState } from 'react'
import { GlassReveal21st } from '@/components/ui/liquid-glass-logo-reveal'

const SESSION_KEY = 'zedos:intro-seen'
const HOLD_MS = 3500
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

    // Record entry immediately, including when the visitor refreshes before
    // the animation finishes. The head script also does this before hydration.
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // The document flag still prevents replays during in-app navigation.
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hold = reduceMotion ? REDUCED_HOLD_MS : HOLD_MS

    const leave = setTimeout(() => setPhase('leaving'), hold)
    const done = setTimeout(() => {
      document.documentElement.setAttribute('data-intro-seen', '')
      setPhase('done')
    }, hold + FADE_MS)

    return () => {
      clearTimeout(leave)
      clearTimeout(done)
    }
  }, [])

  // Hold the page still while the intro is on screen.
  useEffect(() => {
    if (phase === 'done' || document.documentElement.hasAttribute('data-intro-seen')) return

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
        className={`fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-black transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          phase === 'leaving' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <GlassReveal21st
          className="h-full w-full"
          look="dark"
          background="#000000"
          loop={false}
        />
      </div>
    </>
  )
}

export default function Preloader() {
  // Stay mounted across routes: the intro belongs to the first site entry,
  // rather than each time the homepage is mounted.
  return <Intro />
}
