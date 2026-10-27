import Image from 'next/image'
import PushpinTearFooter from '@/components/ui/pushpin-tear-footer'

export default function Footer() {
  return (
    <PushpinTearFooter
      brand="zed os."
      name="Zed OS Technologies"
      logoHref="/"
      logo={<Image src="/eagle-dark-64.png" alt="Zed OS" width={64} height={64} className="tpf-logo-img" />}
      sheet="#000000"
      paper="#f3f3f1"
      paperInk="#111111"
      email="Lennoxlewis.lenny@gmail.com"
      newsletter={null}
      tagline="Supply Chain · Software · Systems"
      status={{ label: 'Let’s work together', href: '/contact' }}
      mark="Kisumu, Kenya"
      timeZone="Africa/Nairobi"
      timeLabel="EAT"
      socials={[
        { icon: 'ig', label: 'Instagram', href: 'https://www.instagram.com/zedostechnologies?igsh=MXFyamJ2NjFvY2F0eQ==' },
        { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/zedos-technologies-576bb3414' },
        { icon: 'x', label: 'X', href: 'https://x.com/zedostechnology' },
      ]}
      sideLinks={[
        { icon: 'globe', label: 'services', href: '/services' },
        { icon: 'chat', label: 'WhatsApp', href: 'https://wa.me/254758296887' },
      ]}
      chat={{ label: 'say hello', href: '/contact' }}
      copyright={`© ${new Date().getFullYear()} Zed OS Technologies Limited`}
      handle={{ label: '+254 758 296 887', href: 'tel:+254758296887' }}
    />
  )
}
