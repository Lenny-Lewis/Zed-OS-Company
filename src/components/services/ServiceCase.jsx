'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useServicesTransition } from './ServicesShell'
import WipeText from './WipeText'
import styles from './ServiceCase.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const MOTION = '(prefers-reduced-motion: no-preference)'

/** The service's name, sized so it spans the full width, rising letter by letter as you scroll. */
function HeroTitle({ text, heroRef }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = '100px'
      const natural = el.scrollWidth
      if (natural) el.style.fontSize = `${(100 * el.parentElement.clientWidth) / natural}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el.parentElement)
    return () => ro.disconnect()
  }, [text])

  useEffect(() => {
    const el = ref.current
    const hero = heroRef.current
    if (!el || !hero) return
    const mm = gsap.matchMedia()
    mm.add(MOTION, () => {
      const narrow = window.matchMedia('(max-width: 1023px)').matches
      gsap.fromTo(
        el.querySelectorAll('[data-char]'),
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: 'power3.out',
          stagger: narrow ? 0.01 : 0.025,
          scrollTrigger: { trigger: hero, start: '10% top', end: narrow ? '30% top' : '80% top', scrub: 1 },
        },
      )
    })
    return () => mm.revert()
  }, [heroRef, text])

  return (
    <div className={styles.heroTitleWrap} aria-hidden="true">
      <div ref={ref} className={styles.heroTitle}>
        {Array.from(text).map((char, index) => (
          <span key={index} data-char className={styles.heroChar}>
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </div>
    </div>
  )
}

function Hero({ service }) {
  const heroRef = useRef(null)
  const photoRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION, () => {
      gsap.to(photoRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    // "none": no bar over the cover photo. It appears, in the next section's colour, as that reaches it.
    <section ref={heroRef} className={styles.hero} data-header-tone="none">
      <h1 className={styles.srOnly}>{service.title}</h1>
      <div className={styles.heroMedia}>
        <div ref={photoRef} className={styles.heroPhoto}>
          <Image
            src={service.photos.hero}
            alt=""
            fill
            priority
            quality={85}
            className={styles.cover}
            style={{ objectPosition: service.heroFocus }}
            sizes="100vw"
          />
        </div>
        <div className={styles.heroTint} />
        <div className={styles.heroShade} />
      </div>
      <HeroTitle text={service.title} heroRef={heroRef} />
    </section>
  )
}

function Intro({ service }) {
  return (
    <section className={`${styles.section} ${styles.light}`} data-header-tone="light">
      <div className={`${styles.container} ${styles.grid}`}>
        <div className={styles.introLeft}>
          <WipeText as="h2" text={service.title} className={styles.h1} />
          <Link href="/contact" className={styles.textLink}>
            Request a quote
          </Link>
          <ul className={styles.details}>
            {service.details.map(([label, value]) => (
              <li key={label}>
                {label}: {value}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.introRight}>
          <WipeText as="p" text={service.tagline} className={styles.h3} />
          <div className={styles.body}>
            {service.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Story({ heading, part, photo, tone, photoShape }) {
  return (
    <section className={`${styles.section} ${styles[tone]}`} data-header-tone={tone}>
      <div className={`${styles.container} ${styles.grid}`}>
        <div className={styles.storyLeft}>
          <WipeText as="h2" text={heading} className={styles.h2} />
          <div className={`${styles.storyPhoto} ${styles[photoShape]}`}>
            <Image src={photo} alt="" fill className={styles.cover} sizes="(min-width: 1024px) 38vw, 100vw" />
          </div>
        </div>
        <div className={styles.storyRight}>
          <WipeText as="p" text={part.statement} className={styles.h3} />
          <div className={styles.body}>
            <p>{part.body}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Gallery({ photos }) {
  return (
    <section className={`${styles.gallerySection} ${styles.dark}`} data-header-tone="dark">
      <div className={`${styles.container} ${styles.grid}`}>
        <div className={`${styles.galleryItem} ${styles.galleryA}`}>
          <Image src={photos[0]} alt="" fill className={styles.cover} sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
        <div className={`${styles.galleryItem} ${styles.galleryB}`}>
          <Image src={photos[1]} alt="" fill className={styles.cover} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
    </section>
  )
}

function Wide({ photo }) {
  const frameRef = useRef(null)
  const innerRef = useRef(null)
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION, () => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: -11 },
        {
          yPercent: 11,
          ease: 'none',
          scrollTrigger: { trigger: frameRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
    return () => mm.revert()
  }, [])
  return (
    <div ref={frameRef} className={styles.wide} data-header-tone="dark">
      <div ref={innerRef} className={styles.wideInner}>
        <Image src={photo} alt="" fill quality={85} className={styles.cover} sizes="100vw" />
      </div>
    </div>
  )
}

function Results({ service }) {
  return (
    <section className={`${styles.section} ${styles.light}`} data-header-tone="light">
      <div className={`${styles.container} ${styles.grid}`}>
        <div className={styles.resultsLeft}>
          <WipeText as="h2" text="What You Get" className={styles.h4} />
          <ul className={styles.resultList}>
            {service.results.items.map(([label, value]) => (
              <li key={label}>
                {label}: {value}
              </li>
            ))}
          </ul>
          <div className={styles.ask}>
            <p className={styles.h5}>Need this for your organisation?</p>
            <div className={styles.askActions}>
              <Link href="/contact" className={styles.textLink}>
                Get in touch
              </Link>
              <a href="https://wa.me/254758296887" target="_blank" rel="noopener noreferrer" className={styles.callButton}>
                <span className={styles.callLabel}>Book a call</span>
                <span className={styles.callPlus} aria-hidden="true">
                  +
                </span>
              </a>
            </div>
          </div>
        </div>
        <ul className={styles.cards}>
          {service.results.cards.map(([value, label]) => (
            <li key={value} className={styles.card}>
              <span className={styles.cardValue}>{value}</span>
              <span className={styles.cardLabel}>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/*
 * The next service, pinned full-screen for three screens of scrolling. The bar along the bottom
 * fills as you go; reaching the end moves on to that service.
 */
function NextService({ next }) {
  const { navigate } = useServicesTransition()
  const router = useRouter()
  const sectionRef = useRef(null)
  const barRef = useRef(null)
  const labelRef = useRef(null)
  const titleRef = useRef(null)
  const gone = useRef(false)
  const href = `/services/${next.slug}`

  useEffect(() => {
    router.prefetch(href)
  }, [router, href])

  useEffect(() => {
    gone.current = false
    const words = [labelRef.current, titleRef.current]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const go = () => {
      if (gone.current) return
      gone.current = true
      navigate(href)
    }
    const progress = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.set(barRef.current, { scaleX: self.progress })
        if (self.progress >= 0.99) go()
      },
    })
    let rise
    if (!reduced) {
      gsap.set(words, { yPercent: 110 })
      const show = (y) => gsap.to(words, { yPercent: y, duration: 0.8, ease: 'power3.out', stagger: 0.1 })
      rise = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 10%',
        end: 'top 10%',
        onEnter: () => show(0),
        onLeaveBack: () => show(110),
      })
    }
    return () => {
      progress.kill()
      rise?.kill()
      gsap.set(words, { clearProps: 'transform' })
    }
  }, [href, navigate])

  return (
    <section ref={sectionRef} className={styles.next} data-header-tone="dark">
      <a
        href={href}
        className={styles.nextPanel}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
          event.preventDefault()
          gone.current = true
          navigate(href)
        }}
      >
        <div className={styles.nextPhoto}>
          <Image
            src={next.photos.hero}
            alt=""
            fill
            quality={85}
            className={styles.cover}
            style={{ objectPosition: next.heroFocus }}
            sizes="100vw"
          />
        </div>
        <div className={styles.nextTop} />
        <p className={`${styles.container} ${styles.keepScrolling}`}>[Keep scrolling to see more]</p>
        <div className={styles.nextBottom} />
        <div className={styles.nextText}>
          <div className={`${styles.container} ${styles.grid} ${styles.nextGrid}`}>
            <div className={styles.nextClip}>
              <p ref={labelRef} className={styles.nextLabel}>
                Next service
              </p>
            </div>
            <div className={`${styles.nextClip} ${styles.nextTitleClip}`}>
              <h2 ref={titleRef} className={styles.nextTitle}>
                {next.title}
              </h2>
            </div>
          </div>
        </div>
        <div className={styles.progress}>
          <div ref={barRef} className={styles.progressBar} />
        </div>
      </a>
    </section>
  )
}

export default function ServiceCase({ service, next }) {
  // Sections above change height as images load, which moves every scroll position below them.
  useEffect(() => {
    let timer = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(document.body)
    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
    }
  }, [])

  return (
    <article className={styles.page}>
      <Hero service={service} />
      <Intro service={service} />
      <Story heading="The Challenge" part={service.challenge} photo={service.photos.challenge} tone="dark" photoShape="photoSmall" />
      <Gallery photos={service.photos.gallery} />
      <Story heading="Our Approach" part={service.approach} photo={service.photos.approach} tone="light" photoShape="photoWide" />
      <Wide photo={service.photos.wide} />
      <Results service={service} />
      <NextService next={next} />
    </article>
  )
}
