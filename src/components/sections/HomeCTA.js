import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import Reveal from '@/components/Reveal'

export default function HomeCTA() {
  return (
    <section className="relative py-20 px-6 text-center overflow-hidden">
      <Image
        src={images.aboutTeam}
        alt="Team ready to work with you"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-brand-primary/90" />
      <Reveal className="relative z-10">
        <h2 className="text-4xl font-bold text-white">Ready to Work With Us?</h2>
        <p className="text-white/80 mt-4 max-w-xl mx-auto">
          Let&apos;s discuss how Zed OS Technologies can support your business needs.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-8 border-2 border-white text-white hover:bg-white hover:text-brand-primary px-8 py-3 rounded font-semibold transition-colors duration-200"
        >
          Get in Touch
        </Link>
      </Reveal>
    </section>
  )
}
