'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { images } from '@/data/images'
import ScrollReveal, { Stagger, StaggerItem } from '@/components/ScrollReveal'
import CountUp from '@/components/CountUp'

const stats = [
  { value: 24, suffix: '/7', label: 'Customer Support' },
  { value: 100, suffix: '%', label: 'Quality Assured' },
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 50, suffix: '+', label: 'Clients Served' },
]

export default function HomeAbout() {
  const imageRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : ['-8%', '8%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1.12, 1])

  return (
    <section className="bg-black px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <ScrollReveal variant="blur">
            <span className="font-eyebrow text-white/45">About Us</span>
          </ScrollReveal>
          <ScrollReveal variant="blur" delay={80}>
            <h2 className="font-display mt-5 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
              Built on Trust.
              <br className="hidden sm:block" />
              <span className="text-white/55">Driven by Excellence.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/65">
              Zed OS Technologies Limited is a registered Kenyan company based in Kisumu Town West,
              specializing in General Supplies, Software Systems, Websites, Data Analytics, AI,
              Machine Learning, and Consultancy Services. We deliver reliable, efficient, and
              professional solutions to individuals, private sector organizations, NGOs, and
              government institutions.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={220}>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/65">
              Our operations are guided by integrity, innovation, and customer satisfaction — with
              a commitment to quality service delivery, timely execution, and value for money.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={280}>
            <Link href="/about" className="btn-ink mt-9">
              <span>Learn More</span>
              <span aria-hidden="true">→</span>
            </Link>
          </ScrollReveal>
        </div>

        <div className="space-y-7">
          <ScrollReveal variant="clip" className="overflow-hidden">
            <div ref={imageRef} className="relative h-64 overflow-hidden md:h-80">
              <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-[-12%]">
                <Image
                  src={images.aboutOffice}
                  alt="Modern office workspace"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
          </ScrollReveal>

          <Stagger className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4" delay={120} stagger={0.1}>
            {stats.map((stat) => (
              <StaggerItem
                key={stat.label}
                className="border-b border-r border-white/10 px-3 py-6 text-center last:border-r-0 sm:border-b-0"
              >
                <p className="font-display text-3xl text-white md:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="font-eyebrow mt-2 text-[10px] text-white/40">{stat.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
