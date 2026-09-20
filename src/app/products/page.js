import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import ScrollReveal from '@/components/ScrollReveal'
import { images } from '@/data/images'

const categories = [
  {
    title: 'Office Supplies',
    image: images.products.office,
    alt: 'Office stationery and supplies',
    description:
      'Stationery, pens, notebooks, paper, binders, filing systems, stamps, and all office consumables.',
  },
  {
    title: 'ICT Equipment',
    image: images.products.ict,
    alt: 'Modern ICT and software development workspace',
    description:
      'Laptops, desktops, printers, scanners, networking equipment, cables, and accessories.',
  },
  {
    title: 'Furniture & Fittings',
    image: images.products.furniture,
    alt: 'Office furniture and fittings',
    description:
      'Office chairs, desks, cabinets, shelving units, reception furniture, and custom fittings.',
  },
  {
    title: 'Cleaning & Hygiene',
    image: images.products.cleaning,
    alt: 'Cleaning and hygiene products',
    description:
      'Detergents, disinfectants, mops, bins, tissue paper, hand sanitizers, and janitorial supplies.',
  },
  {
    title: 'Protective Wear',
    image: images.products.protective,
    alt: 'Protective wear and safety equipment',
    description:
      'Safety boots, helmets, reflector jackets, gloves, goggles, overalls, and PPE kits.',
  },
  {
    title: 'Electrical & Lighting',
    image: images.products.electrical,
    alt: 'Electrical and lighting supplies',
    description:
      'Bulbs, extension cords, switches, sockets, wiring materials, and backup power solutions.',
  },
]

export default function ProductsPage() {
  return (
    <>
      <PageHero
        label="PRODUCT CATALOGUE"
        title="Our Products"
        subtitle="Quality goods sourced and delivered to your doorstep."
      />

      <section className="bg-black px-5 pb-8 pt-10 text-center md:px-8 md:pb-12 md:pt-14">
        <ScrollReveal className="mx-auto max-w-3xl">
          <p className="text-base leading-relaxed text-white/65 md:text-lg">
            At Zed OS Technologies Limited, we supply a wide range of quality products to businesses,
            institutions, NGOs, and government organizations across Kenya. All products are sourced
            from trusted suppliers and delivered with speed and reliability.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-black px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <ScrollReveal
              key={category.title}
              delay={index * 90}
              className="group flex h-full flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-neutral-900">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-grow flex-col pt-5">
                <div>
                  <h3 className="text-2xl font-medium tracking-[-0.03em] text-white">{category.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{category.description}</p>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs font-medium text-white/70">
                  <span>Inquire now</span><span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-black px-5 py-20 text-center md:px-8 md:py-28">
        <ScrollReveal className="mx-auto max-w-3xl border-y border-white/15 py-14 text-white md:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">Procurement, made simple</p>
          <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] md:text-6xl">Need a Custom Quote?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/65">
            Can&apos;t find what you need? We source on demand. Get in touch and we&apos;ll handle the
            procurement for you.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            Request a Quote
          </Link>
        </ScrollReveal>
      </section>
    </>
  )
}
