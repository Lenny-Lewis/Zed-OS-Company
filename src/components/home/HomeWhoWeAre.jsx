'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { AnimatedHeadline, LineLink } from './primitives'
import { whoWeAre } from '@/data/home'
import styles from './home.module.css'
import s from './sections.module.css'

// good-fella's easings: power3InOut for the rows and the photo strip, backInOutSubtle (a slight
// pull back before, and overshoot after) for the square.
const EASE = [0.76, 0, 0.24, 1]
const MARKER_EASE = [0.68, -0.3, 0.32, 1.1]
// The first sixth of the scroll stays on the first point; the rest is shared between the others.
const LEAD = 1 / 6

/*
 * "Who we are", after good-fella.com's "How we work": on wide screens the section is 320vh tall and
 * its content is held in place while you scroll through it. Each stretch of scroll makes the next
 * point active: it brightens and steps right, the orange square slides to it turning a quarter, and
 * the photo strip moves up to its picture. Clicking a point scrolls to it. Narrow screens get a list.
 */
export default function HomeWhoWeAre() {
  const { items } = whoWeAre
  const track = useRef(null)
  const rows = useRef([])
  const [active, setActive] = useState(0)
  const [turns, setTurns] = useState(0)
  const [markerY, setMarkerY] = useState(0)

  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next =
      progress < LEAD ? 0 : Math.min(Math.floor(((progress - LEAD) / (1 - LEAD)) * (items.length - 1)) + 1, items.length - 1)
    if (next !== active) {
      setActive(next)
      setTurns((n) => n + 1)
    }
  })

  // Where the active point sits, for the square. Measured after layout, then on resize.
  useLayoutEffect(() => {
    const measure = () => {
      const row = rows.current[active]
      const first = rows.current[0]
      if (row && first) setMarkerY(row.getBoundingClientRect().top - first.getBoundingClientRect().top)
    }
    const frame = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
    }
  }, [active])

  const goTo = (index) => {
    const el = track.current
    if (!el) return
    const top = window.scrollY + el.getBoundingClientRect().top
    const travel = el.scrollHeight - window.innerHeight
    const at = index === 0 ? LEAD / 2 : LEAD + ((1 - LEAD) / (items.length - 1)) * (index - 0.5)
    window.scrollTo({ top: top + at * travel, behavior: 'smooth' })
  }

  return (
    <section className={`${styles.light} ${styles.flush}`} data-header-tone="light" aria-label={whoWeAre.title}>
      {/* Wide screens */}
      <div ref={track} className={s.listTrack}>
        <div className={s.listStage}>
          <div className={styles.container}>
            <div className={styles.grid}>
              <div className={s.listCol}>
                <div className={s.listHead}>
                  <div>
                    <AnimatedHeadline text={whoWeAre.title} className={styles.h2} />
                    <p className={`${styles.body} ${s.listMore}`}>
                      <LineLink href={whoWeAre.link.href}>{whoWeAre.link.label}</LineLink>
                    </p>
                  </div>
                  <span className={styles.label}>{whoWeAre.label}</span>
                </div>
                <div className={s.listBody}>
                  <div className={s.listItems}>
                    {/* The square is positioned within the rows themselves, not the taller column
                        they're centred in, so it lines up with the active row's number. */}
                    <div className={s.listInner}>
                    <motion.span
                      className={s.listMarker}
                      aria-hidden="true"
                      animate={{ y: markerY, rotate: 90 * turns }}
                      transition={{ duration: 0.8, ease: MARKER_EASE }}
                    />
                    {items.map((item, i) => {
                      const on = i === active
                      return (
                        <motion.button
                          key={item.title}
                          ref={(el) => {
                            rows.current[i] = el
                          }}
                          type="button"
                          className={s.listItem}
                          data-active={on || undefined}
                          aria-current={on ? 'step' : undefined}
                          onClick={() => goTo(i)}
                          animate={{ opacity: on ? 1 : 0.4, x: on ? 48 : 0 }}
                          transition={{ duration: 0.8, ease: EASE }}
                        >
                          <span className={`${s.listIndex} ${styles.body} ${styles.muted}`}>{String(i + 1).padStart(2, '0')}</span>
                          <span className={s.listText}>
                            <span className={`${styles.h4} ${s.listTitle}`}>{item.title}</span>
                            <span className={`${styles.body} ${styles.muted}`}>{item.text}</span>
                          </span>
                        </motion.button>
                      )
                    })}
                    </div>
                  </div>
                  <div className={s.listMedia} aria-hidden="true">
                    <motion.div className={s.listStrip} animate={{ y: `${-100 * active}%` }} transition={{ duration: 0.8, ease: EASE }}>
                      {items.map((item) => (
                        <div key={item.title} className={s.listFrame}>
                          <Image src={item.image.src} alt="" fill sizes="35vw" className={styles.cover} />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrow screens */}
      <div className={`${styles.container} ${s.listStack}`}>
        <AnimatedHeadline text={whoWeAre.title} className={`${styles.h2} ${s.stackHeadline}`} />
        <span className={styles.label}>{whoWeAre.label}</span>
        <div className={s.stackItems}>
          {items.map((item) => (
            <div key={item.title} className={s.stackItem}>
              <div className={s.stackRow}>
                <span className={styles.brandSquare} aria-hidden="true" />
                <div>
                  <h3 className={`${styles.h4} ${s.listTitle}`}>{item.title}</h3>
                  <p className={`${styles.body} ${styles.muted}`}>{item.text}</p>
                </div>
              </div>
              <div className={s.stackFrame}>
                <Image src={item.image.src} alt={item.image.alt} fill sizes="100vw" className={styles.cover} />
              </div>
            </div>
          ))}
        </div>
        <p className={styles.body}>
          <LineLink href={whoWeAre.link.href}>{whoWeAre.link.label}</LineLink>
        </p>
      </div>
    </section>
  )
}
