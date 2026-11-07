'use client'

import { PenSignature } from '@/components/ui/pen-signature'
import TruckFooter from '@/components/ui/truck-footer'

// Same Formspree form as the contact and partner pages.
async function subscribe({ name, email }) {
  const body = new FormData()
  body.append('name', name)
  body.append('email', email)
  body.append('_subject', 'New footer signup')
  const response = await fetch('https://formspree.io/f/xbdeoozz', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body,
  })
  return response.ok
}

export default function Footer() {
  return (
    <TruckFooter
      // Above the fixed globe and scroll dots on /services (z-40), below the WhatsApp button (z-50).
      className="z-45"
      signupTitle="Don't miss out on future updates."
      signupNote="News and updates from Zed OS."
      onSubscribe={subscribe}
      status={[
        { label: 'Let’s work together.', href: '/contact' },
        { label: 'Kisumu, Kenya' },
      ]}
      quickLinks={[
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Products', href: '/products' },
        { label: 'Partner', href: '/partner' },
        { label: 'Contact', href: '/contact' },
      ]}
      contactLinks={[
        { label: 'lennoxlewis.lenny@gmail.com', href: 'mailto:lennoxlewis.lenny@gmail.com' },
        { label: '+254 758 296 887', href: 'tel:+254758296887' },
        { label: 'WhatsApp', href: 'https://wa.me/254758296887' },
      ]}
      socials={[
        { label: 'Instagram', href: 'https://www.instagram.com/zedostechnologies?igsh=MXFyamJ2NjFvY2F0eQ==' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zedos-technologies-576bb3414' },
        { label: 'X', href: 'https://x.com/zedostechnology' },
      ]}
      company="Zed OS Technologies Limited."
      tagline="Supply Chain · Software · Systems."
      wordmark={['Zed', 'OS']}
      signature={<PenSignature href="https://lennoxlewis.co.ke" label="Visit Lennox Lewis, website developer" title="Made by Lennox Lewis" />}
    />
  )
}
