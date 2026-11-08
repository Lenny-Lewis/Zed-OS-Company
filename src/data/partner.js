// Content for the Partner page. Photos are the site's own or from Unsplash (free under the Unsplash
// License); see src/data/about.js for their sources.

export const partnerHero = {
  label: 'Work with us',
  place: 'Kisumu, Kenya',
  title: 'PARTNER',
  subtitle: 'Build a lasting business relationship with Zed OS Technologies.',
  locked: 'Two sides. One standard.',
}

export const partnerStatement = {
  // Each part is either plain text or { hl: text } for a highlighted phrase.
  parts: [
    'We build ',
    { hl: 'relationships,' },
    ' not just transactions. Partnerships built on ',
    { hl: 'mutual value,' },
    ' ',
    { hl: 'reliability' },
    ' and ',
    { hl: 'shared growth.' },
  ],
}

// Marquee words: who we partner with.
export const partnerCategories = ['Schools', 'Kenyan Agencies', 'Government', 'NGOs', 'Private Sector', 'Suppliers', 'Individuals']

export const reasons = [
  {
    title: 'Reliable',
    description: 'We show up, deliver, and follow through — every single time.',
  },
  {
    title: 'Flexible',
    description: 'We adapt our terms, timelines, and scope to match your operational needs.',
  },
  {
    title: 'Ethical',
    description: 'All partnerships are governed by transparency, integrity, and professional standards.',
  },
  {
    title: 'Growth-minded',
    description: 'We grow with our partners, investing in relationships that create long-term value.',
  },
]

export const audiences = [
  {
    title: 'Schools',
    description: 'Project management systems and dependable supplies for schools and learning institutions.',
    image: { src: '/images/about/classroom.jpg', alt: 'A teacher leading a class of students' },
  },
  {
    title: 'Government & agencies',
    description: 'Tendering, supply and delivery partnerships with national and county government bodies and Kenyan agencies.',
    image: { src: '/images/about/truck-road.jpg', alt: 'A delivery truck on an open highway' },
  },
  {
    title: 'NGOs',
    description: 'Procurement support and logistics for NGOs and development organisations operating across Kenya.',
    image: { src: '/images/about/team-laptops.jpg', alt: 'A team working together on laptops' },
  },
  {
    title: 'Private sector',
    description: 'Supply chain and consultancy partnerships with businesses of all sizes.',
    image: { src: '/images/about/meeting.jpg', alt: 'Hands and laptops around a meeting table' },
  },
  {
    title: 'Individuals',
    description: 'Personalised supply, travel and car hire solutions for individuals and entrepreneurs.',
    // Unsplash 1531123897727-8f129e1688ce
    image: { src: '/images/about/individual.jpg', alt: 'Portrait of a confident young professional woman' },
  },
]

export const partnerForm = {
  label: '(Partner with Zed OS)',
  title: 'Start a conversation',
  note: 'Fill in the form and our team will reach out within 24 hours.',
  types: ['Supplier', 'Corporate Client', 'NGO', 'Government', 'Other'],
}
