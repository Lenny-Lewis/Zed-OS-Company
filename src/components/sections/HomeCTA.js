'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { images } from '@/data/images'
import ScrollReveal from '@/components/ScrollReveal'

export default function HomeCTA() {
  const sectionRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : ['-12%', '12%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1.15, 1])

  return (
    <section className="bg-black px-5 py-24 md:px-8 md:py-32">
      <div ref={sectionRef} className="relative mx-auto max-w-[1400px] overflow-hidden px-6 py-24 text-center md:px-16 md:py-32">
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-[-14%]">
          <Image
            src={images.aboutTeam}
            alt="Team ready to work with you"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/85" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <ScrollReveal variant="blur">
            <p className="font-eyebrow text-white/50">Let&apos;s build what&apos;s next</p>
          </ScrollReveal>
          <ScrollReveal variant="blur" delay={90}>
            <h2 className="font-display mt-5 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
              Ready to Work With Us?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base">
              Let&apos;s discuss how Zed OS Technologies can support your business and operational needs.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <Link href="/contact" className="btn-ink mt-9">
              Get in Touch
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
