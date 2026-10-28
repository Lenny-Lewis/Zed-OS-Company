'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { setImmersive } from '@/lib/immersive'
import styles from './FreightDeliveryHero.module.css'

const VIDEO_1080 =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/409763c0-95f4-49d3-a601-dc564d55072b.mp4'
const VIDEO_720 =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/b3718419-7a0a-478d-bfb0-0ff8bef7f3f7.mp4'
const POSTER =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/2307e4bf-be39-42b4-b579-e168aeccabf0.jpg'

const A = 2.4
const FINAL_BAND = 0.448
const NARROW_BREAK = 900

const SERVICES = [
  {
    title: 'Air freight',
    body: 'Express, priority and deferred options across global lanes, booked and tracked end to end.',
    icon: (
      <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
        <path d="M5 24.5 19 8l14 16.5H5Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 24.5h14M15.5 28.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Ocean freight',
    body: 'FCL and LCL sailings on every major trade lane, with carrier choice based on cost and transit time.',
    icon: (
      <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
        <path d="M6 23h26l-3 6H9l-3-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 23V14h8v9M18 17h8v6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4 31c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Customs brokerage',
    body: 'Licensed in-house brokers for classification, duties and inspections, so goods clear first time.',
    icon: (
      <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
        <rect x="9" y="6" width="20" height="26" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 14h10M14 19h10M14 24h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="m22.5 26.5 2 2 4-4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Warehousing\nand 3PL',
    body: 'Bonded and general storage, pick and pack, and distribution that plugs straight into transport.',
    icon: (
      <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
        <path d="M5 16 19 7l14 9v13H5V16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 29V18h10v11" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Project cargo',
    body: 'Oversized and heavy-lift moves, engineered, permitted and escorted from factory to foundation.',
    icon: (
      <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
        <path d="M10 8h8v4H10V8Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 12v6M8 18h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 10h8l2 18H10l2-8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function clamp(v, a = 0, b = 1) {
  return Math.min(b, Math.max(a, v))
}

function isPhoneLayout() {
  return window.innerWidth < 768 || window.innerWidth <= window.innerHeight
}

function pickSrc() {
  return window.innerWidth <= NARROW_BREAK ? VIDEO_720 : VIDEO_1080
}

/** Approximate cubic-bezier(.4,.05,.55,.95) for recorder easing. */
function easeRec(t) {
  const c1 = 0.4
  const c2 = 0.05
  const c3 = 0.55
  const c4 = 0.95
  let x = t
  for (let i = 0; i < 6; i += 1) {
    const bx = 3 * c1 * (1 - x) * (1 - x) * x + 3 * c3 * (1 - x) * x * x + x * x * x
    const dx = 3 * c1 * (1 - x) * (1 - x) + 6 * (c3 - c1) * (1 - x) * x + 3 * (1 - c3) * x * x
    if (Math.abs(dx) < 1e-6) break
    x -= (bx - t) / dx
  }
  return 3 * c2 * (1 - x) * (1 - x) * x + 3 * c4 * (1 - x) * x * x + x * x * x
}

export default function FreightDeliveryHero() {
  const trackRef = useRef(null)
  const sceneRef = useRef(null)
  const videoRef = useRef(null)
  const lettersRef = useRef(null)
  const stripRef = useRef(null)
  const speedRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const track = trackRef.current
    const scene = sceneRef.current
    const video = videoRef.current
    const letters = lettersRef.current
    const strip = stripRef.current
    const speedEl = speedRef.current
    if (!track || !scene || !video || !letters || !strip || !speedEl) return

    let raf = 0
    let curTime = 0
    let seeking = false
    let pendingSeek = null
    let lastY = window.scrollY
    let lastT = performance.now()
    let smoothSpeed = 0
    let B = 2.2
    let recProgress = null
    let recRaf = 0
    let recHolder = null
    let immersiveOn = false

    const recorder = new URLSearchParams(window.location.search).get('rec') === '1'

    const syncImmersive = (scrollY) => {
      const max = Math.max(0, track.offsetHeight - window.innerHeight)
      const active = scrollY > 0 && scrollY < max
      if (active && !immersiveOn) {
        immersiveOn = true
        setImmersive(true)
      } else if (!active && immersiveOn) {
        immersiveOn = false
        setImmersive(false)
      }
    }

    const seekTo = (t) => {
      if (!Number.isFinite(t)) return
      const duration = video.duration
      if (!duration || !Number.isFinite(duration)) {
        pendingSeek = t
        return
      }
      const next = clamp(t, 0, Math.max(0, duration - 1 / 48))
      if (Math.abs(video.currentTime - next) < 1 / 60) return
      if (seeking) {
        pendingSeek = next
        return
      }
      seeking = true
      try {
        video.currentTime = next
      } catch {
        seeking = false
      }
    }

    const onSeeked = () => {
      seeking = false
      if (pendingSeek != null) {
        const t = pendingSeek
        pendingSeek = null
        seekTo(t)
      }
    }

    const updateCards = () => {
      const vw = window.innerWidth
      cardRefs.current.forEach((card) => {
        if (!card) return
        const left = card.getBoundingClientRect().left
        const s = clamp((0.98 - left / vw) / 0.3, -0.4, 1.6) * 100
        card.style.setProperty('--s', `${s}%`)
        const title = card.querySelector('[data-card-title]')
        const body = card.querySelector('[data-card-body]')
        if (title) title.style.setProperty('--s', `${s}%`)
        if (body) body.style.setProperty('--s', `${s}%`)
      })
    }

    const localScroll = () => {
      const start = track.offsetTop
      const max = Math.max(0, track.offsetHeight - window.innerHeight)
      return clamp(window.scrollY - start, 0, max)
    }

    const apply = (scrollY, force = false) => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const q = clamp(scrollY / (A * vh))
      const duration = video.duration && Number.isFinite(video.duration) ? video.duration : 4.04
      const target = q * (duration - 1 / 48)

      if (force) curTime = target
      else curTime += (target - curTime) * 0.2
      seekTo(curTime)

      track.style.setProperty('--ph', q >= 0.94 ? '1' : '0')

      const r = clamp((scrollY - A * vh) / (B * vh))
      const stripWidth = strip.scrollWidth
      const lettersWidth = letters.scrollWidth
      strip.style.transform = `translate3d(${vw - r * (stripWidth + 0.45 * vw)}px,0,0)`
      letters.style.transform = `translate3d(${vw - r * (lettersWidth + vw)}px,0,0)`
      updateCards()
    }

    const measure = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const phone = isPhoneLayout()

      if (phone) {
        const w = vw * 1.55
        const h = w * (1080 / 1920)
        video.style.width = `${w}px`
        video.style.height = `${h}px`
        const bandY = h * FINAL_BAND
        const targetBand = vh * 0.36
        video.style.left = `${vw * 0.5 - w * 0.4}px`
        video.style.top = `${targetBand - bandY}px`
        video.style.transform = 'none'
      } else {
        const scale = Math.max(vw / 1920, vh / 1080)
        video.style.width = `${1920 * scale}px`
        video.style.height = `${1080 * scale}px`
        video.style.left = '50%'
        video.style.top = '50%'
        video.style.transform = 'translate(-50%, -50%)'
      }

      const rect = video.getBoundingClientRect()
      const sceneRect = scene.getBoundingClientRect()
      const edge = rect.top - sceneRect.top + rect.height * FINAL_BAND
      track.style.setProperty('--edge-px', `${edge}px`)

      const stripWidth = strip.scrollWidth
      B = ((stripWidth + 0.45 * vw) / vw) * 1.1
      track.style.height = `${(1 + A + B) * vh}px`
      apply(localScroll(), true)
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)

      if (recorder && recProgress != null) {
        const start = track.offsetTop
        const total = (1 + A + B) * window.innerHeight
        window.scrollTo(0, start + recProgress * total)
      }

      const scrollY = localScroll()
      const dy = Math.abs(scrollY - lastY)
      const dt = Math.max(0.001, (now - lastT) / 1000)
      const instant = Math.min(99, dy / dt / 32)
      smoothSpeed += (instant - smoothSpeed) * 0.18
      lastY = scrollY
      lastT = now

      if (recorder && window.__recScriptSpeed != null) {
        speedEl.textContent = `${String(Math.round(window.__recScriptSpeed)).padStart(2, '0')} KM/H`
      } else {
        speedEl.textContent = `${String(Math.round(smoothSpeed)).padStart(2, '0')} KM/H`
      }

      syncImmersive(scrollY)
      apply(scrollY)
    }

    const onMeta = () => {
      measure()
      if (pendingSeek != null) {
        const t = pendingSeek
        pendingSeek = null
        seekTo(t)
      }
    }

    const desired = pickSrc()
    if (video.dataset.src !== desired) {
      video.dataset.src = desired
      video.src = desired
      video.load()
    }

    video.muted = true
    video.playsInline = true
    video.pause()

    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('seeked', onSeeked)
    window.addEventListener('resize', measure)

    measure()
    raf = requestAnimationFrame(tick)

    window.__recTime = (vid, t) => {
      const start = track.offsetTop
      const total = (1 + A + B) * window.innerHeight
      const progress = clamp(t)
      recProgress = progress
      window.scrollTo(0, start + progress * total)
      apply(progress * total, true)
      return vid?.currentTime ?? curTime
    }

    if (recorder) {
      const start = performance.now()
      const drive = (now) => {
        const raw = clamp((now - start) / 11000)
        let progress
        if (raw < 0.04) progress = 0.04
        else if (raw > 0.96) progress = 0.96
        else progress = 0.04 + easeRec((raw - 0.04) / 0.92) * 0.92
        recProgress = progress
        window.__recScriptSpeed = Math.min(99, Math.round(8 + Math.sin(raw * Math.PI) * 70))
        if (raw < 1) recRaf = requestAnimationFrame(drive)
      }
      recRaf = requestAnimationFrame(drive)
      recHolder = true
    }

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(recRaf)
      if (immersiveOn) setImmersive(false)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('resize', measure)
      delete window.__recTime
      delete window.__recScriptSpeed
      void recHolder
    }
  }, [])

  return (
    <section ref={trackRef} className={styles.track} aria-label="Delivery services" data-immersive-section="freight">
      <div className={styles.nav}>
        <Link href="/" className={styles.brand}>
          Zed OS
        </Link>
        <div className={styles.navRight}>
          <Link href="/services" className={styles.navLink}>
            → Menu
          </Link>
          <a
            href="https://www.linkedin.com/in/zedos-technologies-576bb3414"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navFollow}
          >
            Follow
          </a>
          <Link href="/contact" className={styles.navPill}>
            Work with us
          </Link>
        </div>
      </div>

      <div ref={sceneRef} className={styles.scene}>
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          preload="auto"
          poster={POSTER}
          aria-label="Reach stacker loading a container onto a truck"
        />

        <p ref={lettersRef} className={styles.letters} aria-hidden="true">
          OUR SERVICES
        </p>

        <div ref={speedRef} className={styles.speed} aria-hidden="true">
          00 KM/H
        </div>

        <div className={styles.band}>
          <div ref={stripRef} className={styles.strip}>
            <div className={styles.lead}>
              <h2 className={styles.headline}>
                EVERYTHING YOUR
                <br />
                FREIGHT NEEDS.
                <br />
                <span className={styles.headlineCobalt}>UNDER ONE GROUP.</span>
              </h2>
              <div className={styles.leadCopy}>
                <p>
                  From air to sea, from customs clearance to the last mile, we bring decades of
                  practice to every freight discipline.
                </p>
                <p>
                  One integrated network means one partner, one point of contact and full visibility
                  from origin to destination.
                </p>
              </div>
            </div>

            <div className={styles.cards}>
              {SERVICES.map((service, index) => (
                <article
                  key={service.title}
                  className={styles.card}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                >
                  <span className={styles.cardIcon}>{service.icon}</span>
                  <h3 className={styles.cardTitle} data-card-title>
                    {service.title}
                  </h3>
                  <p className={styles.cardBody} data-card-body>
                    {service.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.servicesPill}>Our services</div>
        </div>
      </div>
    </section>
  )
}
