import Image from 'next/image'
import Reveal from '@/components/Reveal'

export default function PageHero({ label, title, subtitle, backgroundImage }) {
  return (
    <section className="bg-black py-4 md:py-6 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden py-16 md:py-24 px-6 text-center shadow-2xl border border-neutral-900 bg-neutral-950">
        {backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt=""
              fill
              className="object-cover opacity-25"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />
          </>
        )}
        <Reveal className="relative z-10 max-w-4xl mx-auto">
          <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-4 py-1.5 rounded-full inline-block mb-4 shadow-sm border border-neutral-800">
            {label}
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-2 tracking-tight">{title}</h1>
          <p className="text-neutral-300 text-lg sm:text-xl mt-4 max-w-2xl mx-auto leading-relaxed font-normal">{subtitle}</p>
        </Reveal>
      </div>
    </section>
  )
}
