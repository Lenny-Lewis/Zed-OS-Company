'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, MOTION_OK, onIntroDone } from './motion'
import { heroImages } from '@/data/about'
import { ZedOrbitMark } from '@/components/ui/zed-orbit-mark'
import styles from './About.module.css'

const TITLE = 'ABOUT'
// Tilt of each card while stacked in the deck.
const TILT = [-9, 6, 0, -5, 10]

/*
 * The photos start as a stacked deck under the title and deal out into a row along the bottom as you
 * scroll, while the section is pinned. Without JS (or with reduced motion) they simply sit in the row.
 */
export default function AboutHero() {
  const root = useRef(null)

  // Hide the entrance pieces before the first paint, so they don't flash before the intro plays.
  useLayoutEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return
    const el = root.current
    gsap.set(el.querySelectorAll('[data-hero-char]'), { yPercent: 105 })
    gsap.set(el.querySelectorAll('[data-hero-card-inner]'), { yPercent: 30, scale: 0.6, autoAlpha: 0 })
    gsap.set(el.querySelectorAll('[data-hero-fade]'), { autoAlpha: 0, y: 16 })
  }, [])

  useEffect(() => {
    const el = root.current
    let stopIntroWatch = () => {}
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      const stage = el.querySelector('[data-hero-stage]')
      const row = el.querySelector('[data-hero-row]')
      const cards = gsap.utils.toArray('[data-hero-card]', el)

      // Offset from a card's place in the row to the deck point. Layout offsets ignore transforms,
      // so this holds however far the scroll animation has got.
      const deckX = () => stage.clientWidth / 2
      // Below the title and tagline, so the deck doesn't cover them.
      const deckY = () => stage.clientHeight * 0.8
      const dx = (i) => deckX() - (row.offsetLeft + cards[i].offsetLeft + cards[i].offsetWidth / 2)
      const dy = (i) => deckY() - (row.offsetTop + cards[i].offsetTop + cards[i].offsetHeight / 2)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          pin: true,
          start: 'top top',
          end: '+=110%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      tl.from(cards, { x: dx, y: dy, rotation: (i) => TILT[i] ?? 0, scale: 0.72, stagger: 0.04 }, 0)
        .to(el.querySelector('[data-hero-title]'), { yPercent: -18, scale: 0.86, opacity: 0.22 }, 0)
        .to(el.querySelectorAll('[data-hero-meta]'), { y: -40, opacity: 0 }, 0)
        // The glass emblem follows this box, so it shrinks and rises out of the way as the deck deals.
        .to(el.querySelector('[data-orbit-anchor]'), { scale: 0.45, y: () => -window.innerHeight * 0.16 }, 0)

      stopIntroWatch = onIntroDone(() => {
        gsap
          .timeline({ delay: 0.15 })
          .to(el.querySelectorAll('[data-hero-char]'), { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06 })
          .to(
            el.querySelectorAll('[data-hero-card-inner]'),
            { yPercent: 0, scale: 1, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: { each: 0.08, from: 'center' } },
            0.25,
          )
          .to(el.querySelectorAll('[data-hero-fade]'), { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 0.5)
      })
    })

    return () => {
      stopIntroWatch()
      mm.revert()
    }
  }, [])

  return (
    <section ref={root} className={styles.hero} aria-labelledby="about-title">
      <div className={styles.heroStage} data-hero-stage>
        <div className={styles.heroTop}>
          <div data-hero-meta>
            <p className={styles.mono} data-hero-fade>Zed OS Technologies Limited</p>
            <p className={styles.mono} data-hero-fade>Est. 2024</p>
          </div>
          <div className={styles.heroTopRight} data-hero-meta>
            <p className={styles.mono} data-hero-fade>Kisumu, Kenya</p>
            <p className={styles.mono} data-hero-fade>Supplies · Hire · Technology</p>
          </div>
        </div>

        {/* Where the 3D emblem sits, behind the title. Shows the flat mark if 3D can't run. */}
        <div className={styles.heroOrbit} data-orbit-anchor="hero" aria-hidden="true">
          <ZedOrbitMark className={styles.orbitFallback} />
        </div>

        <h1 id="about-title" className={styles.heroTitle} data-hero-title aria-label="About Zed OS">
          {Array.from(TITLE).map((char, i) => (
            <span key={i} className={styles.heroCharMask} aria-hidden="true">
              <span className={styles.heroChar} data-hero-char>
                {char}
              </span>
            </span>
          ))}
        </h1>

        <p className={styles.heroTagline} data-hero-meta>
          <span data-hero-fade>
            Built on <em>trust</em>, driven by excellence.
          </span>
        </p>

        <div className={styles.heroRow} data-hero-row>
          {heroImages.map((image, i) => (
            <figure
              key={image.src}
              className={styles.heroCard}
              data-hero-card
              // The middle card ends up on top of the deck.
              style={{ zIndex: 10 - Math.abs(i - Math.floor(heroImages.length / 2)) }}
            >
              <div className={styles.heroCardInner} data-hero-card-inner>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 30vw, 18vw" preload={i === 2} className={styles.cover} />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
