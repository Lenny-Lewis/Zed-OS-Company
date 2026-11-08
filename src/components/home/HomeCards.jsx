'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { gsap } from '@/components/about/motion'
import { RollerNumber, scramble, useMedia, whenInView } from './primitives'
import { cards } from '@/data/home'
import styles from './home.module.css'
import s from './sections.module.css'

const BACK_OUT = [0.34, 1.56, 0.64, 1]
const POWER3_OUT = [0.25, 1, 0.5, 1]

/*
 * A photo and three facts in a row of cards. They rise in together as the section arrives and the
 * numbers roll up. Hovering a fact turns an orange square in beside its line, which steps right and
 * scrambles.
 */
export default function HomeCards() {
  const grid = useRef(null)
  const cardRefs = useRef([])
  const textRefs = useRef([])
  const [hovered, setHovered] = useState(null)
  // Below 1024px there's no hover treatment (as on good-fella).
  const touch = useMedia('(max-width: 1023px)')

  useEffect(() => {
    const items = cardRefs.current.filter(Boolean)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.set(items, { yPercent: 25, opacity: 0 })
    return whenInView(grid.current, () => {
      gsap.to(items, { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.1 })
    })
  }, [])

  const enter = (i, text) => {
    setHovered(i)
    if (!touch) scramble(textRefs.current[i], text)
  }

  return (
    <section className={styles.light} data-header-tone="light" aria-label="Zed OS at a glance">
      <div className={styles.container}>
        <div ref={grid} className={s.cards} onMouseLeave={() => setHovered(null)}>
          <div
            ref={(el) => {
              cardRefs.current[0] = el
            }}
            className={s.mediaCard}
          >
            <Image src={cards.media.src} alt={cards.media.alt} fill sizes="(max-width: 1023px) 100vw, 25vw" className={styles.cover} />
          </div>
          {cards.stats.map((stat, i) => {
            const on = hovered === i
            return (
              <div
                key={stat.text}
                ref={(el) => {
                  cardRefs.current[i + 1] = el
                }}
                className={s.statCard}
                onMouseEnter={() => enter(i, stat.text)}
              >
                <span className={`${styles.h1Light} ${s.statValue}`}>
                  <RollerNumber value={stat.value} suffix={stat.suffix} />
                </span>
                <span className={`${styles.accent} ${s.statText}`}>
                  {!touch && (
                    <motion.span
                      className={s.statSquare}
                      initial={false}
                      animate={{ rotate: on ? 0 : -90, scale: on ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: BACK_OUT }}
                      aria-hidden="true"
                    />
                  )}
                  <motion.span animate={touch ? {} : { x: on ? 24 : 0 }} transition={{ duration: 0.5, ease: POWER3_OUT }}>
                    <span
                      ref={(el) => {
                        textRefs.current[i] = el
                      }}
                    >
                      {stat.text}
                    </span>
                  </motion.span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
