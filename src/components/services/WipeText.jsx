'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageEnter } from './ServicesShell'
import styles from './WipeText.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/*
 * Text revealed line by line: an orange block and then a solid one sweep across each line, the text
 * switches on underneath, and the solid block pulls away. Lines are the ones the browser actually
 * wraps to, so it holds at any width. `trigger` is "enter" (as the page's cover lifts) or "scroll".
 */
export default function WipeText({ text, as: Tag = 'h2', className = '', trigger = 'scroll', start = 'top 85%' }) {
  const ref = useRef(null)
  const [lines, setLines] = useState(null)
  const played = useRef(false)
  const timeline = useRef(null)

  // Measures which words share a line. Runs again (from words) whenever the width changes.
  useLayoutEffect(() => {
    if (lines) return
    const el = ref.current
    if (!el) return
    const result = []
    let top = null
    for (const word of el.querySelectorAll('[data-word]')) {
      if (top === null || Math.abs(word.offsetTop - top) > 2) {
        result.push([])
        top = word.offsetTop
      }
      result[result.length - 1].push(word.textContent.trim())
    }
    setLines(result.map((words) => words.join(' ')))
  }, [lines])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let width = el.offsetWidth
    const ro = new ResizeObserver(() => {
      if (Math.abs(el.offsetWidth - width) < 1) return
      width = el.offsetWidth
      setLines(null)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const play = () => {
    const el = ref.current
    if (!el || played.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    played.current = true
    const tl = gsap.timeline({
      onComplete: () => {
        el.removeAttribute('data-wipe-pending')
      },
    })
    el.querySelectorAll('[data-line]').forEach((line, index) => {
      const words = line.querySelector('[data-line-text]')
      const accent = line.querySelector('[data-block="accent"]')
      const cover = line.querySelector('[data-block="cover"]')
      const at = index * 0.12
      tl.fromTo(accent, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.38, ease: 'power3.inOut' }, at)
        .fromTo(cover, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.38, ease: 'power3.inOut' }, at + 0.1)
        .set(words, { opacity: 1 }, at + 0.48)
        .set(accent, { opacity: 0 }, at + 0.48)
        .set(cover, { transformOrigin: 'right center' }, at + 0.48)
        .to(cover, { scaleX: 0, duration: 0.38, ease: 'power3.inOut' }, at + 0.48)
    })
    timeline.current = tl
  }

  // Hidden until it plays. Never hidden for reduced motion, or once it has already played.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !lines || played.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.setAttribute('data-wipe-pending', '')
  }, [lines])

  // "enter" plays once both have happened, in either order: the cover lifting and the lines measured.
  const pageEntered = useRef(false)
  usePageEnter(() => {
    pageEntered.current = true
    if (trigger === 'enter' && ref.current?.querySelector('[data-line]')) play()
  })

  useEffect(() => {
    if (!lines || played.current) return
    if (trigger === 'enter') {
      if (pageEntered.current) play()
      return
    }
    const st = ScrollTrigger.create({ trigger: ref.current, start, once: true, onEnter: play })
    return () => st.kill()
  }, [lines, trigger, start])

  useEffect(() => () => timeline.current?.kill(), [])

  return (
    <Tag ref={ref} className={`${styles.root} ${className}`} aria-label={text}>
      {lines
        ? lines.map((line, index) => (
            <span key={index} className={styles.line} data-line aria-hidden="true">
              <span className={styles.text} data-line-text>
                {line}
              </span>
              <span className={`${styles.block} ${styles.accent}`} data-block="accent" />
              <span className={`${styles.block} ${styles.cover}`} data-block="cover" />
            </span>
          ))
        : text.split(/\s+/).map((word, index) => (
            <span key={index} data-word aria-hidden="true">
              {word}{' '}
            </span>
          ))}
    </Tag>
  )
}
