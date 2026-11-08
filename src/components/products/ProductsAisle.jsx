'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, MOTION_OK, REDUCED } from '@/components/about/motion'
import Highlight from '@/components/about/Highlight'
import RollText, { ArrowDot } from '@/components/about/RollText'
import { categories } from '@/data/products'
import { useQuote } from './QuoteContext'
import about from '@/components/about/About.module.css'
import styles from './Products.module.css'

const DESKTOP = `(min-width: 768px) and ${MOTION_OK}`
const MOBILE = `(max-width: 767px) and ${MOTION_OK}`

/*
 * The catalogue as an aisle. On wider screens it pins: a rail on the left holds the crate, the aisle
 * number and the quote, while the categories slide past on the right. The crate's lid opens further
 * with each category. On phones the categories stack, with the crate kept in the top corner.
 */
export default function ProductsAisle() {
  const ref = useRef(null)
  const { ids, has, toggle, setOpen } = useQuote()

  useEffect(() => {
    const el = ref.current
    const q = (selector) => gsap.utils.toArray(selector, el)
    const anchors = q('[data-crate-anchor]')
    const counter = el.querySelector('[data-aisle-counter]')
    const total = categories.length
    const setProgress = (progress) => {
      const open = (0.55 + 0.45 * progress).toFixed(3)
      anchors.forEach((anchor) => {
        anchor.dataset.crateOpen = open
      })
      counter.textContent = `${String(Math.min(total, 1 + Math.floor(progress * total))).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
    }
    const mm = gsap.matchMedia()

    mm.add(DESKTOP, () => {
      const pin = el.querySelector('[data-aisle-pin]')
      const viewport = el.querySelector('[data-aisle-viewport]')
      const track = el.querySelector('[data-aisle-track]')
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)

      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      })
      const along = (trigger, extra) => ({ trigger, containerAnimation: slide, ...extra })
      q('[data-oval]').forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: 'ellipse(34% 42% at 50% 50%)' },
          { clipPath: 'ellipse(75% 75% at 50% 50%)', ease: 'none', scrollTrigger: along(frame, { start: 'left right', end: 'center 70%', scrub: true }) },
        )
      })
      q('[data-drift]').forEach((img) => {
        gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: along(img.parentElement, { start: 'left right', end: 'right left', scrub: true }) })
      })
      q('[data-aisle-tags]').forEach((tags) => {
        gsap.from(tags.children, { y: 20, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.04, scrollTrigger: along(tags, { start: 'left 85%' }) })
      })
    })

    mm.add(MOBILE, () => {
      setProgress(0)
      q('[data-aisle-panel]').forEach((panel, i) => {
        gsap.from(panel.querySelectorAll('[data-aisle-tags] > *'), {
          y: 16,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.03,
          scrollTrigger: {
            trigger: panel,
            start: 'top 80%',
            onEnter: () => setProgress(i / (categories.length - 1)),
            onEnterBack: () => setProgress(i / (categories.length - 1)),
          },
        })
      })
    })

    mm.add(REDUCED, () => setProgress(1))
    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className={styles.aisle} aria-labelledby="aisle-title">
      <div className={styles.aislePin} data-aisle-pin>
        {/* Phones: the crate keeps to the top corner while the categories scroll past. */}
        <div className={styles.aisleCrateSticky} data-crate-anchor="aisle" data-crate-open="0.55" aria-hidden="true" />
        <aside className={styles.rail}>
          <p className={about.label}>(Catalogue)</p>
          <h2 id="aisle-title" className={`${about.display} ${styles.railTitle}`}>
            The <Highlight>aisle</Highlight>
          </h2>
          <p className={styles.counter} data-aisle-counter aria-hidden="true">
            01 / {String(categories.length).padStart(2, '0')}
          </p>
          <div className={styles.railCrate} data-crate-anchor="aisle" data-crate-open="0.55" aria-hidden="true" />
          <button type="button" className={`${about.pillLink} ${styles.railQuote}`} onClick={() => setOpen(true)}>
            <RollText text={ids.length ? `Your quote · ${ids.length}` : 'Start a quote'} />
            <ArrowDot />
          </button>
        </aside>

        <div className={styles.aisleViewport} data-aisle-viewport>
          <div className={styles.aisleTrack} data-aisle-track>
            {categories.map((category, i) => {
              const added = has(category.id)
              return (
                <article key={category.id} className={styles.panel} data-aisle-panel aria-labelledby={`cat-${category.id}`}>
                  <figure className={styles.panelFrame} data-oval>
                    <div className={about.drift} data-drift>
                      <Image src={category.image.src} alt={category.image.alt} fill sizes="(max-width: 767px) 100vw, 34vw" className={about.cover} />
                    </div>
                    <span className={styles.panelIndex} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </figure>
                  <div className={styles.panelBody}>
                    <h3 id={`cat-${category.id}`} className={styles.panelTitle}>
                      {category.title}
                    </h3>
                    <p className={styles.panelText}>{category.description}</p>
                    <ul className={styles.tags} data-aisle-tags aria-label={`${category.title} include`}>
                      {category.items.map((item) => (
                        <li key={item} className={styles.tag}>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={`${about.pillLink} ${styles.addButton}`}
                      data-added={added || undefined}
                      aria-pressed={added}
                      onClick={() => toggle(category.id)}
                    >
                      <RollText text={added ? 'In your quote ✓' : 'Add to quote'} />
                      <ArrowDot />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
