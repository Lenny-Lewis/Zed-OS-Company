import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: 'Zed OS Technologies Limited',
  description: 'General Supplies & Consultancy Services — Kisumu, Kenya',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Zed OS Technologies Limited',
  'url': 'https://zedostechnologies.co.ke',
  'founder': {
    '@type': 'Person',
    'name': 'Lennox Lewis Odhiambo',
    'jobTitle': 'CEO & Founder',
  },
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Kisumu',
    'addressRegion': 'Kisumu County',
    'addressCountry': 'KE',
  },
  'sameAs': [
    'https://www.instagram.com/zedostechnologies?igsh=MXFyamJ2NjFvY2F0eQ==',
    'www.linkedin.com/in/zedos-technologies-576bb3414',
    'https://x.com/zedostechnology',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}