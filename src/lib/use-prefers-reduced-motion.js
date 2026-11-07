'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange) {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
// The server can't know the preference. Hydration uses this value too and then re-renders with the
// real one, so the first browser render always matches the HTML. That's the difference from motion's
// useReducedMotion, which answers immediately in the browser and causes a hydration mismatch.
const getServerSnapshot = () => false

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
