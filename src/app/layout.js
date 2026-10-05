import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SiteChrome from '@/components/SiteChrome'
import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry'

export const metadata = {
  title: 'Zed OS Technologies Limited',
  description: 'General Supplies & Consultancy Services — Kisumu, Kenya',
  icons: {
    icon: [
      { url: '/eagle-light.ico', media: '(prefers-color-scheme: light)' },
      { url: '/eagle-dark.ico', media: '(prefers-color-scheme: dark)' },
      { url: '/eagle-light-16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/eagle-light-32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/eagle-dark-16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/eagle-dark-32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [{ url: '/eagle-light-180.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          <SiteChrome>{children}</SiteChrome>
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  )
}
