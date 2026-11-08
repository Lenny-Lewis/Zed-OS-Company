'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, MOTION_OK, onIntroDone } from '@/components/about/motion'
import { productsHero, categories } from '@/data/products'
import about from '@/components/about/About.module.css'
import styles from './Products.module.css'

/*
 * Unpacking: the crate sits under the title with its lid shut. Scrolling (while pinned) opens the lid
 * and the six category photos fly out of it into a row along the bottom. Without JS, or with reduced
 * motion, the photos simply sit in the row.
 */
export default function ProductsHero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return
    const el = root.current
    gsap.set(el.querySelectorAll('[data-hero-char]'), { yPercent: 105 })
    gsap.set(el.querySelectorAll('[data-hero-fade]'), { autoAlpha: 0, y: 16 })
  }, [])

  useEffect(() => {
    const el = root.current
    const anchor = el.querySelector('[data-crate-anchor]')
    let stopIntroWatch = () => {}
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      const row = el.querySelector('[data-hero-row]')
      const cards = gsap.utils.toArray('[data-hero-card]', el)
      // From each card's place in the row to the crate's middle (layout offsets ignore transforms).
      const crateX = () => anchor.offsetLeft + anchor.offsetWidth / 2
      const crateY = () => anchor.offsetTop + anchor.offsetHeight * 0.55
      const dx = (i) => crateX() - (row.offsetLeft + cards[i].offsetLeft + cards[i].offsetWidth / 2)
      const dy = (i) => crateY() - (row.offsetTop + cards[i].offsetTop + cards[i].offsetHeight / 2)

      const lid = { open: 0 }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, pin: true, start: 'top top', end: '+=130%', scrub: true, invalidateOnRefresh: true },
      })
      tl.to(lid, {
        open: 1,
        duration: 0.3,
        ease: 'power2.out',
        onUpdate: () => {
          anchor.dataset.crateOpen = lid.open.toFixed(3)
        },
      })
        .from(cards, { x: dx, y: dy, scale: 0.12, rotation: (i) => (i - 2.5) * 9, autoAlpha: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, 0.18)
        .to(anchor, { scale: 0.62, y: () => -window.innerHeight * 0.06, duration: 0.6 }, 0.2)
        .to(el.querySelector('[data-hero-title]'), { yPercent: -14, opacity: 0.25, duration: 0.6 }, 0.2)
        .to(el.querySelectorAll('[data-hero-meta]'), { opacity: 0, y: -30, duration: 0.3 }, 0.1)

      stopIntroWatch = onIntroDone(() => {
        gsap
          .timeline({ delay: 0.15 })
          .to(el.querySelectorAll('[data-hero-char]'), { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045 })
          .to(el.querySelectorAll('[data-hero-fade]'), { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 0.4)
      })
    })

    return () => {
      stopIntroWatch()
      mm.revert()
    }
  }, [])

  return (
    <section ref={root} className={`${about.hero} ${styles.hero}`} aria-labelledby="products-title">
      <div className={about.heroStage}>
        <div className={about.heroTop}>
          <div data-hero-meta>
            <p className={about.mono} data-hero-fade>Zed OS Technologies Limited</p>
            <p className={about.mono} data-hero-fade>{productsHero.label}</p>
          </div>
          <div className={about.heroTopRight} data-hero-meta>
            <p className={about.mono} data-hero-fade>{productsHero.place}</p>
            <p className={about.mono} data-hero-fade>{categories.length} categories</p>
          </div>
        </div>

        <h1 id="products-title" className={`${about.heroTitle} ${styles.title}`} data-hero-title aria-label="Products">
          {Array.from(productsHero.title).map((char, i) => (
            <span key={i} className={about.heroCharMask} aria-hidden="true">
              <span className={about.heroChar} data-hero-char>
                {char}
              </span>
            </span>
          ))}
        </h1>

        <p className={styles.heroTagline} data-hero-meta>
          <span data-hero-fade>{productsHero.tagline}</span>
        </p>

        <div className={styles.heroCrate} data-crate-anchor="hero" data-crate-open="0" aria-hidden="true" />

        <div className={`${about.heroRow} ${styles.heroRow}`} data-hero-row>
          {categories.map((category) => (
            <figure key={category.id} className={`${about.heroCard} ${styles.heroCard}`} data-hero-card>
              <div className={about.heroCardInner}>
                <Image src={category.image.src} alt={category.image.alt} fill sizes="(max-width: 767px) 30vw, 15vw" className={about.cover} />
              </div>
              <figcaption className={styles.heroCaption}>{category.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
