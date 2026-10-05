'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Loader from '@/components/ui/loader-5'

const SESSION_KEY = 'zedos:intro-seen'
const HOLD_MS = 1900
const FADE_MS = 650
const REDUCED_HOLD_MS = 400

type Phase = 'idle' | 'entering' | 'leaving'

function Intro() {
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return
    } catch {
      // sessionStorage blocked (private mode) — play once per mount
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hold = reduceMotion ? REDUCED_HOLD_MS : HOLD_MS

    const enter = requestAnimationFrame(() => setPhase('entering'))
    const leave = setTimeout(() => setPhase('leaving'), hold)
    // Flagged as seen only once the intro has played out, so a remount in the
    // same tick (React strict mode) still gets to show it.
    const done = setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        // ignore storage failures
      }
      setPhase('idle')
    }, hold + FADE_MS)

    return () => {
      cancelAnimationFrame(enter)
      clearTimeout(leave)
      clearTimeout(done)
    }
  }, [])

  // Hold the page still while the intro is on screen.
  useEffect(() => {
    if (phase === 'idle') return

    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previous
    }
  }, [phase])

  if (phase === 'idle') return null

  const visible = phase === 'entering'

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        Loading Zed OS Technologies
      </p>

      <div
        aria-hidden="true"
        data-intro
        className={`fixed inset-0 z-[100] overflow-hidden bg-black ${
          visible ? 'opacity-100 duration-300' : 'opacity-0 duration-700'
        } transition-opacity ease-out motion-reduce:transition-none`}
      >
        <Loader />

        <div className="absolute inset-x-0 top-1/2 px-6">
          <div
            className={`translate-y-[122px] text-center transition-opacity duration-500 ${
              visible ? 'opacity-100' : 'opacity-0'
            } motion-reduce:transition-none`}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/70">
              ZedOS Technologies
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Preloader() {
  const pathname = usePathname()

  if (pathname !== '/') return null

  return <Intro />
}