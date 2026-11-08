'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { gsap, ScrollTrigger, onIntroDone } from '@/components/about/motion'
import styles from './home.module.css'

/*
 * Small pieces the home sections share, each matching good-fella.com's behaviour: the line-by-line
 * headline wipe, text scramble, the sliding-label button, the underline link, rolling numbers and the
 * cursor label.
 */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const noSubscribe = () => () => {}

/** Whether a media query matches, kept up to date. False on the server and during hydration. */
export function useMedia(query) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * Runs `fn` once `el` scrolls into view (its top reaches the bottom of the screen, or `start`), but
 * never while the intro or a page transition covers the screen. Returns a cleanup.
 */
export function whenInView(el, fn, start = 'top bottom') {
  let trigger = null
  const stopWatch = onIntroDone(() => {
    trigger = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: fn })
  })
  return () => {
    stopWatch()
    trigger?.kill()
  }
}

/**
 * Scrambles `el` to `text`: characters settle left to right while those just ahead cycle through
 * random letters in the brand colour. `reveal` starts from blank instead of from the current text.
 * Returns a function that stops it (leaving the final text).
 */
export function scramble(el, text, { duration = 0.5, reveal = false, charClass = styles.scrambleChar } = {}) {
  if (!el) return () => {}
  if (reduced()) {
    el.textContent = text
    return () => {}
  }
  const chars = Array.from(text)
  const count = chars.length
  const start = performance.now()
  let raf = 0
  const step = (now) => {
    const p = Math.min(1, (now - start) / (duration * 1000))
    const settled = Math.floor(Math.max(0, (p - 0.1) / 0.9) * count)
    const front = Math.min(count, Math.ceil(Math.min(1, p * 1.6) * count))
    if (p >= 1) {
      el.textContent = text
      return
    }
    const nodes = [document.createTextNode(chars.slice(0, settled).join(''))]
    for (let i = settled; i < count; i++) {
      const ch = chars[i]
      if (/\s/.test(ch)) {
        nodes.push(document.createTextNode(ch))
      } else if (i < front) {
        const span = document.createElement('span')
        span.className = charClass
        span.textContent = LETTERS[Math.floor(Math.random() * LETTERS.length)]
        nodes.push(span)
      } else {
        nodes.push(document.createTextNode(reveal ? ' ' : ch))
      }
    }
    el.replaceChildren(...nodes)
    raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return () => {
    cancelAnimationFrame(raf)
    el.textContent = text
  }
}

/**
 * A heading revealed line by line as it scrolls into view: a brand bar sweeps across, a bar in the
 * text colour follows, the words switch on beneath, and both bars pull away to the right. Lines are
 * the ones the browser actually wraps to, measured again when the width changes.
 */
export function AnimatedHeadline({ text, as: Tag = 'h2', className = '' }) {
  const ref = useRef(null)
  const [lines, setLines] = useState(null)
  const played = useRef(false)

  // Measure which words share a line.
  useLayoutEffect(() => {
    if (lines) return
    const el = ref.current
    const words = el?.querySelectorAll('[data-word]')
    if (!words?.length) return
    const result = []
    let top = null
    for (const word of words) {
      const y = word.getBoundingClientRect().top
      if (top === null || Math.abs(y - top) > 2) result.push([])
      top = y
      result[result.length - 1].push(word.textContent)
    }
    setLines(result.map((w) => w.join(' ')))
  }, [lines])

  // Re-measure when the width changes, or once web fonts arrive and change the wrapping.
  useEffect(() => {
    const el = ref.current
    let width = el.offsetWidth
    const ro = new ResizeObserver(() => {
      if (Math.abs(el.offsetWidth - width) < 1) return
      width = el.offsetWidth
      setLines(null)
    })
    ro.observe(el)
    let live = true
    document.fonts?.ready.then(() => {
      if (live) setLines(null)
    })
    return () => {
      live = false
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!lines || played.current || reduced()) {
      el.removeAttribute('data-pending')
      return
    }
    el.setAttribute('data-pending', '')
    return whenInView(el, () => {
      played.current = true
      const tl = gsap.timeline({ onComplete: () => el.removeAttribute('data-pending') })
      el.querySelectorAll('[data-line]').forEach((line, r) => {
        const inner = line.querySelector('[data-line-inner]')
        const brand = line.querySelector('[data-brand]')
        const fg = line.querySelector('[data-fg]')
        const at = 0.15 * r
        tl.to(brand, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, at)
          .to(fg, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, at + 0.1)
          .set(inner, { opacity: 1 }, at + 0.5)
          .set([brand, fg], { transformOrigin: 'right' }, at + 0.5)
          .to(fg, { scaleX: 0, duration: 0.45, ease: 'power3.inOut' }, at + 0.5)
          .to(brand, { scaleX: 0, duration: 0.45, ease: 'power3.inOut' }, at + 0.6)
      })
    })
  }, [lines])

  return (
    <Tag ref={ref} className={`${styles.headline} ${className}`} aria-label={text}>
      {lines
        ? lines.map((line, i) => (
            <span key={i} aria-hidden="true">
              {i > 0 && <br />}
              <span className={styles.hLine} data-line>
                <span className={styles.hLineInner} data-line-inner>
                  {line}
                </span>
                <span className={`${styles.hRect} ${styles.hBrand}`} data-brand />
                <span className={`${styles.hRect} ${styles.hFg}`} data-fg />
              </span>
            </span>
          ))
        : text.split(/\s+/).map((word, i) => (
            <span key={i} aria-hidden="true">
              {i > 0 && ' '}
              <span data-word>{word}</span>
            </span>
          ))}
    </Tag>
  )
}

/** Scramble on hover (once per hover): returns props to spread on the hovered element, and a ref. */
export function useHoverScramble(text, options) {
  const ref = useRef(null)
  const running = useRef(false)
  const stop = useRef(() => {})
  useEffect(() => () => stop.current(), [])
  const onMouseEnter = useCallback(() => {
    if (running.current) return
    running.current = true
    stop.current = scramble(ref.current, text, options)
  }, [text, options])
  const onMouseLeave = useCallback(() => {
    running.current = false
  }, [])
  return { ref, onMouseEnter, onMouseLeave }
}

const PLUS = (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
)
const WHITE_SCRAMBLE = { duration: 0.5 }

/**
 * The button: a label block with a square "+" block on its right. On hover a second "+" turns in on
 * the left, the label slides across, the right one turns away, and the label scrambles once.
 */
export function AnimatedButton({ href, children, theme = 'light', size = 'default', external = false, ...props }) {
  const { ref, onMouseEnter, onMouseLeave } = useHoverScramble(children, WHITE_SCRAMBLE)
  const className = `${styles.btn} ${size === 'sm' ? styles.btnSm : styles.btnDefault} ${
    theme === 'brand' ? styles.btnBrand : styles.btnLight
  }`
  const inner = (
    <span className={styles.btnInner}>
      <span className={`${styles.btnIcon} ${styles.btnIconLeft}`}>{PLUS}</span>
      <span className={styles.btnLabel}>
        <span ref={ref}>{children}</span>
      </span>
      <span className={`${styles.btnIcon} ${styles.btnIconRight}`}>{PLUS}</span>
    </span>
  )
  const handlers = { onMouseEnter, onMouseLeave, onFocus: onMouseEnter, onBlur: onMouseLeave }
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...handlers} {...props}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={className} {...handlers} {...props}>
      {inner}
    </Link>
  )
}

