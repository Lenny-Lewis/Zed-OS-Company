export default function PageHero({ label, title, subtitle }) {
  return (
    <section className="bg-[#000000] px-5 pb-6 pt-24 md:px-8 md:pb-8 md:pt-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] md:items-end md:gap-12">
        <div>
          <p className="font-eyebrow text-white/45">{label}</p>
          <h1 className="font-display mt-3 text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">{title}</h1>
        </div>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-white/65 md:justify-self-end md:text-base">{subtitle}</p>
      </div>
    </section>
  )
}
