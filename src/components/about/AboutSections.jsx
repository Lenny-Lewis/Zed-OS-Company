'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, ScrollTrigger, MOTION_OK, REDUCED } from './motion'
import Highlight from './Highlight'
import RollText, { ArrowDot } from './RollText'
import { intro, services, statement, oval } from '@/data/about'
import styles from './About.module.css'

/* Who we are: a label, the intro paragraph rising in line by line, and two links. */
export function AboutIntro() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from(el.querySelectorAll('[data-rise]'), {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%' },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className={styles.intro}>
      <p className={styles.label} data-rise>
        (Who we are)
      </p>
      <div>
        <p className={styles.introText} data-rise>
          {intro}
        </p>
        <div className={styles.introLinks} data-rise>
          <Link href="/services" className={styles.pillLink}>
            <RollText text="Our services" />
            <ArrowDot />
          </Link>
          <Link href="/contact" className={styles.pillLink}>
            <RollText text="Work with us" />
            <ArrowDot />
          </Link>
        </div>
      </div>
    </section>
  )
}

/*
 * Two rows of service names drifting in opposite directions. Scrolling speeds them up, and scrolling
 * back up reverses them.
 */
export function AboutMarquee({ items = services, label = 'What we do' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const rows = gsap.utils.toArray('[data-marquee-row]', el).map((row, i) => ({
        el: row,
        base: i % 2 ? -1 : 1,
        pos: i % 2 ? -25 : 0,
      }))
      const wrap = gsap.utils.wrap(-50, 0)
      let direction = 1
      let boost = 0
      let active = false

      const tick = (_time, deltaMs) => {
        if (!active) return
        const step = (deltaMs / 1000) * 2.2 * (1 + boost) * direction
        for (const row of rows) {
          row.pos = wrap(row.pos - step * row.base)
          row.el.style.transform = `translate3d(${row.pos}%,0,0)`
        }
        boost *= 0.93
      }
      gsap.ticker.add(tick)

      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          active = self.isActive
        },
        onUpdate: (self) => {
          direction = self.direction
          boost = Math.min(Math.abs(self.getVelocity()) / 350, 7)
        },
      })
      return () => gsap.ticker.remove(tick)
    })
    return () => mm.revert()
  }, [])

  const row = (outline) =>
    [0, 1].map((copy) => (
      <span key={copy} className={styles.marqueeCopy} aria-hidden={copy === 1 || undefined}>
        {items.map((name) => (
          <span key={name} className={`${styles.marqueeItem} ${outline ? styles.outline : ''}`}>
            {name}
            <span className={styles.marqueeDot} />
          </span>
        ))}
      </span>
    ))

  return (
    <section ref={ref} className={styles.marquee} aria-label={label}>
      <div className={styles.marqueeRow} data-marquee-row>
        {row(false)}
      </div>
      <div className={styles.marqueeRow} data-marquee-row aria-hidden="true">
        {row(true)}
      </div>
    </section>
  )
}

/*
 * Big words with highlighted phrases, then a pen line drawn out as it scrolls, and who says it. The
 * company's mission by default; pass `by={null}` to leave out the pen line and credit.
 */
export function AboutStatement({ label = statement.label, parts = statement.parts, by = statement.by }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const path = el.querySelector('[data-sign]')
    if (!path) return
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        path,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 55%', end: 'bottom 75%', scrub: true } },
      )
    })
    mm.add(REDUCED, () => gsap.set(path, { strokeDashoffset: 0 }))
    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className={styles.statement}>
      <p className={styles.label}>{label}</p>
      <blockquote className={styles.statementText}>
        {parts.map((part, i) => (typeof part === 'string' ? part : <Highlight key={i}>{part.hl}</Highlight>))}
      </blockquote>
      {by && (
      <div className={styles.signature}>
        <svg viewBox="0 0 420 120" fill="none" aria-hidden="true">
          <path
            data-sign
            pathLength="1"
            d="M12 84c30-46 58-66 74-58 18 9-26 66-10 70 20 5 46-74 66-70 16 3-8 58 6 60 14 2 30-40 46-44 14-3 4 36 18 38 22 3 52-34 80-30 26 4 18 26 48 22 24-3 50-14 70-26"
          />
        </svg>
        <p className={styles.mono}>— {by}</p>
      </div>
      )}
    </section>
  )
}

/* A landscape opening out from an oval to the full width as it scrolls in, with words over it. */
export function AboutOval() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true },
      })
      tl.fromTo(el.querySelector('[data-oval-mask]'), { clipPath: 'ellipse(26% 30% at 50% 50%)' }, { clipPath: 'ellipse(80% 90% at 50% 50%)' }, 0)
        .fromTo(el.querySelector('[data-oval-img]'), { scale: 1.3 }, { scale: 1 }, 0)
        .fromTo(el.querySelector('[data-oval-top]'), { xPercent: -30 }, { xPercent: 0 }, 0)
        .fromTo(el.querySelector('[data-oval-bottom]'), { xPercent: 30 }, { xPercent: 0 }, 0)
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className={styles.oval}>
      <div className={styles.ovalMask} data-oval-mask>
        <div className={styles.ovalImg} data-oval-img>
          <Image src={oval.image.src} alt={oval.image.alt} fill sizes="100vw" className={styles.cover} />
        </div>
      </div>
      <p className={`${styles.ovalWord} ${styles.ovalTop}`} data-oval-top>
        {oval.top}
      </p>
      <p className={`${styles.ovalWord} ${styles.ovalBottom}`} data-oval-bottom>
        {oval.bottom}
      </p>
    </section>
  )
}
