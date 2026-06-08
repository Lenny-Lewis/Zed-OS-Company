import Link from 'next/link'
import Logo from '@/components/Logo'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/partner', label: 'Partner With Us' },
  { href: '/contact', label: 'Contact Us' },
]

const services = [
  'General Supplies',
  'Vehicle Hire',
  'Conference Facilities',
  'Consultancy Services',
]

export default function Footer() {
  return (
    <footer className="bg-brand-base border-t-2 border-brand-primary py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Logo size="footer" showTagline />
          <p className="text-brand-muted text-sm mt-4 leading-relaxed">
            Registered in Kenya. Delivering quality supplies and consultancy services across East Africa.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-brand-muted hover:text-brand-accent text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service} className="text-brand-muted text-sm">
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-brand-muted text-sm">
            <li>+254 758 296 887</li>
            <li>Lennoxlewis.lenny@gmail.com</li>
            <li>P.O. Box 2371-40100, Kisumu Town West, Kenya</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-brand-primary">
        <p className="text-brand-muted text-sm text-center">
          © 2026 Zed OS Technologies Limited. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
