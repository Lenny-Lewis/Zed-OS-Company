import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import Reveal from '@/components/Reveal'

const stats = [
  { value: '24/7', label: 'Customer Support' },
  { value: '100%', label: 'Quality Assured' },
  { value: '5+', label: 'Years Experience' },
  { value: '50+', label: 'Clients Served' },
]

export default function HomeAbout() {
  return (
    <section className="bg-black px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
            About Us
          </span>
          <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            Built on Trust. <br className="hidden sm:block" />Driven by Excellence.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            Zed OS Technologies Limited is a registered Kenyan company based in Kisumu Town West,
            specializing in General Supplies, Software Systems, Websites, Data Analytics, AI,
            Machine Learning, and Consultancy Services. We deliver reliable, efficient, and
            professional solutions to individuals, private sector organizations, NGOs, and
            government institutions.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            Our operations are guided by integrity, innovation, and customer satisfaction — with
            a commitment to quality service delivery, timely execution, and value for money.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            <span>Learn More</span>
            <span className="text-lg">→</span>
          </Link>
        </Reveal>

        <Reveal delay={120} className="space-y-7">
          <div className="relative h-64 overflow-hidden md:h-80">
            <Image
              src={images.aboutOffice}
              alt="Modern office workspace"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-2 border-t border-white/15 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-b border-r border-white/15 px-3 py-5 text-center last:border-r-0 sm:border-b-0"
              >
                <p className="text-2xl font-light tracking-[-0.04em] text-white md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
