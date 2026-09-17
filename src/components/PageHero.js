import Image from 'next/image'
import Reveal from '@/components/Reveal'

export default function PageHero({ label, title, subtitle, backgroundImage }) {
  return (
    <section className="bg-black px-4 py-4 md:px-8 md:py-6">
      <div className="liquid-glass max-w-[1400px] mx-auto relative overflow-hidden rounded-[2.5rem] px-6 py-20 text-center md:rounded-[3rem] md:py-28">
        {backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt=""
              fill
              className="object-cover opacity-30"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/55" />
          </>
        )}
        <Reveal className="relative z-10 max-w-4xl mx-auto">
          <span className="liquid-glass inline-block rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/90">
            {label}
          </span>
          <h1 className="mt-5 font-heading text-5xl italic leading-[0.9] tracking-[-3px] text-white sm:text-7xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-base font-light leading-relaxed text-white/80 sm:text-lg">{subtitle}</p>
        </Reveal>
      </div>
    </section>
  )
}
