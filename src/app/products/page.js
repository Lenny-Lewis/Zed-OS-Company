import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
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
    alt: 'ICT equipment and laptops',
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
        backgroundImage={images.pageHeroBg}
      />

      <section className="bg-brand-base py-16 px-6">
        <p className="text-brand-muted text-center max-w-3xl mx-auto leading-relaxed">
          At Zed OS Technologies Limited, we supply a wide range of quality products to businesses,
          institutions, NGOs, and government organizations across Kenya. All products are sourced
          from trusted suppliers and delivered with speed and reliability.
        </p>
      </section>

      <section className="bg-brand-deep py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="bg-brand-card rounded-xl overflow-hidden border-t-4 border-brand-primary hover:border-brand-accent transition-colors duration-200"
            >
              <div className="relative h-48">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-8">
                <h3 className="text-white font-bold text-xl">{category.title}</h3>
                <p className="text-brand-muted text-sm mt-4 leading-relaxed">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-primary py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-white">Need a Custom Quote?</h2>
        <p className="text-white/80 mt-4 max-w-xl mx-auto">
          Can&apos;t find what you need? We source on demand. Get in touch and we&apos;ll handle the
          procurement for you.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-8 bg-white text-brand-primary hover:bg-brand-accent hover:text-white px-8 py-3 rounded font-semibold transition-colors duration-200"
        >
          Request a Quote
        </Link>
      </section>
    </>
  )
}
