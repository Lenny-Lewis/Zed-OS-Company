'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ZedOrbitForm } from '@/components/ui/zed-orbit-mark'

const SESSION_KEY = 'zedos:intro-seen'
const ACTIVE_ATTR = 'data-intro-active'
const SEEN_ATTR = 'data-intro-seen'
/** Beat on the finished logo before the overlay fades */
const SETTLE_MS = 350
const FADE_MS = 700
/** Shortest time the overlay stays up (reduced motion) */
const MIN_MS = 600
/** After the animation ends, wait at most this long for the page to finish loading */
const LOAD_GRACE_MS = 2500
/** Hard ceiling: the site is never held back longer than this, whatever goes wrong */
const MAX_MS = 12000

/** The hero sculpture's ink in its dark theme (see THEMES in ink-orbit-hero.tsx) */
const HERO_INK = '#ececec'

type Phase = 'visible' | 'leaving' | 'done'

/** Resolves once the window has loaded and web fonts are ready, so the site is revealed complete. */
function pageReady() {
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }))
  const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve()
  return Promise.all([loaded, fonts.catch(() => undefined)])
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function Intro() {
  // Starts visible so the overlay is server-rendered: the first paint is already
  // black, the page behind it never shows through.
  const [phase, setPhase] = useState<Phase>('visible')
  const [animDone, setAnimDone] = useState(false)
  const skipped = useRef(false)

  const onComplete = useCallback(() => setAnimDone(true), [])

  // Repeat visits: the head script already hid the overlay before first paint.
  useEffect(() => {
    if (!document.documentElement.hasAttribute(SEEN_ATTR)) return
    skipped.current = true
    const stop = setTimeout(() => setPhase('done'), 0)
    return () => clearTimeout(stop)
  }, [])

  // First visit: keep the overlay until the reveal has fully played AND the page is ready.
  useEffect(() => {
    const root = document.documentElement
    if (root.hasAttribute(SEEN_ATTR)) return

    // Record entry immediately, including when the visitor refreshes before
    // the animation finishes. The head script also does this before hydration.
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // The document flag still prevents replays during in-app navigation.
    }
    root.setAttribute(ACTIVE_ATTR, '')

    let cancelled = false
    const ceiling = setTimeout(() => {
      if (!cancelled) setPhase((p) => (p === 'visible' ? 'leaving' : p))
    }, MAX_MS)

    return () => {
      cancelled = true
      clearTimeout(ceiling)
    }
  }, [])

  useEffect(() => {
    if (!animDone || skipped.current) return
    let cancelled = false
    const started = performance.now()

    Promise.race([pageReady(), wait(LOAD_GRACE_MS)])
      .then(() => wait(Math.max(SETTLE_MS, MIN_MS - (performance.now() - started))))
      .then(() => {
        if (!cancelled) setPhase((p) => (p === 'visible' ? 'leaving' : p))
      })

    return () => {
      cancelled = true
    }
  }, [animDone])

  // Leaving: let the page wake up under the fade, then unmount the overlay.
  useEffect(() => {
    if (phase !== 'leaving') return
    document.documentElement.removeAttribute(ACTIVE_ATTR)
    const done = setTimeout(() => {
      document.documentElement.setAttribute(SEEN_ATTR, '')
      setPhase('done')
    }, FADE_MS)
    return () => clearTimeout(done)
  }, [phase])

  // Hold the page still while the intro is on screen.
  useEffect(() => {
    if (phase === 'done' || document.documentElement.hasAttribute(SEEN_ATTR)) return

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
        <ZedOrbitForm
          className="w-[min(58vw,380px)]"
          // Same ink as the hero's 3D sculpture (InkOrbitHero, dark theme)
          style={{ color: HERO_INK }}
          onComplete={onComplete}
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
