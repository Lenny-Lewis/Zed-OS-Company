'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './hover-tag.module.css'

/** How far pointer speed leans the tag, and the most it can lean, in degrees. */
const SWING_PER_PIXEL = 0.5
const SWING_MAX = 35
const QUERY = '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)'

/*
 * An orange tag that follows the pointer while it's over any element inside `rootRef` with a
 * data-hover-tag attribute, showing that attribute's text. It pops in, trails the pointer, and leans
 * into sideways movement. Only with a real mouse, and never with reduced motion.
 */
export default function HoverTag({ rootRef }) {
  const tagRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const tag = tagRef.current
    const swing = tag?.firstElementChild
    const label = swing?.firstElementChild
    if (!root || !tag || !swing || !label) return

    const mm = gsap.matchMedia()
    mm.add(QUERY, () => {
      gsap.set(swing, { xPercent: -50 })
      gsap.set(label, { scale: 0 })
      const moveX = gsap.quickTo(tag, 'x', { duration: 0.7, ease: 'expo.out' })
      const moveY = gsap.quickTo(tag, 'y', { duration: 0.7, ease: 'expo.out' })

      let current = null
      let swinging = false
      let pointerX = 0
      let lastX = 0
      let speed = 0
      let lean = 0

      // Leans into sideways movement, then settles. Only runs while there's something to animate.
      const tick = () => {
        speed = 0.7 * speed + 0.3 * (pointerX - lastX)
        lastX = pointerX
        const target = Math.max(-SWING_MAX, Math.min(SWING_MAX, speed * SWING_PER_PIXEL))
        lean = current ? lean + (target - lean) * 0.2 : lean * 0.92
        gsap.set(swing, { rotation: lean })
        if (!current && Math.abs(lean) < 0.05) {
          gsap.ticker.remove(tick)
          swinging = false
        }
      }

      const show = (target, event) => {
        current = target
        label.textContent = target.getAttribute('data-hover-tag') || 'View'
        pointerX = lastX = event.clientX
        // Starts at the pointer rather than gliding in from wherever it last was.
        moveX(event.clientX, event.clientX)
        moveY(event.clientY, event.clientY)
        gsap.killTweensOf(label)
        gsap.fromTo(label, { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(1.7)' })
        if (!swinging) {
          swinging = true
          gsap.ticker.add(tick)
        }
      }

      const hide = () => {
        current = null
        gsap.killTweensOf(label)
        gsap.to(label, { scale: 0, duration: 0.25, ease: 'power2.inOut' })
      }

      // Delegated, so it keeps working when the elements inside change (filters, view switches).
      const onOver = (event) => {
        const target = event.target.closest?.('[data-hover-tag]')
        if (target && target !== current && root.contains(target)) show(target, event)
      }
      const onOut = (event) => {
        if (!current) return
        const next = event.relatedTarget
        if (next && current.contains(next)) return
        const nextTarget = next?.closest?.('[data-hover-tag]')
        if (nextTarget && root.contains(nextTarget)) return
        hide()
      }
      const onMove = (event) => {
        pointerX = event.clientX
        moveX(event.clientX)
        moveY(event.clientY)
      }

      root.addEventListener('mouseover', onOver)
      root.addEventListener('mouseout', onOut)
      document.addEventListener('mousemove', onMove)
      return () => {
        root.removeEventListener('mouseover', onOver)
        root.removeEventListener('mouseout', onOut)
        document.removeEventListener('mousemove', onMove)
        gsap.ticker.remove(tick)
      }
    })
    return () => mm.revert()
  }, [rootRef])

  return (
    <div ref={tagRef} className={styles.tag} aria-hidden="true">
      <div className={styles.swing}>
        <span className={styles.label}>View</span>
      </div>
    </div>
  )
}
