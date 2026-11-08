'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'
import './PageTransition.css'

/*
 * Page changes as one continuous move, after good-fella.com's:
 *
 *   idle → entering (1.3s: the orange square swings in and covers the screen)
 *        → holding  (the route changes underneath; at least a beat, and until the new page is in)
 *        → exiting  (1.2s: the square swings away to the right and the new page shows)
 *        → idle
 *
 * Every same-site link takes part without changes of its own: one click listener on the document
 * catches internal links before Next's <Link> does. Links opt out with data-no-transition. Moves
 * between /services pages are left to their own transition (ServicesShell). Back and forward skip
 * the swing in: the cover shows at once and swings away. Reduced motion: plain navigation.
 *
 * The phase is on <html data-transition-phase> while not idle, so anything can wait for the cover:
 * page entrances (onIntroDone), smooth scrolling and the 3D scenes pause under it.
 */

const ENTER_MS = 1300
const HOLD_MIN_MS = 100
const EXIT_MS = 1200

const TransitionContext = createContext({ phase: 'idle', navigate: () => {} })
export const usePageTransition = () => useContext(TransitionContext)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const noSubscribe = () => () => {}
const isServices = (path) => path === '/services' || path.startsWith('/services/')

export function PageTransitionProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState('idle')
  const [isPending, startRouteChange] = useTransition()
  const timer = useRef(0)
  const holdingSince = useRef(0)
  const target = useRef(null)
  const phaseRef = useRef('idle')

  useEffect(() => {
    phaseRef.current = phase
    const root = document.documentElement
    if (phase === 'idle') root.removeAttribute('data-transition-phase')
    else root.setAttribute('data-transition-phase', phase)
  }, [phase])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const navigate = useCallback(
    (href) => {
      if (phaseRef.current !== 'idle') return
      if (reducedMotion()) {
        router.push(href)
        return
      }
      router.prefetch(href)
      target.current = new URL(href, window.location.href).pathname
      setPhase('entering')
      timer.current = window.setTimeout(() => {
        holdingSince.current = Date.now()
        setPhase('holding')
        startRouteChange(() => router.push(href, { scroll: true }))
      }, ENTER_MS)
    },
    [router],
  )

  // Out again once the new page has rendered (the route change has finished and the path is the new one).
  useEffect(() => {
    if (phase !== 'holding' || isPending) return
    if (target.current && pathname !== target.current) return
    const wait = Math.max(0, HOLD_MIN_MS - (Date.now() - holdingSince.current))
    timer.current = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      setPhase('exiting')
      timer.current = window.setTimeout(() => {
        target.current = null
        setPhase('idle')
        // Scroll-linked animations measured under the cover: measure again on the settled page.
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh(true))
      }, EXIT_MS)
    }, wait)
  }, [phase, isPending, pathname])

  // Back and forward: the browser has already changed the page, so cover at once and swing away.
  useEffect(() => {
    const onPop = () => {
      if (reducedMotion() || phaseRef.current !== 'idle') return
      target.current = null
      holdingSince.current = Date.now()
      setPhase('holding')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Catch same-site link clicks before Next's <Link> handles them.
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!link || link.hasAttribute('download') || link.hasAttribute('data-no-transition')) return
      const opens = link.getAttribute('target')
      if (opens && opens !== '_self') return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin) return
      const here = window.location.pathname
      // The same page (or just a #section on it): let the browser and the link do their thing.
      if (url.pathname === here) return
      if (isServices(url.pathname) && isServices(here)) return
      event.preventDefault()
      if (phaseRef.current !== 'idle') return
      navigate(url.pathname + url.search + url.hash)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate])

  return <TransitionContext.Provider value={{ phase, navigate }}>{children}</TransitionContext.Provider>
}

/** The square, the blur behind it and the loading squares. Rendered into <body>. */
export function PageTransitionOverlay() {
  const { phase } = usePageTransition()
  // Only in the browser (there's no <body> to portal into on the server).
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false)
  if (!mounted) return null
  return createPortal(
    <>
      <div className="pt-veil" data-phase={phase} aria-hidden="true" />
      <div className="pt-square" data-phase={phase} aria-hidden="true" />
      <div className="pt-loader" data-phase={phase} aria-hidden="true">
        <div className="pt-loader-row">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ '--i': i }} />
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {phase === 'holding' ? 'Loading page' : ''}
      </p>
    </>,
    document.body,
  )
}
