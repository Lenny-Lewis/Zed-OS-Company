import Reveal from '@/components/Reveal'

export default function HomeVisionMission() {
  return (
    <section className="bg-brand-deep py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal>
          <div className="bg-brand-card rounded-xl p-8 border-l-4 border-brand-accent h-full">
            <p className="text-brand-accent text-xs uppercase tracking-widest">Our Vision</p>
            <h3 className="text-2xl font-bold text-white mt-3">Leading with Purpose</h3>
            <p className="text-brand-muted mt-4 leading-relaxed">
              To be the most trusted provider of general supplies and consultancy services in East
              Africa — recognized for integrity, innovation, and exceptional customer satisfaction.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="bg-brand-card rounded-xl p-8 border-l-4 border-brand-accent h-full">
            <p className="text-brand-accent text-xs uppercase tracking-widest">Our Mission</p>
            <h3 className="text-2xl font-bold text-white mt-3">Delivering Excellence Daily</h3>
            <p className="text-brand-muted mt-4 leading-relaxed">
              To provide reliable, efficient, and professional supply and consultancy solutions that
              empower our clients to achieve their operational goals — with quality, timeliness, and
              value at the heart of everything we do.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
