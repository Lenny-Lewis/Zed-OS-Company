'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedHeadline, scramble, whenInView } from './primitives'
import { standards } from '@/data/home'
import styles from './home.module.css'
import s from './sections.module.css'

const BACK_OUT = [0.34, 1.56, 0.64, 1]
const POWER3_OUT = [0.25, 1, 0.5, 1]

/*
 * "What's in every job", after good-fella.com's "What's in a landmark": six principles in a grid.
 * Their titles scramble in, one after another, as the grid scrolls into view. Hovering one turns an
 * orange square in beside its title, which steps right and scrambles again.
 */
export default function HomeStandards() {
  const [hovered, setHovered] = useState(null)
  const grid = useRef(null)
  const titles = useRef([])

  useEffect(() => {
    const els = titles.current.filter(Boolean)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    els.forEach((el) => {
      el.style.visibility = 'hidden'
    })
    return whenInView(
      grid.current,
      () => {
        els.forEach((el, i) => {
          window.setTimeout(() => {
            el.style.visibility = ''
            scramble(el, standards.items[i].title, { reveal: true })
          }, i * 80)
        })
      },
      'top 85%',
    )
  }, [])

  const enter = (i) => {
    setHovered(i)
    scramble(titles.current[i], standards.items[i].title)
  }

  return (
    <section className={styles.light} data-header-tone="light" aria-labelledby="standards-title">
      <div className={styles.container}>
        <div className={`${styles.grid} ${s.indexHead}`}>
          <div className={s.indexHeadRow}>
            <AnimatedHeadline text={standards.title} className={`${styles.h2} ${s.halfWide}`} />
            <span className={styles.label}>{standards.label}</span>
          </div>
          <div className={s.indexSub}>
            <span className={styles.brandSquare} aria-hidden="true" />
            <span id="standards-title" className={`${styles.accentSm} ${styles.upper}`}>
              {standards.sublabel}
            </span>
          </div>
        </div>
        <div ref={grid} className={styles.grid}>
          {standards.items.map((item, i) => {
            const on = hovered === i
            return (
              <div
                key={item.title}
                className={s.indexItem}
                onMouseEnter={() => enter(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className={s.indexTitleRow}>
                  <motion.span
                    className={s.indexSquare}
                    initial={false}
                    animate={{ rotate: on ? 0 : -90, scale: on ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: BACK_OUT }}
                    aria-hidden="true"
                  />
                  <motion.h3
                    className={`${styles.accent} ${styles.upper} ${s.indexTitle}`}
                    animate={{ x: on ? 28 : 0 }}
                    transition={{ duration: 0.5, ease: POWER3_OUT }}
                  >
                    <span
                      ref={(el) => {
                        titles.current[i] = el
                      }}
                    >
                      {item.title}
                    </span>
                  </motion.h3>
                </div>
                <div className={s.rule} />
                <p className={`${styles.body} ${styles.muted} ${s.indexText}`}>{item.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
