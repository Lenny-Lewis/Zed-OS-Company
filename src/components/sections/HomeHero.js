import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import Reveal from '@/components/Reveal'

export default function HomeHero() {
  return (
    <section className="relative bg-brand-base min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <Image
        src={images.hero}
        alt="Warehouse and supply chain operations"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-brand-base/75" />

      <Reveal className="relative z-10 flex flex-col items-center">
        <Image
          src={images.logo}
          alt="Zed OS Technologies Limited"
          width={320}
          height={120}
          className="w-auto h-16 md:h-24 object-contain mb-8"
          priority
        />
        <h1 className="text-6xl md:text-8xl font-bold text-white">Reliable Supplies.</h1>
        <h1 className="text-6xl md:text-8xl font-bold text-brand-accent">Professional Solutions.</h1>
        <p className="text-brand-muted text-xl mt-5">
          General Supplies &amp; Consultancy Services — Kisumu, Kenya
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <Link
            href="/services"
            className="bg-brand-primary hover:bg-brand-accent text-white px-8 py-3 rounded font-semibold transition-colors duration-200"
          >
            Our Services
          </Link>
          <Link
            href="/contact"
            className="border-2 border-white text-white hover:bg-white hover:text-brand-primary px-8 py-3 rounded font-semibold transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
        <p className="text-brand-muted text-sm mt-12 tracking-widest uppercase">
          Integrity · Innovation · Customer Satisfaction
        </p>
      </Reveal>
    </section>
  )
}
