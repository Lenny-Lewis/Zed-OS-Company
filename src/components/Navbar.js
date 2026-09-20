'use client'

import Menu from '@/components/ui/navbar'
import MobileNav from '@/components/ui/mobile-nav'

const menus = [
  { id: 1, title: 'Home', url: '/', dropdown: false },
  { id: 2, title: 'Products', url: '/products', dropdown: true, items: [
    { id: 21, title: 'Digital Systems', url: '/products' },
    { id: 22, title: 'General Supplies', url: '/products' },
  ] },
  { id: 3, title: 'Services', url: '/services', dropdown: true, mega: true, items: [
    { id: 31, title: 'General Supplies', url: '/services', description: 'Dependable procurement for every workplace.', imageSrc: '/images/service-supplies.jpg' },
    { id: 32, title: 'Vehicle Hire', url: '/services', description: 'Reliable mobility for teams and field work.', imageSrc: '/images/carhire.jpg' },
    { id: 33, title: 'Conference Facilities', url: '/services', description: 'Spaces equipped for productive gatherings.', imageSrc: '/images/service-conference.jpg' },
    { id: 34, title: 'Consultancy Services', url: '/services', description: 'Practical guidance for better operations.', imageSrc: '/images/service-consultancy.jpg' },
    { id: 35, title: 'Software Systems', url: '/services', description: 'Custom tools that streamline your workflows.', imageSrc: '/images/digital-systems.jpg' },
    { id: 36, title: 'Websites', url: '/services', description: 'Clear, modern digital experiences for your brand.', imageSrc: '/images/digital-websites.jpg' },
    { id: 37, title: 'Data Analytics', url: '/services', description: 'Insights that make decisions more confident.', imageSrc: '/images/digital-analytics.jpg' },
    { id: 38, title: 'AI & ML', url: '/services', description: 'Intelligent automation for ambitious teams.', imageSrc: '/images/AI and ML.jpg' },
  ] },
  { id: 4, title: 'About', url: '/about', dropdown: false },
  { id: 5, title: 'Contact', url: '/contact', dropdown: false },
]

export default function Navbar() {
  return (
    <>
      <header className="fixed left-1/2 top-4 z-[60] hidden -translate-x-1/2 text-black lg:block md:top-6"><Menu list={menus} /></header>
      <MobileNav />
    </>
  )
}
