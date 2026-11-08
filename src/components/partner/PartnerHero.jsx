'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK, onIntroDone } from '@/components/about/motion'
import { ZedOrbitMark } from '@/components/ui/zed-orbit-mark'
import { partnerHero } from '@/data/partner'
import about from '@/components/about/About.module.css'
import styles from './Partner.module.css'

/*
 * The title, with the glass emblem behind it pulled in two: its rings start apart, and scrolling
 * (while the section is pinned) draws them together until they lock into the logo. The emblem reads
 * how far apart they are from the anchor's data-orbit-apart, which the scroll sets here.
 */
export default function PartnerHero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return
    const el = root.current
    gsap.set(el.querySelectorAll('[data-hero-char]'), { yPercent: 105 })
    gsap.set(el.querySelectorAll('[data-hero-fade]'), { autoAlpha: 0, y: 16 })
    gsap.set(el.querySelector('[data-locked]'), { yPercent: 110 })
  }, [])

  useEffect(() => {
    const el = root.current
    const anchor = el.querySelector('[data-orbit-anchor]')
    let stopIntroWatch = () => {}
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      const join = { apart: 1 }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, pin: true, start: 'top top', end: '+=120%', scrub: true },
      })
      tl.to(join, {
        apart: 0,
        ease: 'power2.in',
        duration: 0.75,
        onUpdate: () => {
          anchor.dataset.orbitApart = join.apart.toFixed(3)
        },
      })
        .to(el.querySelector('[data-hero-title]'), { opacity: 0.2, scale: 0.92, duration: 0.75 }, 0)
        .to(el.querySelectorAll('[data-hero-meta]'), { opacity: 0, y: -30, duration: 0.4 }, 0)
        .to(el.querySelector('[data-locked]'), { yPercent: 0, duration: 0.2, ease: 'power3.out' }, 0.78)
        .to({}, { duration: 0.05 })

      stopIntroWatch = onIntroDone(() => {
        gsap
          .timeline({ delay: 0.15 })
          .to(el.querySelectorAll('[data-hero-char]'), { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05 })
          .to(el.querySelectorAll('[data-hero-fade]'), { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 0.4)
      })
    })

    return () => {
      stopIntroWatch()
      mm.revert()
    }
  }, [])

  return (
    <section ref={root} className={`${about.hero} ${styles.hero}`} aria-labelledby="partner-title">
      <div className={about.heroStage}>
        <div className={about.heroTop}>
          <div data-hero-meta>
            <p className={about.mono} data-hero-fade>Zed OS Technologies Limited</p>
            <p className={about.mono} data-hero-fade>{partnerHero.label}</p>
          </div>
          <div className={about.heroTopRight} data-hero-meta>
            <p className={about.mono} data-hero-fade>{partnerHero.place}</p>
            <p className={about.mono} data-hero-fade>Partnerships</p>
          </div>
        </div>

        <div className={styles.heroOrbit} data-orbit-anchor="hero" data-orbit-apart="1" aria-hidden="true">
          <ZedOrbitMark className={about.orbitFallback} />
        </div>

        <h1 id="partner-title" className={`${about.heroTitle} ${styles.title}`} data-hero-title aria-label="Partner with us">
          {Array.from(partnerHero.title).map((char, i) => (
            <span key={i} className={about.heroCharMask} aria-hidden="true">
              <span className={about.heroChar} data-hero-char>
                {char}
              </span>
            </span>
          ))}
        </h1>

        <div className={styles.heroFoot}>
          <p className={styles.subtitle} data-hero-meta>
            <span data-hero-fade>{partnerHero.subtitle}</span>
          </p>
          <p className={styles.lockedMask}>
            <span className={styles.locked} data-locked>
              {partnerHero.locked}
            </span>
          </p>
          <p className={about.mono} data-hero-meta>
            <span data-hero-fade>Scroll to connect ↓</span>
          </p>
        </div>
      </div>
    </section>
  )
}
