// Content for the home page sections between the hero and the footer (the hero and the factory have
// their own). Facts and figures come from the company profile (2026) and what the client has
// confirmed; nothing else is claimed. Other photos are from Unsplash (see src/data/about.js).
//
// "Who we are" photos (public/images/home), from Unsplash and converted to black and white, like
// good-fella's studio shots: who-wall-bw (1488161628813-04466f872be2), who-laptop-bw
// (1496181133206-80ce9b88a853), who-meeting-bw (1521737604893-d14cc237f11d) and who-hands-bw
// (1600880292089-90a7e086ee0c, a team clasping hands).

// Cards under the hero: one photo, three facts that roll up.
export const cards = {
  media: { src: '/images/about/team-desk.jpg', alt: 'Colleagues reviewing work together on a laptop' },
  stats: [
    { value: 50, suffix: '+', text: 'Clients served across East Africa' },
    { value: 8, suffix: '', text: 'Core services, one partner' },
    { value: 24, suffix: '/7', text: 'Customer support' },
  ],
}

// Four services, shown like a portfolio, in this order. Titles, tags and photos come from
// src/data/services.js; "View all" leads to the rest.
export const featured = {
  slugs: ['data-analytics', 'conference-facilities', 'consultancy', 'general-supplies'],
  title: 'What we do.',
  text: 'Supplies, systems and insight for organisations across Kenya and East Africa.\nOne partner for all of it.',
  viewAll: { href: '/services', label: 'View all' },
  cursor: 'VIEW SERVICE',
}

// The six promises from the company profile.
export const standards = {
  title: 'The standards we uphold.',
  label: '// Our promises',
  sublabel: 'Every client, the same standard.',
  items: [
    { title: 'Quality assurance.', text: 'Goods, services and systems of the highest quality, meeting or exceeding what our clients expect.' },
    { title: 'Reliability.', text: 'Supplies, vehicles, conference facilities and digital systems that are dependable, timely and consistent.' },
    { title: 'Customer satisfaction.', text: 'Your needs come first, with personalised solutions built around them.' },
    { title: 'Professionalism.', text: 'Every interaction with our team is conducted with integrity and respect.' },
    { title: 'Innovation.', text: 'We keep improving and adapting our services as markets and client needs change.' },
    { title: 'Value for money.', text: 'Competitive pricing and cost-effective solutions, without compromising on quality or service.' },
  ],
}

export const contact = {
  title: 'Start a project.',
  image: { src: '/images/about/planning.jpg', alt: 'A team planning a project with sticky notes on a wall' },
  lead: 'Call, WhatsApp or send us a message. We read everything.',
  email: 'lennoxlewis.lenny@gmail.com',
  phone: '+254 758 296 887',
  where: 'Kisumu Town West, Kenya. P.O. Box 2371-40100, Kisumu.',
  link: { href: '/contact', label: 'Get in touch' },
  whatsapp: { href: 'https://wa.me/254758296887', label: 'Chat on WhatsApp' },
  note: 'Reliable solutions. Lasting partnerships.',
}

export const whoWeAre = {
  label: '// About us',
  title: 'Who we are.',
  link: { href: '/about', label: 'More about us' },
  items: [
    {
      title: 'Rooted in Kisumu.',
      text: 'A registered Kenyan company based in Kisumu Town West, serving more than 50 clients across East Africa.',
      image: { src: '/images/home/who-wall-bw.jpg', alt: 'A young man in a dark jacket sitting on a white wall' },
    },
    {
      title: 'One partner, two worlds.',
      text: 'Supplies, vehicle hire and conference facilities on one side; software, websites, data and AI on the other. One team handles both.',
      image: { src: '/images/home/who-laptop-bw.jpg', alt: 'A black laptop on a desk against a white wall' },
    },
    {
      title: 'Trusted where it counts.',
      text: 'Individuals, private sector organisations, NGOs and government institutions rely on us, from schools to Kenyan agencies.',
      image: { src: '/images/home/who-meeting-bw.jpg', alt: 'A team working around a meeting table' },
    },
    {
      title: 'Led by our values.',
      text: 'Integrity, innovation and customer satisfaction, with quality service, timely execution and value for money.',
      image: { src: '/images/home/who-hands-bw.jpg', alt: 'A team clasping hands together' },
    },
  ],
}

export const faqs = {
  title: 'Common questions',
  items: [
    {
      q: 'What does Zed OS Technologies do?',
      a: 'Eight core services under one roof: general supplies, vehicle hire, conference facilities, consultancy, software systems, websites, data analytics, and AI and machine learning.',
    },
    {
      q: 'Where are you based, and where do you work?',
      a: 'We are based in Kisumu Town West and serve more than 50 clients across Kenya and East Africa. Tell us where you are in your request and we will confirm the details for your location.',
    },
    {
      q: 'How do I request a quote?',
      a: 'Add what you need to a quote on the Products page, use the partner form, or message us on WhatsApp. Our customer support is available 24/7.',
    },
    {
      q: 'Can you source items that are not in your catalogue?',
      a: 'Yes. Through our broad and trusted supplier network we source on demand: describe the item, the quantity and where it needs to go.',
    },
    {
      q: 'Is vehicle hire short-term or long-term?',
      a: 'Both. Our reliable, well-maintained vehicles are available for corporate transfers, field operations and events, on short-term or long-term hire.',
    },
    {
      q: 'Can you build software for our organisation?',
      a: 'Yes. We build custom business systems, workflow tools, websites and dashboards that genuinely fit the way your team works.',
    },
  ],
}
