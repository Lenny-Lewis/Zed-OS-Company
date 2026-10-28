import Image from 'next/image'
import ScrollReveal from '@/components/ScrollReveal'
import AboutUsSection from '@/components/ui/about-us-section'
import { images } from '@/data/images'

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
              Meet the Director
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={120} className="mx-auto mt-12 max-w-5xl border-y border-white/15 py-8 md:py-12">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[300px_minmax(0,1fr)] md:gap-12">
              <div className="relative h-72 w-full overflow-hidden sm:h-80 md:h-[380px]">
                <Image
                  src={images.director}
                  alt="Lennox Lewis Odhiambo, Founder and Director"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div>
                <h3 className="text-3xl font-light tracking-[-0.04em] text-white md:text-4xl font-sans">
                  Lennox Lewis Odhiambo
                </h3>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-white/50 font-mono">
                  Founder &amp; Director
                </p>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 font-sans">
                  Lennox Lewis Odhiambo is a highly motivated and visionary Director, full stack developer, and certified ML engineer with a background in supply chain management and business consultation. Under his leadership, Zed OS Technologies delivers reliable, high-quality products and digital solutions with a commitment to excellence and innovation.
                </p>
              </div>
            </div>
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
