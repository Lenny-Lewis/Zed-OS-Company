'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { images } from '@/data/images'
import { useScramble } from '@/lib/use-scramble'
import HoverTag from '@/components/ui/hover-tag'
import styles from './HomeServices.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const ACCENT = '#fd551d'
const HEADING_LINES = ['Our services.']
const VIEW_ALL = 'View all services'

const services = [
  { title: 'General Supplies', tags: ['Procurement', 'Offices & Institutions'], image: images.servicesWide.supplies },
  { title: 'Vehicle Hire', tags: ['Fleet', 'Corporate & Field'], image: images.servicesWide.vehicle },
  { title: 'Software Systems', tags: ['Custom Build', 'Operations'], image: images.servicesWide.software },
  { title: 'AI & ML', tags: ['Automation', 'Analysis'], image: images.servicesWide.ai },
]

function ViewAll({ className = '' }) {
  const { ref, run } = useScramble(VIEW_ALL)
  const arrow = (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
  return (
    <Link href="/services" className={`${styles.cta} ${className}`} aria-label={VIEW_ALL} onMouseEnter={run} onFocus={run}>
      <span className={`${styles.ctaIcon} ${styles.ctaIconIn}`}>{arrow}</span>
      <span className={styles.ctaLabel}>
        {/* Reserves the width, so the button doesn't change size while the characters do. */}
        <span className={styles.ctaGhost} aria-hidden="true">
          {VIEW_ALL}
        </span>
        <span ref={ref} className={styles.ctaLive} aria-hidden="true">
          {VIEW_ALL}
        </span>
      </span>
      <span className={`${styles.ctaIcon} ${styles.ctaIconOut}`}>{arrow}</span>
    </Link>
  )
}

function ServiceItem({ service, index, itemRef, scramblesRef }) {
  const { ref: titleRef, run } = useScramble(service.title, ACCENT)
  const captionRef = useRef(null)

  // Lets the thumbnails scramble this title too.
  useEffect(() => {
    const scrambles = scramblesRef.current
    scrambles[index] = run
    return () => {
      scrambles[index] = null
    }
  }, [scramblesRef, index, run])

  // Scrambles in the first time the caption comes on screen.
  useEffect(() => {
    const caption = captionRef.current
    if (!caption) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        run()
      },
      { rootMargin: '0px 0px -5% 0px' },
    )
    io.observe(caption)
    return () => io.disconnect()
  }, [run])

  return (
    <article ref={itemRef} className={styles.item}>
      <Link
        href="/services"
        className={styles.frame}
        aria-label={`${service.title}: view our services`}
        data-hover-tag="View service"
        onMouseEnter={run}
      >
        <span className={styles.parallax} data-parallax>
          <span className={styles.zoom}>
            <Image
              src={service.image}
              alt=""
              fill
              className={styles.photo}
              sizes="(min-width: 1024px) 85vw, 100vw"
            />
          </span>
        </span>
      </Link>
      <div ref={captionRef} className={styles.caption} data-caption>
        <h3 className={styles.title} aria-label={service.title}>
          {/* Reserves the width, so nothing shifts while the characters change. */}
          <span className={styles.titleGhost} aria-hidden="true">
            {service.title}
          </span>
          <span ref={titleRef} className={styles.titleLive} aria-hidden="true">
            {service.title}
          </span>
        </h3>
        <p className={styles.tags}>
          <span>[{service.tags[0]}]</span>
          <span aria-hidden="true">&mdash;</span>
          <span>[{service.tags[1]}]</span>
        </p>
      </div>
    </article>
  )
}

