'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, MOTION_OK } from '@/components/about/motion'
import Highlight from '@/components/about/Highlight'
import RollText, { ArrowDot } from '@/components/about/RollText'
import { audiences } from '@/data/partner'
import about from '@/components/about/About.module.css'
import styles from './Partner.module.css'

const HOVER = `(min-width: 768px) and (hover: hover) and ${MOTION_OK}`

/*
 * Who we work with, as big rows. On a desktop with a mouse, a photo follows the cursor over the list
 * and wipes to the hovered row's picture, leaning with the cursor's movement. On touch screens each
 * row shows its photo inline instead.
 */
export default function PartnerAudiences() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      gsap.utils.toArray('[data-aud-row]', el).forEach((row) => {
        gsap.from(row.querySelectorAll('[data-aud-rise]'), {
          yPercent: 60,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: row, start: 'top 88%' },
        })
      })
    })

    mm.add(HOVER, () => {
      const list = el.querySelector('[data-aud-list]')
      const preview = el.querySelector('[data-aud-preview]')
      const frames = gsap.utils.toArray('[data-aud-frame]', preview)
      const moveX = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3' })
      const moveY = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3' })
      const lean = gsap.quickTo(preview, 'rotation', { duration: 0.9, ease: 'power3' })
      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
      gsap.set(frames, { clipPath: 'inset(100% 0% 0% 0%)' })

      let current = -1
      let lastX = 0
      let layer = 1
      const show = (index) => {
        if (index === current) return
        current = index
        const frame = frames[index]
        layer += 1
        gsap.set(frame, { zIndex: layer })
        gsap.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.out', overwrite: true })
        gsap.fromTo(frame.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 1, ease: 'expo.out', overwrite: true })
      }

      // The cursor in viewport terms, so the photo can stay under it when the page scrolls beneath a
      // still mouse (the list moves, so its position inside the list changes).
      const cursor = { x: 0, y: 0 }
      const follow = () => {
        const box = list.getBoundingClientRect()
        const x = cursor.x - box.left
        moveX(x)
        moveY(cursor.y - box.top)
        lean(gsap.utils.clamp(-10, 10, (x - lastX) * 0.6))
        lastX = x
      }
      const onMove = (event) => {
        cursor.x = event.clientX
        cursor.y = event.clientY
        follow()
      }
      const onEnter = (event) => {
        cursor.x = event.clientX
        cursor.y = event.clientY
        const box = list.getBoundingClientRect()
        lastX = cursor.x - box.left
        gsap.set(preview, { x: lastX, y: cursor.y - box.top })
        gsap.to(preview, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' })
        window.addEventListener('scroll', follow, { passive: true })
      }
      const onLeave = () => {
        current = -1
        window.removeEventListener('scroll', follow)
        gsap.to(preview, { scale: 0, autoAlpha: 0, rotation: 0, duration: 0.4, ease: 'power3.in', overwrite: 'auto' })
      }
      const rows = gsap.utils.toArray('[data-aud-row]', list)
      const enters = rows.map((row, i) => {
        const handler = () => show(i)
        row.addEventListener('pointerenter', handler)
        return handler
      })
      list.addEventListener('pointermove', onMove)
      list.addEventListener('pointerenter', onEnter)
      list.addEventListener('pointerleave', onLeave)
      return () => {
        rows.forEach((row, i) => row.removeEventListener('pointerenter', enters[i]))
        list.removeEventListener('pointermove', onMove)
        list.removeEventListener('pointerenter', onEnter)
        list.removeEventListener('pointerleave', onLeave)
        window.removeEventListener('scroll', follow)
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className={styles.audiences} aria-labelledby="audiences-title">
      <div className={about.sectionHead}>
        <p className={about.label}>(Network &amp; scope)</p>
        <h2 id="audiences-title" className={about.display}>
          Who we <Highlight>work with</Highlight>
        </h2>
      </div>

      <div className={styles.audList} data-aud-list>
        <ul className={styles.audRows}>
          {audiences.map((audience, i) => (
            <li key={audience.title} className={styles.audRow} data-aud-row data-roll-host>
              <span className={about.mono} data-aud-rise>
                0{i + 1}
              </span>
              <h3 className={styles.audTitle} data-aud-rise>
                <RollText text={audience.title} />
              </h3>
              <p className={styles.audText} data-aud-rise>
                {audience.description}
              </p>
              <ArrowDot className={styles.audArrow} />
              {/* Touch screens: the photo sits in the row. */}
              <figure className={styles.audInline}>
                <Image src={audience.image.src} alt={audience.image.alt} fill sizes="100vw" className={about.cover} />
              </figure>
            </li>
          ))}
        </ul>

        <div className={styles.audPreview} data-aud-preview aria-hidden="true">
          {audiences.map((audience) => (
            <div key={audience.title} className={styles.audFrame} data-aud-frame>
              <Image src={audience.image.src} alt="" fill sizes="22vw" className={about.cover} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
