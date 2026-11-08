'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap, MOTION_OK, REDUCED } from '@/components/about/motion'
import Highlight from '@/components/about/Highlight'
import RollText, { ArrowDot } from '@/components/about/RollText'
import { process, productsCta } from '@/data/products'
import { useQuote } from './QuoteContext'
import about from '@/components/about/About.module.css'
import styles from './Products.module.css'

/*
 * How ordering works, in four steps along a delivery route. The route draws itself as you scroll
 * and each stop lights up as the line reaches it.
 */
export function ProductsProcess() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const route = el.querySelector('[data-route]')
    const stops = gsap.utils.toArray('[data-stop]', el)
    const steps = gsap.utils.toArray('[data-step]', el)
    // Stops light up in the brand orange (read from CSS, since GSAP tweens real colours).
    const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#fd551d'
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const vertical = window.matchMedia('(max-width: 767px)').matches
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el.querySelector('[data-steps]'), start: 'top 75%', end: 'bottom 55%', scrub: true },
      })
      tl.fromTo(route, vertical ? { scaleY: 0 } : { scaleX: 0 }, vertical ? { scaleY: 1, duration: 1 } : { scaleX: 1, duration: 1 }, 0)
      stops.forEach((stop, i) => {
        const at = i / (stops.length - 1)
        tl.to(stop, { backgroundColor: brand, scale: 1.25, duration: 0.05 }, at * 0.95)
          .fromTo(steps[i], { autoAlpha: 0.25, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.12 }, at * 0.9)
      })
    })
    mm.add(REDUCED, () => {
      gsap.set(stops, { backgroundColor: brand })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className={styles.process} aria-labelledby="process-title">
      <div className={about.sectionHead}>
        <p className={about.label}>(How it works)</p>
        <h2 id="process-title" className={about.display}>
          From <Highlight>request</Highlight> to door
        </h2>
      </div>
      <div className={styles.stepsWrap} data-steps>
        <span className={styles.routeTrack} aria-hidden="true">
          <span className={styles.route} data-route />
        </span>
        <ol className={styles.steps}>
          {process.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stop} data-stop aria-hidden="true" />
              <div data-step>
                <p className={about.mono}>Step {String(i + 1).padStart(2, '0')}</p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* The close: the crate, lid wide open with whatever's in the quote, and the way to send it. */
export function ProductsCta() {
  const { ids, setOpen } = useQuote()

  return (
    <section className={styles.cta} aria-labelledby="cta-title">
      <div className={styles.ctaCrate} data-crate-anchor="end" data-crate-open="1" aria-hidden="true" />
      <div className={styles.ctaBody}>
        <p className={about.label}>{productsCta.label}</p>
        <h2 id="cta-title" className={about.display}>
          {productsCta.before}
          <Highlight>{productsCta.highlight}</Highlight>
        </h2>
        <p className={styles.ctaNote}>{productsCta.note}</p>
        <div className={styles.ctaActions}>
          <button type="button" className={about.pillLink} onClick={() => setOpen(true)}>
            <RollText text={ids.length ? `Review your quote · ${ids.length}` : 'Request a quote'} />
            <ArrowDot />
          </button>
          <Link href="/contact" className={about.pillLink}>
            <RollText text="Talk to us" />
            <ArrowDot />
          </Link>
        </div>
      </div>
    </section>
  )
}
