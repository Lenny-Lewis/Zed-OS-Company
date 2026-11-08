import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SiteChrome from '@/components/SiteChrome'

export const metadata = {
  // Each page names itself ("About | Zed"); the home page is just "Zed".
  title: { default: 'Zed', template: '%s | Zed' },
  description: 'One partner for supplies, systems and insight. General supplies, software systems, websites, data analytics, AI & ML and consultancy, from Kisumu Town West to clients across East Africa.',
  icons: {
    icon: [
      { url: '/orbit-light.ico', media: '(prefers-color-scheme: light)' },
      { url: '/orbit-dark.ico', media: '(prefers-color-scheme: dark)' },
      { url: '/orbit-light-16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/orbit-light-32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/orbit-dark-16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/orbit-dark-32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [{ url: '/orbit-light-180.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Zed OS Technologies Limited',
  'url': 'https://zedostechnologies.co.ke',
  'telephone': '+254758296887',
  'email': 'lennoxlewis.lenny@gmail.com',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Kisumu Town West',
    'postOfficeBoxNumber': '2371',
    'postalCode': '40100',
    'addressLocality': 'Kisumu',
    'addressRegion': 'Kisumu County',
    'addressCountry': 'KE',
  },
  'sameAs': [
    'https://www.instagram.com/zedostechnologies?igsh=MXFyamJ2NjFvY2F0eQ==',
    'https://www.linkedin.com/in/zedos-technologies-576bb3414',
    'https://x.com/zedostechnology',
  ],
}

export default function RootLayout({ children }) {
  return (
    // data-scroll-behavior="smooth": globals.css makes html scroll smoothly, and since Next 16 the
    // router no longer turns that off when you change page. Without this, opening /products from a
    // scrolled page animated the scroll up from the bottom (the truck section) to the top, so the
    // second section showed first. With it, Next jumps straight to the top on navigation.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Inter+Tight:wght@300;400;500&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap"
          rel="stylesheet"
        />
        <script
          id="zedos-ld-json"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Record the first entry before hydration so even a refresh during the
            intro skips it. Repeat entries are hidden before the first paint; first
            entries get data-intro-active so heavy page animations idle under the intro.
            Also guard against browser extensions injecting attributes before React hydration. */}
        <script
          id="zedos-preinit"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('zedos:intro-seen')){document.documentElement.setAttribute('data-intro-seen','')}else{document.documentElement.setAttribute('data-intro-active','');sessionStorage.setItem('zedos:intro-seen','1')}}catch(e){};(function(){try{new MutationObserver(function(m){for(var i=0;i<m.length;i++){var a=m[i].attributeName;if(a&&(a==='bis_skin_checked'||a.indexOf('bis_')===0)){m[i].target.removeAttribute(a);}}}).observe(document.documentElement,{subtree:true,attributes:true});}catch(e){}})();`,
          }}
        />
        {/* No JS (or a failed script) must not leave the site covered. */}
        <noscript>
          <style>{`[data-intro]{display:none!important}`}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        {/* StyledComponentsRegistry removed: nothing rendered uses styled-components, and the
            registry put its runtime in every page's bundle. Re-add it (src/lib) if loader-5 is used. */}
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  )
}
