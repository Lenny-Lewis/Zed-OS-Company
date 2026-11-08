'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const REDUCED = '(prefers-reduced-motion: reduce)'

/** True while something covers the whole screen: the first-visit intro, or a page transition. */
export function screenCovered() {
  const root = document.documentElement
  const phase = root.getAttribute('data-transition-phase')
  return root.hasAttribute('data-intro-active') || phase === 'entering' || phase === 'holding'
}

/**
 * Calls `fn` once nothing covers the screen: once the intro loader has gone, or a page transition's
 * cover starts to swing away (straight away if neither is showing).
 */
export function onIntroDone(fn) {
  if (!screenCovered()) {
    fn()
    return () => {}
  }
  const root = document.documentElement
  const watch = new MutationObserver(() => {
    if (screenCovered()) return
    watch.disconnect()
    fn()
  })
  watch.observe(root, { attributes: true, attributeFilter: ['data-intro-active', 'data-transition-phase'] })
  return () => watch.disconnect()
}
