/*
 * The services, in the order the index lists them and the order "Next service" walks through them
 * (the last one leads back to the first). Photos are in public/images/service-pages, named
 * <slug>-<role>.jpg, from Unsplash (free under the Unsplash License). The exceptions are the site's
 * own photos: vehicle-hire-gallery-1 (carhire.jpg), vehicle-hire-wide-pickup (Vehicle_hire.jpg),
 * ai-ml-hero-meditation (AI and ML.jpg), and every file ending in -own: the consultancy and
 * data-analytics heroes, challenges and approaches, all six conference-facilities photos, and the
 * general-supplies hero (converted to black and white). The rest share one colour grade (saturation
 * at 82%). Each sits on a section of matching tone: dark photos on the dark bands, light ones on the
 * light.
 *
 * Everything here comes from what the site already says about each service. There are no figures or
 * client names, because none have been confirmed: add them only once they're real.
 */

const photos = (slug) => ({
  hero: `/images/service-pages/${slug}-hero.jpg`,
  challenge: `/images/service-pages/${slug}-challenge.jpg`,
  approach: `/images/service-pages/${slug}-approach.jpg`,
  gallery: [`/images/service-pages/${slug}-gallery-1.jpg`, `/images/service-pages/${slug}-gallery-2.jpg`],
  wide: `/images/service-pages/${slug}-wide.jpg`,
})

const LOCATION = 'Kisumu, Kenya'
const COVERAGE = 'Kenya | East Africa'

