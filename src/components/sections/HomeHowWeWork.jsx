'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

// three.js is large: load the machine only on the client, and only once the visitor nears it.
const AgenticFactory3D = dynamic(() => import('@/components/ui/agentic-factory-3d'), {
  ssr: false,
  loading: () => null,
})

const steps = [
  { id: 'cabinet', name: 'Client Portal', detail: 'You send a request. We scope it with you.' },
  { id: 'engine', name: 'Sourcing', detail: 'Quotes and procurement from trusted suppliers.' },
  { id: 'admin', name: 'Systems', detail: 'Software, websites and workflows built to fit.' },
  { id: 'storefront', name: 'Insights', detail: 'Dashboards, analytics and AI on your data.' },
  { id: 'cashdesk', name: 'Delivery', detail: 'Delivered on time, invoiced, supported after.' },
]

const machine = () => (typeof window !== 'undefined' ? window.__machine : undefined)

export default function HomeHowWeWork() {
  const sectionRef = useRef(null)
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(null)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const focus = (id) => {
    if (machine()?.focusStation(id)) {
      setActive(id)
      setFollowing(false)
    }
  }
  const follow = () => {
    if (machine()?.setMode('order')) {
      setActive(null)
      setFollowing(true)
    }
  }
  const reset = () => {
    const m = machine()
    if (!m) return
    m.setMode('assembled')
    m.setCamera('overview')
    setActive(null)
    setFollowing(false)
  }

  return (
    <section ref={sectionRef} className="relative bg-black pb-12 md:pb-16" aria-labelledby="how-we-work-title">
      <div className="relative mx-auto max-w-[1600px]">
        {/* Copy: above the machine on narrow screens, over its empty left side on wide ones */}
        <div className="relative z-10 px-5 pb-6 pt-24 md:px-8 min-[901px]:pointer-events-none min-[901px]:absolute min-[901px]:inset-y-0 min-[901px]:left-0 min-[901px]:flex min-[901px]:w-[42%] min-[901px]:items-center min-[901px]:pb-0 min-[901px]:pt-0">
          <div className="max-w-md min-[901px]:pointer-events-auto">
            <ScrollReveal variant="blur">
              <span className="font-eyebrow text-white/45">How We Work</span>
            </ScrollReveal>
            <ScrollReveal variant="blur" delay={80}>
              <h2
                id="how-we-work-title"
                className="font-display mt-5 text-4xl leading-[1.05] text-white sm:text-5xl"
              >
                From request to delivery.
                <br />
                <span className="text-white/55">One system.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <p className="mt-6 text-[15px] leading-relaxed text-white/65">
                Every engagement runs through the same five stations, so supplies, software and
                insights arrive together, on time, from one partner in Kisumu.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={220}>
              <ol className="mt-8 border-t border-white/10">
                {steps.map((step, i) => (
                  <li key={step.id} className="border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => focus(step.id)}
                      disabled={!ready}
                      aria-pressed={active === step.id}
                      className={`group flex w-full items-baseline gap-4 py-3 text-left transition-colors disabled:cursor-default ${
                        active === step.id ? 'text-white' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <span className="font-mono text-[10px] tracking-[0.14em] text-[#ff7a1a]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                      <span className="ml-auto hidden text-xs text-white/40 sm:inline">{step.detail}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </ScrollReveal>

            <ScrollReveal delay={280}>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button type="button" onClick={follow} disabled={!ready} className="btn-ink disabled:opacity-50">
                  <span>{following ? 'Following a request…' : 'Follow a request'}</span>
                  <span aria-hidden="true">→</span>
                </button>
                {(active || following) && (
                  <button
                    type="button"
                    onClick={reset}
                    className="font-sans text-xs font-medium text-white/60 transition-colors hover:text-white"
                  >
                    Reset view
                  </button>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* The machine. A fixed-height box so nothing shifts when three.js arrives; tall enough on
            wide screens to hold the copy column beside it. */}
        <div className="relative h-[420px] min-[640px]:h-[540px] min-[901px]:h-[800px]">
          {/* Soft top/bottom edges so the scene melts into the sections around it, never a hard cut */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-20 bg-gradient-to-b from-black to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-black to-transparent" />
          {near && (
            <div className="absolute inset-0">
              <AgenticFactory3D
                embed
                height="100%"
                onReady={() => setReady(true)}
                onStation={(id) => {
                  setActive(id)
                  setFollowing(false)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
