'use client'

import { Fragment, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, MOTION_OK, REDUCED } from './motion'
import Highlight from './Highlight'
import RollText, { ArrowDot } from './RollText'
import { story } from '@/data/about'
import styles from './About.module.css'

const DESKTOP = `(min-width: 768px) and ${MOTION_OK}`
const MOBILE = `(max-width: 767px) and ${MOTION_OK}`

/*
 * The company timeline. On wider screens the section pins and the chapters slide sideways as you
 * scroll down: photos open out of an oval and drift inside their frames, and each year gets its
 * highlight as it comes in. On phones the chapters stack and the same effects run on vertical scroll.
 */
export default function AboutStory() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const q = (selector) => gsap.utils.toArray(selector, el)
    const mm = gsap.matchMedia()

    mm.add(DESKTOP, () => {
      const pin = el.querySelector('[data-story-pin]')
      const track = el.querySelector('[data-story-track]')
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

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
        },
      })
      // The bar fills while the playhead (which the glass emblem rides) runs along it.
      gsap
        .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
        .fromTo(el.querySelector('[data-story-progress]'), { scaleX: 0 }, { scaleX: 1 }, 0)
        .fromTo(el.querySelector('[data-story-playhead]'), { left: '0%' }, { left: '100%' }, 0)

      const along = (trigger, extra) => ({ trigger, containerAnimation: slide, ...extra })
      q('[data-oval]').forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: 'ellipse(32% 40% at 50% 50%)' },
          { clipPath: 'ellipse(75% 75% at 50% 50%)', ease: 'none', scrollTrigger: along(frame, { start: 'left right', end: 'center 60%', scrub: true }) },
        )
      })
      q('[data-drift]').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -7 },
          { xPercent: 7, ease: 'none', scrollTrigger: along(img.parentElement, { start: 'left right', end: 'right left', scrub: true }) },
        )
      })
      q('[data-hl-bar]').forEach((bar) => {
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.inOut', scrollTrigger: along(bar.parentElement, { start: 'left 80%' }) })
      })
      q('[data-story-rise]').forEach((block) => {
        gsap.from(block, { y: 50, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: along(block, { start: 'left 85%' }) })
      })
    })

    mm.add(MOBILE, () => {
      q('[data-oval]').forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: 'ellipse(36% 34% at 50% 50%)' },
          { clipPath: 'ellipse(80% 80% at 50% 50%)', ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'center 55%', scrub: true } },
        )
      })
      q('[data-hl-bar]').forEach((bar) => {
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.inOut', scrollTrigger: { trigger: bar.parentElement, start: 'top 85%' } })
      })
    })

    mm.add(REDUCED, () => gsap.set(q('[data-hl-bar]'), { scaleX: 1 }))

    return () => mm.revert()
  }, [])

  const total = String(story.chapters.length).padStart(2, '0')

  return (
    <section ref={ref} className={styles.story} aria-labelledby="story-title">
      <div className={styles.storyPin} data-story-pin>
        {/* Phones: the emblem keeps to the top corner while the chapters scroll past. */}
        <div className={styles.storyOrbitSticky} data-orbit-anchor="story" aria-hidden="true" />
        <div className={styles.storyHead}>
          <p className={styles.mono}>(Timeline)</p>
          <div className={styles.storyProgress} aria-hidden="true">
            <span className={styles.storyFill} data-story-progress />
            <span className={styles.storyPlayhead} data-story-playhead data-orbit-anchor="story" />
          </div>
          <p className={styles.mono}>2024 → Today</p>
        </div>

        <div className={styles.storyTrack} data-story-track>
          <div className={styles.storyTitleCard}>
            <h2 id="story-title" className={styles.display}>
              {story.title}
            </h2>
            <p className={styles.storyLead}>{story.lead}</p>
            <p className={`${styles.mono} ${styles.scrollHint}`} aria-hidden="true">
              Keep scrolling →
            </p>
          </div>

          {story.chapters.map((chapter, i) => {
            const [main, side] = chapter.images
            return (
              <Fragment key={chapter.title}>
                <article className={styles.chapter} data-chapter>
                  <div className={styles.chapterText} data-story-rise>
                    <p className={styles.mono}>
                      {String(i + 1).padStart(2, '0')} / {total}
                    </p>
                    <p className={styles.chapterWhen}>
                      <Highlight manual>{chapter.when}</Highlight>
                    </p>
                    <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                    <p className={styles.chapterBody}>{chapter.text}</p>
                  </div>
                  <figure className={`${styles.frame} ${styles.frameMain}`} data-oval>
                    <div className={styles.drift} data-drift>
                      <Image src={main.src} alt={main.alt} fill sizes="(max-width: 767px) 100vw, 36vw" className={styles.cover} />
                    </div>
                  </figure>
                  {side && (
                    <figure className={`${styles.frame} ${styles.frameSide}`}>
                      <div className={styles.drift} data-drift>
                        <Image src={side.src} alt={side.alt} fill sizes="(max-width: 767px) 60vw, 20vw" className={styles.cover} />
                      </div>
                    </figure>
                  )}
                </article>
                {i === 1 && (
                  <blockquote className={styles.callout} data-story-rise>
                    <span className={styles.calloutMark} aria-hidden="true">
                      “
                    </span>
                    {story.callout}
                  </blockquote>
                )}
              </Fragment>
            )
          })}

          <div className={styles.storyEnd} data-story-rise>
            <div className={styles.endOrbit} data-orbit-anchor="end" aria-hidden="true" />
            <p className={styles.display}>And we’re just getting started.</p>
            <Link href="/contact" className={styles.pillLink}>
              <RollText text="Start a project" />
              <ArrowDot />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