export const services = [
  {
    slug: 'general-supplies',
    title: 'General Supplies',
    tags: ['Procurement', 'Supplies'],
    photos: { ...photos('general-supplies'), hero: '/images/service-pages/general-supplies-hero-own-bw.jpg' },
    tagline: 'Everything an organisation runs on, delivered reliably.',
    intro: [
      'Office stationery, ICT equipment, ergonomic furniture, cleaning materials, electrical fittings and certified safety gear, sourced and delivered by one supplier.',
      'We supply offices, institutions and organisations of every size, so the essentials are there when the work needs them.',
    ],
    details: [
      ['Category', 'Procurement | Supplies'],
      ['Includes', 'Stationery | ICT | Furniture | Cleaning | Electrical | PPE'],
      ['For', 'Offices | Institutions | Organisations'],
      ['Location', LOCATION],
      ['Coverage', COVERAGE],
    ],
    challenge: {
      statement: 'Many suppliers. Many invoices. Something always missing.',
      body: 'Buying from a different vendor for every category means more orders to track, more invoices to reconcile, and more chances for something important to arrive late.',
    },
    approach: {
      statement: 'One supplier for the whole list, delivered on time.',
      body: 'We source across every category and deliver together, with one point of contact from the quote to the delivery note. Quality, timeliness and value stay at the heart of every order.',
    },
    results: {
      items: [
        ['Sourcing', 'Trusted suppliers across every category'],
        ['Delivery', 'To your offices and sites'],
        ['Contact', 'One point of contact, quote to delivery'],
      ],
      cards: [
        ['One', 'Supplier for every category'],
        ['End to end', 'From quote to delivery note'],
        ['Certified', 'Safety gear and PPE'],
      ],
    },
  },
  {
    slug: 'vehicle-hire',
    title: 'Vehicle Hire',
    tags: ['Fleet', 'Transport'],
    photos: { ...photos('vehicle-hire'), wide: '/images/service-pages/vehicle-hire-wide-pickup.jpg' },
    // The chauffeur stands at the far left of the photo; a centred crop would cut him out.
    heroFocus: '0% 50%',
    tagline: 'Well-maintained vehicles with professional drivers.',
    intro: [
      'Saloons, SUVs and minibuses for corporate transfers, conferences, events and field operations.',
      'Every vehicle is well maintained and comes with a professional driver, so your team arrives on time and your operations keep moving.',
    ],
    details: [
      ['Category', 'Fleet | Transport'],
      ['Vehicles', 'Saloons | SUVs | Minibuses'],
      ['For', 'Corporate transfers | Conferences | Events | Field operations'],
      ['Location', LOCATION],
      ['Coverage', COVERAGE],
    ],
    challenge: {
      statement: 'People, places and schedules that all have to line up.',
      body: 'Transfers, conference shuttles and field trips depend on vehicles that are ready, roadworthy and on time. One late car can hold up a whole day.',
    },
    approach: {
      statement: 'The right vehicle and a professional driver, every time.',
      body: 'We match the vehicle to the job, keep the fleet well maintained, and provide professional drivers who know the routes. You plan the day; we handle the getting there.',
    },
    results: {
      items: [
        ['Fleet', 'Saloons, SUVs and minibuses'],
        ['Drivers', 'Professional drivers with every vehicle'],
        ['Use', 'Transfers, conferences, events and field work'],
      ],
      cards: [
        ['Driven', 'Professional drivers included'],
        ['Maintained', 'Well-kept vehicles'],
        ['Flexible', 'Corporate, event and field use'],
      ],
    },
  },
  {
    slug: 'conference-facilities',
    title: 'Conference Facilities',
    tags: ['Facilities', 'Events'],
    photos: {
      hero: '/images/service-pages/conference-facilities-hero-own.jpg',
      challenge: '/images/service-pages/conference-facilities-challenge-own.jpg',
      approach: '/images/service-pages/conference-facilities-approach-own.jpg',
      gallery: [
        '/images/service-pages/conference-facilities-gallery-1-own.jpg',
        '/images/service-pages/conference-facilities-gallery-2-own.jpg',
      ],
      wide: '/images/service-pages/conference-facilities-wide-own.jpg',
    },
    tagline: 'Fully equipped spaces for meetings, training and events.',
    intro: [
      'Meeting halls with audio-visual setup, high-speed connectivity and catering coordination, ready for meetings, workshops, training sessions and corporate events.',
      'We look after the room and the details, so the event can focus on its agenda.',
    ],
    details: [
      ['Category', 'Facilities | Events'],
      ['Includes', 'Audio-visual | Connectivity | Catering coordination'],
      ['For', 'Meetings | Workshops | Training | Corporate events'],
      ['Location', LOCATION],
      ['Coverage', COVERAGE],
    ],
    challenge: {
      statement: 'A great agenda can still be undone by the room.',
      body: 'A projector that will not connect, a network that drops, or lunch that arrives late: small failures that take attention away from the people you brought together.',
    },
    approach: {
      statement: 'A ready room, working tech and catering handled.',
      body: 'We prepare the space, test the audio-visual setup and connectivity before anyone arrives, and coordinate catering around your schedule.',
    },
    results: {
      items: [
        ['Spaces', 'Meeting halls for groups of different sizes'],
        ['Technology', 'Audio-visual setup and high-speed connectivity'],
        ['Hospitality', 'Catering coordination'],
      ],
      cards: [
        ['Equipped', 'Audio-visual and connectivity'],
        ['Hosted', 'Catering coordinated'],
        ['Versatile', 'Meetings to corporate events'],
      ],
    },
  },
  {
    slug: 'consultancy',
    title: 'Consultancy',
    tags: ['Advisory', 'Supply Chain'],
    photos: {
      ...photos('consultancy'),
      hero: '/images/service-pages/consultancy-hero-own.jpg',
      challenge: '/images/service-pages/consultancy-challenge-own.jpg',
      approach: '/images/service-pages/consultancy-approach-own.jpg',
    },
    tagline: 'Advice on procurement, vendors and operations.',
    intro: [
      'Our consultancy practice advises on procurement strategy, vendor ecosystems and business process optimisation.',
      'We work with institutions, corporations and NGOs, drawing on the same supply chain and operations experience we use in our own delivery.',
    ],
    details: [
      ['Category', 'Advisory | Supply Chain'],
      ['Areas', 'Procurement strategy | Vendor ecosystems | Process optimisation'],
      ['For', 'Institutions | Corporations | NGOs'],
      ['Location', LOCATION],
      ['Coverage', COVERAGE],
    ],
    challenge: {
      statement: 'Processes that grew over time rather than by design.',
      body: 'Procurement rules, vendor lists and operating processes tend to build up piece by piece. The result is often slower, costlier and harder to manage than it needs to be.',
    },
    approach: {
      statement: 'Practical advice from people who run supply chains.',
      body: 'We review how things work today, map the vendors and processes involved, and recommend clear changes that fit your organisation and its rules.',
    },
    results: {
      items: [
        ['Strategy', 'Procurement strategy'],
        ['Vendors', 'Vendor ecosystem reviews'],
        ['Operations', 'Business process optimisation'],
      ],
      cards: [
        ['Practical', 'Advice from operators'],
        ['Tailored', 'For institutions, corporates and NGOs'],
        ['Partnered', 'From review to change'],
      ],
    },
  },
  {
    slug: 'software-systems',
    title: 'Software Systems',
    tags: ['Software', 'Web'],
    photos: photos('software-systems'),
    tagline: 'Custom systems and web platforms built around your operations.',
    intro: [
      'Internal business tools, inventory tracking, role-based dashboards and high-performance corporate web platforms.',
      'We build the systems your team uses every day, and the websites that present your brand, services and operations clearly.',
    ],
    details: [
      ['Category', 'Software | Web'],
      ['Includes', 'Business tools | Inventory tracking | Dashboards | Websites'],
      ['For', 'Organisations ready to replace manual work'],
      ['Location', LOCATION],
      ['Coverage', COVERAGE],
    ],
    challenge: {
      statement: 'Spreadsheets and paper doing the work of a system.',
      body: 'When stock, orders and approvals live in spreadsheets and inboxes, information goes missing, work gets repeated and nobody has the full picture.',
    },
    approach: {
      statement: 'Software shaped around how your team actually works.',
      body: 'We design and build custom systems, workflow tools and internal platforms that remove manual friction, plus modern, responsive websites for the people outside.',
    },
    results: {
      items: [
        ['Systems', 'Internal tools and inventory tracking'],
        ['Dashboards', 'Role-based dashboards'],
        ['Web', 'Responsive corporate websites'],
      ],
      cards: [
        ['Custom', 'Built around your workflow'],
        ['Role-based', 'Dashboards for every team'],
        ['Responsive', 'Websites on every screen'],
      ],
    },
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics',
    tags: ['Data', 'Dashboards'],
    photos: {
      ...photos('data-analytics'),
      hero: '/images/service-pages/data-analytics-hero-own.jpg',
      challenge: '/images/service-pages/data-analytics-challenge-own.jpg',
      approach: '/images/service-pages/data-analytics-approach-own.jpg',
    },
    tagline: 'Turn operational data into decisions.',
    intro: [
      'We turn raw operational data into executive dashboards, trend forecasting and reporting.',
      'Teams get the insight they need to make faster, better-informed decisions, without digging through exports.',
    ],
    details: [
      ['Category', 'Data | Dashboards'],
      ['Includes', 'KPI dashboards | Trend forecasting | Reporting'],
      ['For', 'Leadership and operations teams'],
      ['Location', LOCATION],
      ['Coverage', COVERAGE],
    ],
    challenge: {
      statement: 'Plenty of data. Very little insight.',
      body: 'Most organisations already collect the numbers they need. They sit in separate systems and spreadsheets, so answering a simple question takes days.',
    },
    approach: {
      statement: 'Clear dashboards on the numbers that matter.',
      body: 'We bring the data together, agree the KPIs with you, and build dashboards and reports that show where things stand and where they are heading.',
    },
    results: {
      items: [
        ['Dashboards', 'Executive and KPI dashboards'],
        ['Forecasting', 'Trend forecasting'],
        ['Reporting', 'Regular, readable reports'],
      ],
      cards: [
        ['Clear', 'KPIs everyone can read'],
        ['Forward', 'Trend forecasting'],
        ['Faster', 'Decisions on current data'],
      ],
    },
  },
  {
    slug: 'ai-ml',
    title: 'AI & ML',
    tags: ['AI', 'Automation'],
    photos: { ...photos('ai-ml'), hero: '/images/service-pages/ai-ml-hero-meditation.jpg' },
    tagline: 'Practical AI for automation, analysis and productivity.',
    intro: [
      'AI-driven process automation, predictive analysis models and intelligent workflows tailored to your sector.',
      'We focus on practical uses that save time and improve decisions, built on the data and systems you already have.',
    ],
    details: [
      ['Category', 'AI | Automation'],
      ['Includes', 'Process automation | Predictive models | Intelligent workflows'],
      ['For', 'Teams with repetitive or data-heavy work'],
      ['Location', LOCATION],
      ['Coverage', COVERAGE],
    ],
    challenge: {
      statement: 'Repetitive work that keeps good people busy.',
      body: 'Sorting documents, checking records and preparing the same reports by hand takes hours that could go to work only people can do.',
    },
    approach: {
      statement: 'AI applied where it clearly earns its place.',
      body: 'We find the tasks where automation or prediction makes a real difference, then build workflows that fit your systems and keep people in control.',
    },
    results: {
      items: [
        ['Automation', 'AI-driven process automation'],
        ['Prediction', 'Predictive analysis models'],
        ['Workflows', 'Intelligent workflows for your sector'],
      ],
      cards: [
        ['Practical', 'Uses that save real time'],
        ['Predictive', 'Models on your data'],
        ['Tailored', 'Built for your sector'],
      ],
    },
  },
]

export const serviceTags = [...new Set(services.flatMap((service) => service.tags))].sort()

export function getService(slug) {
  return services.find((service) => service.slug === slug) ?? null
}

/** The service after this one, wrapping from the last back to the first. */
export function getNextService(slug) {
  const index = services.findIndex((service) => service.slug === slug)
  return services[(index + 1) % services.length]
}
