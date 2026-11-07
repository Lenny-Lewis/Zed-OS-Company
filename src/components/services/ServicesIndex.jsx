'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import HoverTag from '@/components/ui/hover-tag'
import { useScramble } from '@/lib/use-scramble'
import { useServicesTransition } from './ServicesShell'
import WipeText from './WipeText'
import styles from './ServicesIndex.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable, InertiaPlugin)
}

const ACCENT = '#fd551d'
const GAP = 16
/** Slides are just under half the width on desktop, and most of it on a phone. */
const slideWidthFor = (width) => (width >= 1024 ? width * 0.4945 : width * 0.8)
/** The photo is wider than its slide, and slides sideways as the slide moves away from the centre. */
const PHOTO_SCALE = 1.2247
const PHOTO_DRIFT = 0.15

const VIEWS = [
  {
    mode: 'slider',
    label: 'Slider view',
    show: 'all',
    icon: (
      <>
        <rect x="1" y="4" width="6" height="8" />
        <rect x="9" y="4" width="6" height="8" />
      </>
    ),
  },
  {
    mode: 'duo',
    label: 'Two column view',
    show: 'wide',
    icon: (
      <>
        <rect x="1" y="1" width="6" height="14" />
        <rect x="9" y="1" width="6" height="14" />
      </>
    ),
  },
  {
    mode: 'grid',
    label: 'Grid view',
    show: 'all',
    icon: [1, 6, 11].flatMap((y) => [1, 6, 11].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" />)),
  },
  {
    mode: 'list',
    label: 'List view',
    show: 'narrow',
    icon: (
      <>
        <rect x="1" y="2" width="14" height="5" />
        <rect x="1" y="9" width="14" height="5" />
      </>
    ),
  },
]

function Tags({ tags }) {
  return (
    <span className={styles.tags}>
      {tags.map((tag, index) => (
        <span key={tag} className={styles.tagGroup}>
          {index > 0 && <span className={styles.dash}>&mdash;</span>}
          <span className={styles.tag}>[ {tag} ]</span>
        </span>
      ))}
    </span>
  )
}

function Caption({ service, register }) {
  const { ref, run } = useScramble(service.title, ACCENT)
  useEffect(() => register?.(run), [register, run])
  return (
    <div className={styles.caption}>
      <h3 className={styles.title} aria-label={service.title}>
        <span className={styles.titleGhost} aria-hidden="true">
          {service.title}
        </span>
        <span ref={ref} className={styles.titleLive} aria-hidden="true">
          {service.title}
        </span>
      </h3>
      <Tags tags={service.tags} />
    </div>
  )
}

/** A link that plays the orange cover before leaving, unless it's opened in a new tab. */
function ServiceLink({ service, className, children, onBeforeOpen, ...rest }) {
  const { navigate } = useServicesTransition()
  const href = `/services/${service.slug}`
  return (
    <a
      href={href}
      className={className}
      data-hover-tag="View service"
      onClick={(event) => {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        if (onBeforeOpen && onBeforeOpen() === false) return
        navigate(href)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

function Slider({ items, apiRef, onActiveChange }) {
  const wrapRef = useRef(null)
  const proxyRef = useRef(null)
  const slideRefs = useRef([])
  const photoRefs = useRef([])
  const scrambles = useRef([])
  const moved = useRef(false)
  const lastActive = useRef(-1)
  const [width, setWidth] = useState(0)

  const count = items.length
  const slideWidth = slideWidthFor(width)
  const step = slideWidth + GAP
  // Enough copies that the loop never shows a gap at either edge.
  const copies = width && count ? Math.max(1, Math.ceil((width + step * 2) / (count * step))) : 1
  const total = count * copies * step

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const measure = () => setWidth(wrap.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  const layout = useCallback(() => {
    if (!width || !count) return
    const offset = gsap.getProperty(proxyRef.current, 'x')
    const wrapX = gsap.utils.wrap(-step, total - step)
    const centre = (width - slideWidth) / 2
    const extra = (slideWidth * PHOTO_SCALE - slideWidth) / 2
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return
      const x = wrapX(index * step + offset) + centre
      slide.style.transform = `translate3d(${x}px,0,0)`
      const distance = x + slideWidth / 2 - width / 2
      const drift = Math.max(-extra, Math.min(extra, -distance * PHOTO_DRIFT))
      const photo = photoRefs.current[index]
      if (photo) photo.style.transform = `translate3d(${drift}px,0,0)`
    })
    const active = (((Math.round(-offset / step) % count) + count) % count)
    if (active !== lastActive.current) {
      lastActive.current = active
      onActiveChange(active)
      scrambles.current.forEach((run, index) => {
        if (index % count === active) run?.()
      })
    }
  }, [width, count, step, total, slideWidth, onActiveChange])

  useLayoutEffect(() => {
    if (!width) return
    // Keeps the same slide in the middle when the width changes.
    const keep = Math.max(0, lastActive.current)
    gsap.set(proxyRef.current, { x: -keep * step })
    lastActive.current = -1
    layout()
  }, [width, step, layout])

  useEffect(() => {
    if (!width || !count) return
    const proxy = proxyRef.current
    const [draggable] = Draggable.create(proxy, {
      type: 'x',
      trigger: wrapRef.current,
      inertia: true,
      dragClickables: true,
      allowContextMenu: true,
      snap: { x: (value) => Math.round(value / step) * step },
      onPress() {
        gsap.killTweensOf(proxy)
        moved.current = false
      },
      onDrag() {
        moved.current = true
        layout()
      },
      onThrowUpdate: layout,
    })

    const goTo = (index) => {
      const current = Math.round(-gsap.getProperty(proxy, 'x') / step)
      let delta = (((index - current) % count) + count) % count
      if (delta > count / 2) delta -= count
      gsap.killTweensOf(proxy)
      gsap.to(proxy, {
        x: -(current + delta) * step,
        duration: 0.8,
        ease: 'power3.inOut',
        onUpdate: layout,
        onComplete: () => draggable.update(),
      })
    }
    apiRef.current = {
      goTo,
      next: () => goTo(lastActive.current + 1),
      prev: () => goTo(lastActive.current - 1),
    }
    return () => {
      draggable.kill()
      gsap.killTweensOf(proxy)
      apiRef.current = null
    }
  }, [width, count, step, layout, apiRef])

  const slides = width ? Array.from({ length: count * copies }, (_, index) => items[index % count]) : []

  return (
    <div
      ref={wrapRef}
      className={styles.slider}
      onClickCapture={(event) => {
        // A drag that ends over a slide isn't a click on it.
        if (!moved.current) return
        event.preventDefault()
        event.stopPropagation()
        moved.current = false
      }}
    >
      <div ref={proxyRef} className={styles.proxy} />
      {/* Sets the slider's height before the slides are measured. */}
      <div className={styles.sizer} style={{ width: slideWidth || '80%' }}>
        <div className={styles.sizerPhoto} />
        <div className={styles.sizerCaption} />
      </div>
      {slides.map((service, index) => (
        <div
          key={`${service.slug}-${index}`}
          ref={(el) => {
            slideRefs.current[index] = el
          }}
          className={styles.slide}
          style={{ width: slideWidth }}
          aria-hidden={index >= count ? 'true' : undefined}
        >
          <ServiceLink
            service={service}
            className={styles.slideLink}
            tabIndex={index >= count ? -1 : undefined}
            aria-label={`${service.title}: view service`}
            draggable={false}
            onMouseEnter={() => scrambles.current[index]?.()}
          >
            <span
              ref={(el) => {
                photoRefs.current[index] = el
              }}
              className={styles.slidePhoto}
              style={{ width: `${PHOTO_SCALE * 100}%`, left: `${(-(PHOTO_SCALE - 1) / 2) * 100}%` }}
            >
              <Image
                src={service.photos.hero}
                alt=""
                fill
                draggable={false}
                quality={85}
                className={styles.cover}
                sizes="(min-width: 1024px) 61vw, 98vw"
                priority={index === 0}
              />
            </span>
          </ServiceLink>
          <Caption
            service={service}
            register={(run) => {
              scrambles.current[index] = run
            }}
          />
        </div>
      ))}
    </div>
  )
}

function Thumbs({ items, active, flips, onSelect }) {
  return (
    <div className={styles.thumbs} style={{ '--index': active, '--flips': flips }}>
      <div className={styles.thumbRow}>
        <span className={styles.thumbFrame} aria-hidden="true" />
        {items.map((service, index) => (
          <button
            key={service.slug}
            type="button"
            className={`${styles.thumb} ${index === active ? styles.thumbActive : ''}`}
            aria-label={`Go to ${service.title}`}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => onSelect(index)}
          >
            <Image src={service.photos.hero} alt="" fill className={styles.cover} sizes="80px" />
          </button>
        ))}
      </div>
      <div className={styles.markerTrack} style={{ width: items.length * 96 - GAP }}>
        <span className={styles.marker} aria-hidden="true" />
      </div>
    </div>
  )
}

function Filter({ tags, value, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (event) => {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      if (event.type === 'pointerdown' && rootRef.current?.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div ref={rootRef} className={styles.filter}>
      <button type="button" className={styles.filterButton} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className={styles.filterLabel}>Filter</span>
        <span className={styles.filterChevron} aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : undefined }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </button>
      {open && (
        <ul className={styles.filterMenu}>
          {['All', ...tags].map((tag) => (
            <li key={tag}>
              <button
                type="button"
                className={`${styles.filterOption} ${tag === value ? styles.filterOptionActive : ''}`}
                aria-pressed={tag === value}
                onClick={() => {
                  onChange(tag)
                  setOpen(false)
                }}
              >
                [ {tag} ]
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Cards({ items, view }) {
  return (
    <div className={`${styles.container} ${styles.cards} ${styles[`cards_${view}`]}`}>
      {items.map((service) => (
        <article key={service.slug}>
          <ServiceLink service={service} className={styles.card} aria-label={`${service.title}: view service`}>
            <span className={styles.cardZoom}>
              <Image
                src={service.photos.hero}
                alt=""
                fill
                className={styles.cover}
                sizes={view === 'grid' ? '(min-width: 768px) 33vw, 100vw' : '(min-width: 768px) 50vw, 100vw'}
              />
            </span>
          </ServiceLink>
          <Caption service={service} />
        </article>
      ))}
    </div>
  )
}

export default function ServicesIndex({ services, tags, heading, stats }) {
  const rootRef = useRef(null)
  const sliderApi = useRef(null)
  const [view, setView] = useState('slider')
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(0)
  const [flips, setFlips] = useState(0)

  const items = filter === 'All' ? services : services.filter((service) => service.tags.includes(filter))

  // The marker turns a quarter each time the active service changes.
  const activeRef = useRef(0)
  const onActiveChange = useCallback((index) => {
    if (activeRef.current === index) return
    activeRef.current = index
    setActive(index)
    setFlips((count) => count + 1)
  }, [])

  return (
    <div ref={rootRef} className={styles.page} data-header-tone="light">
      <section className={styles.intro}>
        <div className={styles.container}>
          <WipeText as="h1" text={heading} trigger="enter" className={styles.heading} />
          <p className={styles.stats}>
            {stats.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>
      </section>

      <section className={styles.works} aria-label="Services">
        <div className={`${styles.container} ${styles.controls}`}>
          <Filter
            tags={tags}
            value={filter}
            onChange={(tag) => {
              setFilter(tag)
              activeRef.current = 0
              setActive(0)
            }}
          />
          {view === 'slider' && (
            <Thumbs items={items} active={active} flips={flips} onSelect={(index) => sliderApi.current?.goTo(index)} />
          )}
          <div className={styles.controlsRight}>
            <div className={styles.views} role="group" aria-label="Layout">
              {VIEWS.map((option) => (
                <button
                  key={option.mode}
                  type="button"
                  className={`${styles.square} ${styles[`show_${option.show}`]} ${view === option.mode ? styles.squareActive : ''}`}
                  aria-label={option.label}
                  aria-pressed={view === option.mode}
                  onClick={() => setView(option.mode)}
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    {option.icon}
                  </svg>
                </button>
              ))}
            </div>
            {view === 'slider' && (
              <div className={styles.arrows}>
                <button type="button" className={styles.square} aria-label="Previous slide" onClick={() => sliderApi.current?.prev()}>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                <button type="button" className={styles.square} aria-label="Next slide" onClick={() => sliderApi.current?.next()}>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div key={`${view}-${filter}`} className={styles.view}>
          {items.length === 0 ? (
            <p className={`${styles.container} ${styles.empty}`}>Nothing in this category yet.</p>
          ) : view === 'slider' ? (
            <Slider items={items} apiRef={sliderApi} onActiveChange={onActiveChange} />
          ) : (
            <Cards items={items} view={view} />
          )}
        </div>
      </section>

      <HoverTag rootRef={rootRef} />
    </div>
  )
}
