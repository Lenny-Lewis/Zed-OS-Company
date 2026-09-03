import Reveal from '@/components/Reveal'

export default function HomeVisionMission() {
  return (
    <section className="bg-black py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal>
          <div className="bg-neutral-950 rounded-3xl p-8 md:p-12 border border-neutral-900 shadow-xl h-full flex flex-col justify-between">
            <div>
              <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-3.5 py-1.5 rounded-full inline-block border border-neutral-800">
                Our Vision
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-5 tracking-tight">Leading with Purpose</h3>
              <p className="text-neutral-300 mt-4 leading-relaxed text-base font-normal">
                To be the most trusted provider of general supplies and consultancy services in East
                Africa — recognized for integrity, innovation, and exceptional customer satisfaction.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="bg-neutral-950 rounded-3xl p-8 md:p-12 border border-neutral-900 shadow-xl h-full flex flex-col justify-between">
            <div>
              <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-3.5 py-1.5 rounded-full inline-block border border-neutral-800">
                Our Mission
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-5 tracking-tight">Delivering Excellence Daily</h3>
              <p className="text-neutral-300 mt-4 leading-relaxed text-base font-normal">
                To provide reliable, efficient, and professional supply and consultancy solutions that
                empower our clients to achieve their operational goals — with quality, timeliness, and
                value at the heart of everything we do.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
