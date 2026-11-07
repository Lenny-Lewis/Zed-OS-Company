import ScrollReveal from '@/components/ScrollReveal'
import AboutUsSection from '@/components/ui/about-us-section'

export const metadata = {
  title: 'About Us — Zed OS Technologies Limited',
  description:
    'Learn about Zed OS Technologies Limited — a Kisumu-based enterprise specializing in General Supplies, Vehicle Hire, Software Systems, Data Analytics, AI & ML, and Consultancy across Kenya and East Africa.',
}

const values = [
  {
    title: 'Integrity',
    description:
      'We conduct every interaction with honesty, transparency, and ethical standards that build lasting trust with our clients.',
  },
  {
    title: 'Innovation',
    description:
      'We continuously evolve our services and approaches to stay ahead of market trends and deliver smarter solutions.',
  },
  {
    title: 'Excellence',
    description:
      'We hold ourselves to the highest standards in every supply, vehicle, facility, and consultation we deliver.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#000000] text-white min-h-screen">
      <AboutUsSection />

      <section className="bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal className="text-center">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55 font-mono">
              Leadership
            </span>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl md:text-6xl font-display">
              A Word from Our CEO
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={120} className="mx-auto mt-12 max-w-5xl border-y border-white/15 py-12 md:py-16">
            <figure className="mx-auto max-w-3xl text-center">
              <blockquote className="font-serif text-2xl italic leading-snug tracking-[-0.02em] text-white/90 md:text-4xl">
                &ldquo;Reliability is the standard we hold ourselves to. Whether we are delivering supplies or building digital systems, our clients should get quality they can count on, every time.&rdquo;
              </blockquote>
              <figcaption className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-white/50 font-mono">
                CEO at ZedOS Tech
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal className="text-center">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55 font-mono">
              What Drives Us
            </span>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl md:text-6xl font-display">
              Our Core Values
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 90}>
                <div className="h-full py-8 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0">
                  <h3 className="text-3xl font-light tracking-[-0.04em] text-white font-sans">{value.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/65 font-sans">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
