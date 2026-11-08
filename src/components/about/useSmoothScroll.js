'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, MOTION_OK } from './motion'

/*
 * Lenis smooth scrolling for the page that calls this, driven by GSAP's ticker so pinned and
 * scrubbed sections move in step with it. Pauses under the site menu, a page dialog or a page
 * transition. Also re-measures the
 * scroll triggers once web fonts arrive, since display text changes size when they do.
 */
export function useSmoothScroll() {
  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })

    if (!window.matchMedia(MOTION_OK).matches) {
      return () => {
        cancelled = true
      }
    }

    const lenis = new Lenis({ lerp: 0.1, autoRaf: false })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const root = document.documentElement
    // Paused under the site menu, a page's own dialog (data-modal-open, e.g. the quote) and a page
    // transition, so nothing scrolls behind them.
    const paused = () =>
      root.hasAttribute('data-menu-open') || root.hasAttribute('data-modal-open') || root.hasAttribute('data-transition-phase')
    const menuWatch = new MutationObserver(() => {
      if (paused()) lenis.stop()
      else lenis.start()
    })
    menuWatch.observe(root, { attributes: true, attributeFilter: ['data-menu-open', 'data-modal-open', 'data-transition-phase'] })

    return () => {
      cancelled = true
      menuWatch.disconnect()
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])
}
