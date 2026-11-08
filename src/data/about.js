// Content for the About page. Photos are from Unsplash (free under the Unsplash License), saved in
// public/images/about. Sources are https://images.unsplash.com/photo-<id>

const img = {
  savanna: { src: '/images/about/savanna.jpg', alt: 'Savanna with Mount Kilimanjaro on the horizon' }, // 1489392191049-fc10c97e64b6
  planning: { src: '/images/about/planning.jpg', alt: 'A team planning a project with sticky notes on a wall' }, // 1552664730-d307ca884978
  handover: { src: '/images/about/handover.jpg', alt: 'A parcel being handed over on delivery' }, // 1566576721346-d4a3b4eaeb55
  truckRoad: { src: '/images/about/truck-road.jpg', alt: 'A delivery truck on an open highway' }, // 1519003722824-194d4455a60c
  lecture: { src: '/images/about/lecture.jpg', alt: 'Students following a lesson in a lecture room' }, // 1524178232363-1fb2b075b655
  classroom: { src: '/images/about/classroom.jpg', alt: 'A teacher leading a class of students' }, // 1509062522246-3755977927d7
  office: { src: '/images/about/office.jpg', alt: 'A bright, empty office corridor' }, // 1497366216548-37526070297c
  warehouse: { src: '/images/about/warehouse.jpg', alt: 'Shelves of boxed supplies in a warehouse' }, // 1586528116311-ad8dd3c8310d
  driving: { src: '/images/about/driving.jpg', alt: 'A driver at the wheel on an evening drive' }, // 1449965408869-eaa3f722e40d
  vanRoad: { src: '/images/about/van-road.jpg', alt: 'A van on a desert road trip' }, // 1469854523086-cc02fe5d8800
  acacia: { src: '/images/about/acacia.jpg', alt: 'An acacia tree on the savanna at sunset' }, // 1516026672322-bc52d61a55d5
  teamLaptops: { src: '/images/about/team-laptops.jpg', alt: 'A team working together on laptops' }, // 1522071820081-009f0129c71c
  teamDesk: { src: '/images/about/team-desk.jpg', alt: 'Colleagues reviewing work on a laptop' }, // 1531545514256-b1400bc00f31
  meeting: { src: '/images/about/meeting.jpg', alt: 'Hands and laptops around a meeting table' }, // 1517245386807-bb43f82c33c4
}

// Hero deck, dealt out into a row on scroll. The middle one sits on top of the stack.
export const heroImages = [img.planning, img.handover, img.savanna, img.lecture, img.driving]

export const intro =
  'Zed OS Technologies Limited is a registered Kenyan company based in Kisumu Town West. We bring reliable general supplies, vehicle hire and conference facilities together with software, websites, data and AI, and today serve more than 50 clients across East Africa.'

// The eight core services, as the company profile lists them.
export const services = [
  'General Supplies',
  'Vehicle Hire',
  'Conference Facilities',
  'Consultancy',
  'Software Systems',
  'Websites',
  'Data Analytics',
  'AI & ML',
]

// The company's mission, from its profile.
export const statement = {
  label: '(Our mission)',
  // Each part is either plain text or { hl: text } for a highlighted phrase.
  parts: [
    'To deliver ',
    { hl: 'quality supplies,' },
    ' ',
    { hl: 'dependable digital systems' },
    ' and seamless support, from Kisumu to ',
    { hl: 'everywhere' },
    ' you need to be.',
  ],
  by: 'Zed OS Technologies Limited',
}

export const story = {
  title: 'Our story',
  lead: 'From a Kisumu start-up to a partner for schools, agencies and travellers.',
  chapters: [
    {
      when: '2024',
      title: 'Founded in Kisumu',
      text: 'Zed OS Technologies Limited was set up in Kisumu to bring dependable supplies and modern technology to Kenyan organisations under one roof.',
      images: [img.planning, img.office],
    },
    {
      when: 'Late 2025',
      title: 'Our first delivery',
      text: 'We completed our first delivery and supply job, the start of a track record built on getting the right goods to the right place, on time.',
      images: [img.handover, img.warehouse],
    },
    {
      when: 'Today',
      title: 'Systems for schools',
      text: 'We work with school institutions to build project management systems that keep their teams, timelines and resources organised.',
      images: [img.lecture, img.classroom],
    },
    {
      when: 'Today',
      title: 'Delivery for Kenyan agencies',
      text: 'Kenyan agencies trust us with their delivery works, with clear communication from dispatch to drop-off.',
      images: [img.truckRoad],
    },
    {
      when: 'Today',
      title: 'Travel & car hire',
      text: 'We provide travel and car hire services, with well-kept vehicles for business trips and everyday journeys.',
      images: [img.driving, img.vanRoad],
    },
  ],
  // The company's vision, from its profile.
  callout: 'To be East Africa’s most trusted single partner for supplies, digital systems and operational support.',
}

export const oval = { image: img.acacia, top: 'From Kisumu', bottom: 'Across East Africa' }

export const values = [
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
    title: 'Satisfaction',
    description:
      'We put our clients’ needs first, with personalised solutions, timely execution and value for money.',
  },
]

export const gallery = [img.teamLaptops, img.savanna, img.warehouse, img.meeting, img.vanRoad, img.teamDesk, img.classroom]

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/zedostechnologies?igsh=MXFyamJ2NjFvY2F0eQ==' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zedos-technologies-576bb3414' },
  { label: 'X', href: 'https://x.com/zedostechnology' },
]
