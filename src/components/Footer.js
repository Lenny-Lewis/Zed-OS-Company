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

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/zedos-technologies-576bb3414',
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
        <path
          d="M6.94 8.25H3.9V20h3.04V8.25ZM5.43 6.7c.97 0 1.76-.8 1.76-1.78S6.4 3.14 5.43 3.14a1.77 1.77 0 0 0 0 3.56ZM20 20h-3.03v-5.74c0-1.37-.02-3.13-1.91-3.13-1.92 0-2.21 1.5-2.21 3.04V20H9.8V8.25h2.91v1.6h.04c.4-.75 1.39-1.54 2.85-1.54C19 8.31 20 10.15 20 12.9V20Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/zedostechnologies?igsh=MXFyamJ2NjFvY2F0eQ==',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
        <path
          d="M7.75 3.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5A4.25 4.25 0 0 1 16.25 20.5h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5Zm0 1.75A2.5 2.5 0 0 0 5.25 7.75v8.5a2.5 2.5 0 0 0 2.5 2.5h8.5a2.5 2.5 0 0 0 2.5-2.5v-8.5a2.5 2.5 0 0 0-2.5-2.5h-8.5Zm10.63 1.13a1.06 1.06 0 1 1-2.13 0 1.06 1.06 0 0 1 2.13 0ZM12 7.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 1.75A2.45 2.45 0 1 0 14.45 12 2.45 2.45 0 0 0 12 9.55Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: 'https://x.com/zedostechnology',
    label: 'X (Twitter)',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
        <path
          d="M18.9 2H22l-6.77 7.73L23 22h-6.1l-4.78-6.26L6.64 22H3.5l7.24-8.27L1 2h6.25l4.32 5.7L18.9 2Zm-1.07 18h1.69L6.33 3.9H4.52L17.83 20Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
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
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-3">Follow</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-brand-primary text-brand-accent bg-brand-deep hover:bg-brand-primary hover:text-white transition-colors duration-200"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-brand-primary">
        <p className="text-brand-muted text-sm text-center">
          © 2026 Zed OS Technologies Limited. All rights reserved.
        </p>
        <p className="text-brand-muted text-sm text-center mt-3">
          Made by{' '}
          <Link
            href="https://load-lewis.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-accent font-semibold hover:text-white transition-colors duration-200"
          >
            Lennox Lewis
          </Link>
        </p>
      </div>
    </footer>
  )
}
