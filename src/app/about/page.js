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

const strengths = [
  'Broad supplier network',
  'Reliable and well-maintained fleet',
  'Professional and experienced team',
  'Competitive pricing',
  '24/7 customer support',
]

function StrengthIcon() {
  return (
    <svg className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="WHO WE ARE"
        title="About Zed OS Technologies"
        subtitle="Integrity. Innovation. Excellence."
        backgroundImage={images.pageHeroBg}
      />

      <section className="bg-brand-base py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="text-brand-muted leading-relaxed">
              Zed OS Technologies Limited is a registered Kenyan company based in Kisumu Town West,
              specializing in General Supplies and Consultancy Services. The company was established
              to provide reliable, efficient, and professional solutions to individuals, private sector
              organizations, NGOs, and government institutions.
            </p>
            <p className="text-brand-muted mt-4 leading-relaxed">
              We pride ourselves on integrity, innovation, and customer satisfaction. Our operations
              are guided by a commitment to quality service delivery, timely execution, and value for
              money.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative h-80 rounded-xl overflow-hidden">
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

      <section className="bg-brand-deep py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center">
            <p className="text-brand-accent text-xs uppercase tracking-widest">Leadership</p>
            <h2 className="text-3xl font-bold text-white mt-3">Meet the Director</h2>
          </Reveal>

          <Reveal delay={120} className="bg-brand-card rounded-xl p-8 md:p-10 max-w-4xl mx-auto mt-10">
            <div className="grid grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] gap-8 items-start">
              <div className="relative w-full h-96 md:h-[420px] rounded-xl overflow-hidden bg-transparent">
                <Image
                  src={images.director}
                  alt="Lennox Lewis Odhiambo, Founder and Director"
                  fill
                  className="object-contain p-0"
                  sizes="(max-width: 768px) 100vw, 340px"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Lennox Lewis Odhiambo</h3>
                <p className="text-brand-accent mt-1">Founder &amp; Director</p>
                <p className="text-brand-muted mt-6 leading-relaxed">
                  Lennox Lewis Odhiambo is a highly motivated and visionary Director with an excellent
                  background in supply chain management and business consultation. Under his leadership,
                  Zed OS Technologies Limited has grown steadily, establishing itself as a reliable
                  partner in delivering high-quality products and services. His commitment to excellence
                  and innovation drives the company&apos;s mission to provide solutions that meet and exceed
                  customer expectations. With deep understanding of market dynamics, operational efficiency,
                  and client relations, Lennox ensures every project is executed with precision and
                  professionalism.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-brand-base py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center">
            <p className="text-brand-accent text-xs uppercase tracking-widest">What Drives Us</p>
            <h2 className="text-3xl font-bold text-white mt-3">Our Core Values</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 90}>
                <div className="bg-brand-card rounded-xl p-8 h-full">
                  <h3 className="text-white font-bold text-xl">{value.title}</h3>
                  <p className="text-brand-muted text-sm mt-4 leading-relaxed">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-deep py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-white">Key Strengths</h2>
            <ul className="mt-10 space-y-4">
              {strengths.map((strength) => (
                <li key={strength} className="flex items-start gap-3">
                  <StrengthIcon />
                  <span className="text-brand-muted">{strength}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative h-72 rounded-xl overflow-hidden">
              <Image
                src={images.aboutOffice}
                alt="Professional office environment"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
