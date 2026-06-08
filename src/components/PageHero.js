import Image from 'next/image'
import Reveal from '@/components/Reveal'

export default function PageHero({ label, title, subtitle, backgroundImage }) {
  return (
    <section className="relative bg-brand-deep py-24 px-6 text-center overflow-hidden">
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-deep/85" />
        </>
      )}
      <Reveal className="relative z-10">
        <p className="text-brand-accent text-xs uppercase tracking-widest">{label}</p>
        <h1 className="text-5xl font-bold text-white mt-3">{title}</h1>
        <p className="text-brand-muted text-lg mt-3 max-w-2xl mx-auto">{subtitle}</p>
      </Reveal>
    </section>
  )
}
