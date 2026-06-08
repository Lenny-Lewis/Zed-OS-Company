import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'

const sizes = {
  nav: { height: 44, width: 160 },
  footer: { height: 56, width: 200 },
  hero: { height: 72, width: 260 },
}

export default function Logo({ className = '', showTagline = false, size = 'nav' }) {
  const { height, width } = sizes[size] || sizes.nav

  const image = (
    <Image
      src={images.logo}
      alt="Zed OS Technologies Limited"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      style={{ height, width: 'auto', maxWidth: width }}
      priority={size === 'nav'}
    />
  )

  const content = (
    <>
      {image}
      {showTagline && (
        <p className="text-brand-accent text-sm mt-2 font-medium">
          Supply Chain · Software · Systems
        </p>
      )}
    </>
  )

  if (size === 'footer') {
    return <div>{content}</div>
  }

  return (
    <Link href="/" className="flex items-center shrink-0">
      {image}
    </Link>
  )
}
