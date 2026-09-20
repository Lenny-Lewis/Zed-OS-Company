export default function PageHero({ label, title, subtitle }) {
  return (
    <section className="bg-black px-5 pb-6 pt-24 md:px-8 md:pb-8 md:pt-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] md:items-end md:gap-12">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">{label}</p>
          <h1 className="mt-2.5 text-4xl font-light leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">{title}</h1>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-white/65 md:justify-self-end md:text-base">{subtitle}</p>
      </div>
    </section>
  )
}
