// Content for the Products page. Category photos are the site's own (public/images/product-*.jpg).

import { images } from './images'

export const productsHero = {
  label: 'Product catalogue',
  place: 'Kisumu, Kenya',
  title: 'PRODUCTS',
  tagline: 'Quality goods, sourced with care and delivered to your door.',
}

export const productsStatement = {
  parts: [
    'Quality products for ',
    { hl: 'businesses,' },
    ' institutions, NGOs and ',
    { hl: 'government' },
    ' across Kenya and East Africa. Sourced from ',
    { hl: 'trusted suppliers,' },
    ' delivered ',
    { hl: 'reliably.' },
  ],
}

export const categories = [
  {
    id: 'office',
    title: 'Office Supplies',
    image: { src: images.products.office, alt: 'Office stationery and supplies' },
    description: 'Everything a busy office gets through, from paper to filing.',
    items: ['Stationery', 'Pens', 'Notebooks', 'Paper', 'Binders', 'Filing systems', 'Stamps', 'Consumables'],
  },
  {
    id: 'ict',
    title: 'ICT Equipment',
    image: { src: images.products.ict, alt: 'A modern ICT workspace' },
    description: 'Computers, printing and networking for teams of any size.',
    items: ['Laptops', 'Desktops', 'Printers', 'Scanners', 'Networking', 'Cables', 'Accessories'],
  },
  {
    id: 'furniture',
    title: 'Furniture & Fittings',
    image: { src: images.products.furniture, alt: 'Office furniture and fittings' },
    description: 'Workspaces and reception areas, furnished and fitted.',
    items: ['Office chairs', 'Desks', 'Cabinets', 'Shelving', 'Reception furniture', 'Custom fittings'],
  },
  {
    id: 'cleaning',
    title: 'Cleaning & Hygiene',
    image: { src: images.products.cleaning, alt: 'Cleaning and hygiene products' },
    description: 'Keep every space clean, safe and stocked.',
    items: ['Detergents', 'Disinfectants', 'Mops', 'Bins', 'Tissue paper', 'Hand sanitiser', 'Janitorial supplies'],
  },
  {
    id: 'protective',
    title: 'Protective Wear',
    image: { src: images.products.protective, alt: 'Protective wear and safety equipment' },
    description: 'Safety gear for sites, workshops and field teams.',
    items: ['Safety boots', 'Helmets', 'Reflector jackets', 'Gloves', 'Goggles', 'Overalls', 'PPE kits'],
  },
  {
    id: 'electrical',
    title: 'Electrical & Lighting',
    image: { src: images.products.electrical, alt: 'Electrical and lighting supplies' },
    description: 'Power, wiring and lighting, including backup power.',
    items: ['Bulbs', 'Extension cords', 'Switches', 'Sockets', 'Wiring', 'Backup power'],
  },
]

export const process = [
  { title: 'Request', text: 'Tell us what you need: the items, the quantities and where they are going.' },
  { title: 'Source', text: 'We source from trusted suppliers and confirm pricing and timelines with you.' },
  { title: 'Deliver', text: 'We deliver to your door, with clear communication from dispatch to drop-off.' },
  { title: 'Reorder', text: 'Need more? Repeat orders are one message away.' },
]

export const productsCta = {
  label: '(Ready to order?)',
  before: 'Fill your ',
  highlight: 'crate',
  note: 'Can’t find what you need? We source on demand — tell us in your quote.',
}
