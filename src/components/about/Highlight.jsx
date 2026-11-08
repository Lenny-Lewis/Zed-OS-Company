'use client'

import { useEffect, useRef } from 'react'
import { gsap, MOTION_OK, REDUCED } from './motion'
import styles from './About.module.css'

/*
 * An orange (brand) bar sweeps left to right in behind the words when they scroll in, and stays.
 * With `manual`, a parent animates the bar
 * itself (the horizontal story does, since its triggers follow the sideways track).
 */
export default function Highlight({ children, manual = false, start = 'top 82%' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (manual) return
    const el = ref.current
    const bar = el.querySelector('[data-hl-bar]')
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
        },
      )
    })
    mm.add(REDUCED, () => {
      gsap.set(bar, { scaleX: 1 })
    })
    return () => mm.revert()
  }, [manual, start])

  return (
    <span ref={ref} className={styles.hl}>
      {children}
      <span className={styles.hlBar} data-hl-bar aria-hidden="true" />
    </span>
  )
}