export default function HomeServices() {
  const rootRef = useRef(null)
  const headingRef = useRef(null)
  const itemRefs = useRef([])
  const scrambleRefs = useRef([])
  const activeRef = useRef(0)
  const scrollLock = useRef(null) // Stops the tween and restores scroll tracking, while a click is scrolling.
  const [active, setActive] = useState(0)
  const [flips, setFlips] = useState(0)

  const syncActive = () => {
    const middle = window.innerHeight / 2
    const index = itemRefs.current.findIndex((item) => {
      if (!item) return false
      const { top, bottom } = item.getBoundingClientRect()
      return top <= middle && bottom > middle
    })
    if (index === -1) return
    activeRef.current = index
    setActive(index)
  }

  // The active service is whichever one crosses the middle of the screen, unless a click is taking
  // the visitor to a particular one. Then the marker goes straight there, not through the others.
  useEffect(() => {
    const items = itemRefs.current.filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        if (scrollLock.current) return
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          activeRef.current = items.indexOf(entry.target)
          setActive(activeRef.current)
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    items.forEach((item) => io.observe(item))
    return () => {
      io.disconnect()
      scrollLock.current?.()
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const heading = headingRef.current
    if (!root || !heading) return

    const mm = gsap.matchMedia(root)

    // Each photo is larger than its frame and slides through it as the frame crosses the screen.
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
      root.querySelectorAll('[data-parallax]').forEach((layer) => {
        gsap.fromTo(
          layer,
          { yPercent: -15, scale: 1.3 },
          {
            yPercent: 15,
            scale: 1.3,
            ease: 'none',
            scrollTrigger: { trigger: layer.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        )
      })
    })

    // Two blocks wipe across each heading line. The text switches on while they cover it.
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
      })
      heading.querySelectorAll('[data-line]').forEach((line, index) => {
        const text = line.querySelector('[data-line-text]')
        const accent = line.querySelector('[data-wipe="accent"]')
        const cover = line.querySelector('[data-wipe="cover"]')
        const at = index * 0.12
        const grow = { scaleX: 1, duration: 0.38, ease: 'power3.inOut' }
        gsap.set(text, { opacity: 0 })
        gsap.set([accent, cover], { scaleX: 0, transformOrigin: 'left center' })
        timeline
          .to(accent, grow, at)
          .to(cover, grow, at + 0.1)
          .set(text, { opacity: 1 }, at + 0.48)
          .set(accent, { opacity: 0 }, at + 0.48)
          .set(cover, { transformOrigin: 'right center' }, at + 0.48)
          .to(cover, { scaleX: 0, duration: 0.38, ease: 'power3.inOut' }, at + 0.48)
      })
    })

    // Sections above this one change height as they load, which moves these scroll positions.
    let lastHeight = document.body.offsetHeight
    let timer = 0
    const ro = new ResizeObserver(() => {
      if (document.body.offsetHeight === lastHeight) return
      lastHeight = document.body.offsetHeight
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    ro.observe(document.body)

    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
      mm.revert()
    }
  }, [])

  const showService = (index) => {
    const item = itemRefs.current[index]
    if (!item || index === activeRef.current) return

    scrollLock.current?.()
    activeRef.current = index
    setActive(index)
    setFlips((count) => count + 1) // The marker only turns on a click, never while scrolling.

    // Centres the photo and its caption, not the empty space below them.
    const { top } = item.getBoundingClientRect()
    const { bottom } = item.querySelector('[data-caption]').getBoundingClientRect()
    const target = window.scrollY + top - window.innerHeight / 2 + (bottom - top) / 2

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: target, behavior: 'instant' })
      return
    }

    const position = { y: window.scrollY }
    const release = () => {
      tween.kill()
      window.removeEventListener('wheel', interrupted)
      window.removeEventListener('touchstart', interrupted)
      scrollLock.current = null
    }
    // Scrolling by hand takes over straight away, and the marker catches up with wherever that lands.
    const interrupted = () => {
      release()
      syncActive()
    }
    const tween = gsap.to(position, {
      y: target,
      duration: 0.8,
      ease: 'power2.out',
      // "instant" because the site sets smooth scrolling on html, which would fight every step.
      onUpdate: () => window.scrollTo({ top: position.y, behavior: 'instant' }),
      onComplete: release,
    })
    window.addEventListener('wheel', interrupted, { passive: true })
    window.addEventListener('touchstart', interrupted, { passive: true })
    scrollLock.current = release
  }

  return (
    <section ref={rootRef} className={styles.section} aria-labelledby="home-services-heading">
      <div className={styles.layout}>
        <div className={styles.column}>
          <div className={styles.rail}>
            <div>
              <h2 ref={headingRef} id="home-services-heading" className={`font-display ${styles.heading}`}>
                {HEADING_LINES.map((line) => (
                  <span key={line} className={styles.line} data-line>
                    <span data-line-text>{line}</span>
                    <span className={`${styles.wipe} ${styles.wipeAccent}`} data-wipe="accent" aria-hidden="true" />
                    <span className={`${styles.wipe} ${styles.wipeCover}`} data-wipe="cover" aria-hidden="true" />
                  </span>
                ))}
              </h2>
              <p className={styles.intro}>
                End-to-end solutions tailored to supply, operations, and digital transformation needs.
              </p>
            </div>

            <nav className={styles.thumbs} aria-label="Featured services">
              {services.map((service, index) => (
                <button
                  key={service.title}
                  type="button"
                  className={`${styles.thumb} ${index === active ? styles.thumbActive : ''}`}
                  aria-label={`Show ${service.title}`}
                  aria-current={index === active ? 'true' : undefined}
                  onClick={() => showService(index)}
                  onMouseEnter={() => scrambleRefs.current[index]?.()}
                >
                  <span className={styles.thumbImage}>
                    <Image src={service.image} alt="" fill className={styles.photo} sizes="128px" />
                  </span>
                </button>
              ))}
              <span
                className={styles.marker}
                style={{ '--index': active, '--flips': flips }}
                aria-hidden="true"
                data-marker
              />
            </nav>

            <ViewAll className={styles.ctaWide} />
          </div>
        </div>

        <div className={styles.list}>
          {services.map((service, index) => (
            <ServiceItem
              key={service.title}
              service={service}
              index={index}
              itemRef={(el) => {
                itemRefs.current[index] = el
              }}
              scramblesRef={scrambleRefs}
            />
          ))}
          <ViewAll className={styles.ctaNarrow} />
        </div>
      </div>

      <HoverTag rootRef={rootRef} />
    </section>
  )
}
