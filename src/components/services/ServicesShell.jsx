'use client'

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useScramble } from '@/lib/use-scramble'
import styles from './ServicesShell.module.css'

/*
 * Wraps /services and every /services/<slug>. It owns the orange cover, which plays as a loader when
 * the visitor arrives and as the transition between services, and tells pages when the cover lifts so
 * their entrance animations start then and not underneath it.
 */

const TransitionContext = createContext({ navigate: () => {}, onEnter: () => () => {} })

export const useServicesTransition = () => useContext(TransitionContext)

/** Runs `callback` once, as the cover lifts (or straight away if it already has). */
export function usePageEnter(callback) {
  const { onEnter } = useContext(TransitionContext)
  const latest = useRef(callback)
  useEffect(() => {
    latest.current = callback
  })
  useEffect(() => onEnter(() => latest.current()), [onEnter])
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Uncovers diagonally from the top-left corner: 0 is fully covered, 1 is fully open. */
function clipFor(progress) {
  if (progress <= 0) return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
  if (progress >= 1) return 'polygon(0% 100%, 0% 100%, 0% 100%)'
  if (progress <= 0.5) return `polygon(0% 100%, ${progress * 200}% 0%, 100% 0%, 100% 100%)`
  return `polygon(0% 100%, 100% ${(progress - 0.5) * 200}%, 100% 100%)`
}

export default function ServicesShell({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const coverRef = useRef(null)
  const loaderRef = useRef(null)
  const squaresRef = useRef([])
  const { ref: wordRef, run: scrambleWord } = useScramble('LOADING')

  const entered = useRef(false)
  const waiting = useRef(new Set())
  const pendingPath = useRef(null)
  const busy = useRef(false)

  const enter = useCallback(() => {
    entered.current = true
    const callbacks = [...waiting.current]
    waiting.current.clear()
    callbacks.forEach((callback) => callback())
  }, [])

  const onEnter = useCallback((callback) => {
    if (entered.current) {
      callback()
      return () => {}
    }
    waiting.current.add(callback)
    return () => waiting.current.delete(callback)
  }, [])

  // Lifts the cover. Pages are told to start at 90%, when most of the screen is already showing.
  const reveal = useCallback(
    (delay = 0) => {
      const cover = coverRef.current
      if (!cover) return enter()
      const state = { value: 0 }
      let told = false
      gsap.to(state, {
        value: 1,
        duration: 1.05,
        delay,
        ease: 'expo.inOut',
        onUpdate: () => {
          cover.style.clipPath = clipFor(state.value)
          if (!told && state.value >= 0.9) {
            told = true
            enter()
          }
        },
        onComplete: () => {
          cover.style.visibility = 'hidden'
          busy.current = false
        },
      })
    },
    [enter],
  )

  // Arrival. Skipped when the site's own first-visit intro is already covering the screen.
  useLayoutEffect(() => {
    const cover = coverRef.current
    const root = document.documentElement
    root.setAttribute('data-header-solid', '')

    if (root.hasAttribute('data-intro-active') || reducedMotion()) {
      cover.style.visibility = 'hidden'
      if (!root.hasAttribute('data-intro-active')) {
        enter()
      } else {
        const watch = new MutationObserver(() => {
          if (root.hasAttribute('data-intro-active')) return
          watch.disconnect()
          enter()
        })
        watch.observe(root, { attributes: true, attributeFilter: ['data-intro-active'] })
        return () => {
          watch.disconnect()
          root.removeAttribute('data-header-solid')
        }
      }
      return () => root.removeAttribute('data-header-solid')
    }

    busy.current = true
    scrambleWord()
    // Four squares roll in one after another, each turning a quarter.
    const squares = squaresRef.current.filter(Boolean)
    const roll = gsap.timeline()
    squares.forEach((square, index) => {
      roll.fromTo(
        square,
        { x: index === 0 ? -16 : (index - 1) * 18, rotate: 0 },
        { x: 18 * index - 16, rotate: 90, duration: 0.5, ease: 'expo.inOut', immediateRender: false },
        index === 0 ? 0 : '>-25%',
      )
    })
    gsap.to(loaderRef.current, { opacity: 0, duration: 0.28, ease: 'power3.out', delay: 1.765 })
    reveal(1.625)

    return () => {
      roll.kill()
      root.removeAttribute('data-header-solid')
    }
  }, [enter, reveal, scrambleWord])

  // Covers the screen, then changes page. The new page's arrival (below) lifts the cover again.
  const navigate = useCallback(
    (href) => {
      if (busy.current) return
      if (reducedMotion() || href === pathname) {
        router.push(href, { scroll: true })
        return
      }
      busy.current = true
      router.prefetch(href)
      const cover = coverRef.current
      gsap.set(loaderRef.current, { opacity: 0 })
      cover.style.visibility = 'visible'
      const state = { value: 1 }
      gsap.to(state, {
        value: 0,
        duration: 0.55,
        ease: 'expo.inOut',
        onUpdate: () => {
          cover.style.clipPath = clipFor(state.value)
        },
        onComplete: () => {
          entered.current = false
          pendingPath.current = href
          router.push(href, { scroll: true })
        },
      })
    },
    [pathname, router],
  )

  // The header bar takes the tone of whatever section is under it: light grey over light sections,
  // dark over dark ones. Sections say which with data-header-tone; anything else counts as dark.
  useEffect(() => {
    const root = document.documentElement
    const header = document.querySelector('.cn-header')
    let frame = 0
    const check = () => {
      frame = 0
      // Which marked section spans the header's middle. Reads positions rather than hit-testing, so a
      // fixed overlay (the site's intro, say) can't stand in for the section.
      const y = header ? header.getBoundingClientRect().bottom / 2 : 40
      let tone = 'dark'
      for (const section of document.querySelectorAll('[data-header-tone]')) {
        if (section === root) continue // The result is stored on <html> under the same name.
        const { top, bottom } = section.getBoundingClientRect()
        if (top <= y && bottom > y) tone = section.getAttribute('data-header-tone')
      }
      if (root.getAttribute('data-header-tone') !== tone) root.setAttribute('data-header-tone', tone)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Sections change when the page does, and as images load and shift things.
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
      root.removeAttribute('data-header-tone')
    }
  }, [pathname])

  useEffect(() => {
    if (!pendingPath.current || pendingPath.current !== pathname) return
    pendingPath.current = null
    window.scrollTo({ top: 0, behavior: 'instant' })
    reveal(0.25)
  }, [pathname, reveal])

  return (
    <TransitionContext.Provider value={{ navigate, onEnter }}>
      <div className={styles.theme}>{children}</div>
      <div ref={coverRef} className={styles.cover} aria-hidden="true">
        <div ref={loaderRef} className={styles.loader}>
          <div className={styles.squares}>
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                ref={(el) => {
                  squaresRef.current[index] = el
                }}
                className={styles.square}
              />
            ))}
          </div>
          <span ref={wordRef} className={styles.word}>
            LOADING
          </span>
        </div>
      </div>
      {/* Without JavaScript nothing would lift the cover, so it's never shown. */}
      <noscript>
        <style>{`.${styles.cover}{display:none}`}</style>
      </noscript>
    </TransitionContext.Provider>
  )
}