/** Text link whose underline wipes out to the right, then draws back in from the left. */
export function LineLink({ href, children, className = '' }) {
  return (
    <Link href={href} className={`${styles.lineLink} ${className}`}>
      {children}
      <span className={styles.lineWrap} aria-hidden="true">
        <span className={styles.lineA} />
        <span className={styles.lineB} />
      </span>
    </Link>
  )
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * Digits that roll up into place, the rightmost first, when the number scrolls into view. Each column
 * holds three runs of 0-9 and travels from the first run to the third.
 */
export function RollerNumber({ value, suffix = '', prefix = '', duration = 2, stagger = 0.1 }) {
  const ref = useRef(null)
  const digits = String(Math.round(value)).split('').map(Number)

  useEffect(() => {
    const el = ref.current
    const columns = el.querySelectorAll('[data-roller]')
    const settle = () =>
      columns.forEach((col, i) => gsap.set(col, { y: `${-20 - digits[i]}em` }))
    if (reduced()) {
      settle()
      return
    }
    return whenInView(el, () => {
      columns.forEach((col, i) => {
        gsap.fromTo(
          col,
          { y: '-10em' },
          { y: `${-20 - digits[i]}em`, duration, delay: (digits.length - 1 - i) * stagger, ease: 'expo.inOut' },
        )
      })
    })
    // The digits are derived from `value`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, stagger])

  return (
    <span ref={ref} className={styles.roller} aria-label={`${prefix}${value}${suffix}`}>
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {digits.map((_, i) => (
        <span key={i} className={styles.rollerDigit} aria-hidden="true">
          <span className={styles.rollerInner} data-roller>
            {[...DIGITS, ...DIGITS, ...DIGITS].map((d, j) => (
              <span key={j}>{d}</span>
            ))}
          </span>
        </span>
      ))}
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  )
}

/**
 * An orange tag that follows the pointer over anything with data-cursor-text, showing that text. It
 * springs in, trails the pointer, and tilts with sideways speed. Mouse only; hidden during page
 * transitions and with reduced motion.
 */
export function CursorLabel() {
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false)
  const box = useRef(null)
  const tilt = useRef(null)
  const tag = useRef(null)

  useEffect(() => {
    if (!mounted) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || reduced()) return
    const el = box.current
    const label = tag.current
    const pointer = { x: -9999, y: -9999 }
    const last = { x: 0 }
    let velocity = 0
    let rotation = 0
    let showing = false
    let current = null
    gsap.set(el, { x: -9999, y: -9999 })

    const show = (text) => {
      showing = true
      label.textContent = text
      gsap.killTweensOf(label)
      gsap.fromTo(label, { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(1.7)' })
    }
    const hide = () => {
      showing = false
      gsap.killTweensOf(label)
      gsap.to(label, { scale: 0, duration: 0.25, ease: 'power2.inOut' })
    }
    const onMove = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      el.setAttribute('data-visible', '')
      gsap.to(el, { x: pointer.x, y: pointer.y, duration: 0.7, ease: 'expo.out', overwrite: true })
      const target = event.target instanceof Element ? event.target.closest('[data-cursor-text]') : null
      if (target !== current) {
        current = target
        if (target) show(target.getAttribute('data-cursor-text'))
        else if (showing) hide()
      }
    }
    const onLeave = () => el.removeAttribute('data-visible')
    let raf = 0
    const tick = () => {
      velocity = 0.7 * velocity + 0.3 * (pointer.x - last.x)
      last.x = pointer.x
      const target = Math.max(-35, Math.min(35, velocity * 0.5))
      rotation = showing ? rotation + (target - rotation) * 0.2 : rotation * 0.92
      gsap.set(tilt.current, { rotation })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    // A page transition starting: put the tag away.
    const watch = new MutationObserver(() => {
      if (document.documentElement.hasAttribute('data-transition-phase') && showing) {
        current = null
        hide()
      }
    })
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-transition-phase'] })
    document.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      watch.disconnect()
      document.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf([el, label])
    }
  }, [mounted])

  if (!mounted) return null
  return createPortal(
    <div ref={box} className={styles.cursor} aria-hidden="true">
      <div ref={tilt} className={styles.cursorTilt}>
        <div ref={tag} className={styles.cursorTag} />
      </div>
    </div>,
    document.body,
  )
}
