import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { images } from '@/data/images'

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
    <>
      <PageHero
        label="WHO WE ARE"
        title="About Zed OS Technologies"
        subtitle="Integrity. Innovation. Excellence."
        backgroundImage={images.pageHeroBg}
      />

      <section className="bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
              Overview
            </span>
            <h2 className="mt-4 text-4xl font-light leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
              Delivering Excellence Across Kenya &amp; East Africa
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Zed OS Technologies Limited is a registered Kenyan company based in Kisumu Town West,
              specializing in General Supplies and Consultancy Services. The company was established
              to provide reliable, efficient, and professional solutions to individuals, private sector
              organizations, NGOs, and government institutions.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
              We pride ourselves on integrity, innovation, and customer satisfaction. Our operations
              are guided by a commitment to quality service delivery, timely execution, and value for
              money.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative h-72 overflow-hidden md:h-96">
              <Image
                src={images.aboutTeam}
                alt="Zed OS Technologies team collaborating"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="text-center">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
              Leadership
            </span>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">Meet the Director</h2>
          </Reveal>

          <Reveal delay={120} className="mx-auto mt-12 max-w-5xl border-y border-white/15 py-8 md:py-12">
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
                <h3 className="text-3xl font-light tracking-[-0.04em] text-white md:text-4xl">Lennox Lewis Odhiambo</h3>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-white/50">Founder &amp; Director</p>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
                  Lennox Lewis Odhiambo is a highly motivated and visionary Director, full stack developer, and certified ML engineer with a background in supply chain management and business consultation. Under his leadership, Zed OS Technologies delivers reliable, high-quality products and digital solutions with a commitment to excellence and innovation.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="text-center">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
              What Drives Us
            </span>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">Our Core Values</h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 90}>
                <div className="h-full py-8 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0">
                  <h3 className="text-3xl font-light tracking-[-0.04em] text-white">{value.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/65">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
