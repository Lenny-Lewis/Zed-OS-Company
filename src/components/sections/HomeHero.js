'use client'

import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import Reveal from '@/components/Reveal'

export default function HomeHero() {

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] md:min-h-screen bg-black overflow-hidden flex items-end pb-24 md:pb-32 lg:pb-36">
      {/* Abstract Low Poly Plexus Background Image */}
      <Image
        src={images.hero}
        alt="Zed OS Tech hero background"
        fill
        className="object-cover object-center opacity-95"
        priority
        sizes="100vw"
      />
      
      {/* Bottom & Left Gradient Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 sm:via-black/50 to-transparent" />

      {/* Main Content Container Aligned to Bottom Left */}
      <div className="relative z-10 w-full px-6 sm:px-10 md:px-12 lg:px-16 max-w-7xl">
        <Reveal className="max-w-xl text-left text-white">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Smart Tech, <br />
            <span className="text-white font-extrabold">Smarter Living</span>
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base md:text-lg mt-5 font-medium leading-relaxed max-w-md">
            Upgrade your everyday with Zed OS modern electronics, ICT supplies &amp; enterprise software designed for performance.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/products"
              className="bg-white hover:bg-neutral-200 text-black px-7 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-md hover:scale-105 inline-block"
            >
              Shop Now
            </Link>
            <Link
              href="/services"
              className="bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 px-7 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all backdrop-blur-md inline-block"
            >
              Explore Services
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
