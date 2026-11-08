'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger, MOTION_OK } from './motion'
import Highlight from './Highlight'
import RollText, { ArrowDot } from './RollText'
import { values, gallery, socials } from '@/data/about'
import styles from './About.module.css'

/*
 * Big rows: the rule above each draws in on scroll, and the title rolls on hover. Shows the company
 * values by default; the partner page passes its own heading and items.
 */
export function AboutValues({
  id = 'values-title',
  label = '(What drives us)',
  titleBefore = 'Our ',
  titleHighlight = 'values',
  items = values,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray('[data-value-row]', el).forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%' } })
        tl.from(row.querySelector('[data-value-rule]'), { scaleX: 0, duration: 1.1, ease: 'expo.inOut' }).from(
          row.querySelectorAll('[data-value-rise]'),
          { yPercent: 60, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 },
          0.3,
        )
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className={styles.values} aria-labelledby={id}>
      <div className={styles.sectionHead}>
        <p className={styles.label}>{label}</p>
        <h2 id={id} className={styles.display}>
          {titleBefore}
          <Highlight>{titleHighlight}</Highlight>
        </h2>
      </div>
      <ul className={styles.valueList}>
        {items.map((value, i) => (
          <li key={value.title} className={styles.valueRow} data-value-row data-roll-host tabIndex={0}>
            <span className={styles.valueRule} data-value-rule aria-hidden="true" />
            <span className={styles.mono} data-value-rise>
              0{i + 1}
            </span>
            <h3 className={styles.valueTitle} data-value-rise>
              <RollText text={value.title} />
            </h3>
            <p className={styles.valueText} data-value-rise>
              {value.description}
            </p>
            <ArrowDot className={styles.valueArrow} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/* A grid of photos that open upwards in turn, in black and white until hovered. */
export function AboutGallery() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const tiles = gsap.utils.toArray('[data-tile]', el)
      gsap.set(tiles, { clipPath: 'inset(100% 0% 0% 0%)' })
      ScrollTrigger.batch(tiles, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', stagger: 0.1 }),
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className={styles.gallery} aria-labelledby="gallery-title">
      <div className={styles.galleryHead}>
        <div>
          <p className={styles.label}>(What&rsquo;s up)</p>
          <h2 id="gallery-title" className={styles.display}>
            On socials
          </h2>
        </div>
        <ul className={styles.socialList}>
          {socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noopener noreferrer" className={styles.pillLink}>
                <RollText text={social.label} />
                <ArrowDot />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.galleryGrid}>
        {gallery.map((image, i) => (
          <figure key={`${image.src}-${i}`} className={`${styles.tile} ${styles[`tile${i}`]}`} data-tile>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 50vw, 25vw" className={styles.cover} />
          </figure>
        ))}
      </div>
    </section>
  )
}
