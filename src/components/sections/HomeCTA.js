import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import ScrollReveal from '@/components/ScrollReveal'

export default function HomeCTA() {
  return (
    <section className="bg-black px-5 py-20 md:px-8 md:py-28">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden bg-neutral-950 px-6 py-20 text-center md:px-16 md:py-28">
        <Image
          src={images.aboutTeam}
          alt="Team ready to work with you"
          fill
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70" />
        <ScrollReveal className="relative z-10 mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">Let&apos;s build what&apos;s next</p>
          <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">Ready to Work With Us?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Let&apos;s discuss how Zed OS Technologies can support your business and operational needs.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            Get in Touch
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
