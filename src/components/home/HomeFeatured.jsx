'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger, MOTION_OK } from '@/components/about/motion'
import { AnimatedButton, AnimatedHeadline, scramble, whenInView } from './primitives'
import { featured } from '@/data/home'
import { services as allServices } from '@/data/services'
import styles from './home.module.css'
import s from './sections.module.css'

const FLIP_EASE = [0.68, -0.3, 0.32, 1.1]
// The four featured services, in the order data/home.js gives.
const services = featured.slugs.map((slug) => allServices.find((service) => service.slug === slug)).filter(Boolean)

/*
 * The services, laid out like good-fella.com's "Selected work". On wide screens a sticky column on
 * the left holds the heading, a strip of thumbnails and "View all"; the photos scroll by on the
 * right, drifting inside their frames. The thumbnail for the photo in view is lit, with the orange
 * square beside it (turning a quarter each time you jump); clicking a thumbnail scrolls to its photo.
 * Photos show a "View service" cursor tag and zoom in slightly on hover.
 */
export default function HomeFeatured() {
  const [active, setActive] = useState(0)
  const [turns, setTurns] = useState(0)
  const items = useRef([])
  const parallax = useRef([])
  const titles = useRef([])
  const jumping = useRef(false)
  const activeRef = useRef(0)

  // Each service's name scrambles in as it scrolls into view, and again on hover.
  const scrambleTitle = (i) => scramble(titles.current[i], services[i].title)
  useEffect(() => {
    const stops = titles.current.map((el, i) => (el ? whenInView(el, () => scramble(el, services[i].title), 'top 95%') : null))
    return () => stops.forEach((stop) => stop?.())
  }, [])

  // The photo at least half in the middle band of the screen is the active one.
  useEffect(() => {
    const observers = items.current.filter(Boolean).map((el, i) => {
      const io = new IntersectionObserver(
        (entries) => {
          if (jumping.current) return
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && activeRef.current !== i) {
              activeRef.current = i
              setActive(i)
            }
          }
        },
        { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' },
      )
      io.observe(el)
      return io
    })
    return () => observers.forEach((io) => io.disconnect())
  }, [])

  // Each photo starts enlarged and drifts from -15% to 15% as its frame crosses the screen.
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
      for (const el of parallax.current.filter(Boolean)) {
        gsap.set(el, { scale: 1.3 })
        gsap.fromTo(
          el,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          },
        )
      }
    })
    return () => mm.revert()
  }, [])

  const jump = (i) => {
    const el = items.current[i]
    if (!el || activeRef.current === i) return
    jumping.current = true
    setTurns((n) => n + 1)
    activeRef.current = i
    setActive(i)
    const box = el.getBoundingClientRect()
    window.scrollTo({ top: window.scrollY + box.top - window.innerHeight / 2 + box.height / 2, behavior: 'smooth' })
    window.setTimeout(() => {
      jumping.current = false
      ScrollTrigger.update()
    }, 900)
  }

  const head = (gap) => (
    <div>
      <AnimatedHeadline text={featured.title} className={`${styles.h2} ${gap}`} />
      <p className={`${styles.body} ${styles.muted} ${s.preLine}`}>{featured.text}</p>
    </div>
  )

  return (
    <section className={`${styles.dark} ${styles.flush}`} aria-label={featured.title}>
      {/* Wide screens */}
      <div className={s.workWide}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={s.workSide}>
              <div className={s.workSticky}>
                {head(s.mb24)}
                <nav className={s.workNav} aria-label="Services">
                  {services.map((service, i) => (
                    <button
                      key={service.slug}
                      type="button"
                      className={s.workThumbButton}
                      aria-label={`Go to ${service.title}`}
                      aria-current={i === active ? 'true' : undefined}
                      onClick={() => jump(i)}
                      onMouseEnter={() => scrambleTitle(i)}
                    >
                      <span className={s.workThumb} data-active={i === active || undefined}>
                        <Image src={service.photos.hero} alt="" fill sizes="128px" className={styles.cover} />
                      </span>
                      {i === active && (
                        <motion.span
                          layoutId="featured-indicator"
                          className={s.workIndicator}
                          animate={{ rotate: 90 * turns }}
                          transition={{ layout: { duration: 0.8, ease: FLIP_EASE }, rotate: { duration: 0.8, ease: FLIP_EASE } }}
                        />
                      )}
                    </button>
                  ))}
                </nav>
                <div>
                  <AnimatedButton href={featured.viewAll.href} theme="brand" size="sm">
                    {featured.viewAll.label}
                  </AnimatedButton>
                </div>
              </div>
            </div>
            <div className={s.workList}>
              {services.map((service, i) => (
                <div
                  key={service.slug}
                  ref={(el) => {
                    items.current[i] = el
                  }}
                  className={s.workItem}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className={s.workMedia}
                    data-cursor-text={featured.cursor}
                    onMouseEnter={() => scrambleTitle(i)}
                    aria-label={service.title}
                  >
                    <div
                      ref={(el) => {
                        parallax.current[i] = el
                      }}
                      className={s.workParallax}
                    >
                      <Image
                        src={service.photos.hero}
                        alt=""
                        fill
                        sizes="66vw"
                        className={`${styles.cover} ${s.zoomIn}`}
                      />
                    </div>
                  </Link>
                  <div className={s.workCaption}>
                    <h3
                      ref={(el) => {
                        titles.current[i] = el
                      }}
                      className={styles.accentLg}
                    >
                      {service.title}
                    </h3>
                    <div className={`${s.workTags} ${styles.body} ${styles.muted}`}>
                      {service.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Narrow screens */}
      <div className={`${styles.container} ${s.workNarrow}`}>
        <div className={s.mb32}>{head(s.mb16)}</div>
        <div className={s.workCards}>
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className={s.workCard}>
              <span className={s.workCardMedia}>
                <Image src={service.photos.hero} alt="" fill sizes="100vw" className={`${styles.cover} ${s.workCardImg}`} />
              </span>
              <span className={s.workCardText}>
                <span className={styles.h5}>{service.title}</span>
                <span className={`${styles.accentSm} ${styles.upper} ${styles.muted}`}>{service.tags.join(' · ')}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className={s.mt32}>
          <AnimatedButton href={featured.viewAll.href} theme="brand" size="sm">
            {featured.viewAll.label}
          </AnimatedButton>
        </div>
      </div>
    </section>
  )
}
