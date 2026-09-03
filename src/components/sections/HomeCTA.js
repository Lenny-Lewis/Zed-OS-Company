import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import Reveal from '@/components/Reveal'

export default function HomeCTA() {
  return (
    <section className="bg-black py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden p-12 md:p-20 text-center shadow-2xl border border-neutral-900 bg-neutral-950">
        <Image
          src={images.aboutTeam}
          alt="Team ready to work with you"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
        <Reveal className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Ready to Work With Us?</h2>
          <p className="text-neutral-300 mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            Let&apos;s discuss how Zed OS Technologies can support your business and operational needs.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 bg-white hover:bg-neutral-200 text-black px-9 py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg hover:scale-105"
          >
            Get in Touch
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
