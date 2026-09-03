import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'

const sizes = {
  nav: { iconSize: 34, titleClass: 'text-xl font-extrabold tracking-tight text-white' },
  footer: { iconSize: 42, titleClass: 'text-2xl font-extrabold tracking-tight text-white' },
  hero: { iconSize: 56, titleClass: 'text-3xl font-extrabold tracking-tight text-white' },
}

export default function Logo({ className = '', showTagline = false, size = 'nav' }) {
  const { iconSize, titleClass } = sizes[size] || sizes.nav

  const logoContent = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative rounded-full overflow-hidden border border-gray-700/80 shadow-sm bg-black shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <Image
          src={images.logo}
          alt="Zed OS Eagle Logo"
          fill
          className="object-cover"
          priority={size === 'nav'}
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className={titleClass}>
          Zed <span className="text-white font-extrabold">OS</span>
        </span>
        {showTagline && (
          <span className="text-[11px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">
            Supply Chain · Software · Systems
          </span>
        )}
      </div>
    </div>
  )

  if (size === 'footer') {
    return <div>{logoContent}</div>
  }

  return (
    <Link href="/" className="flex items-center shrink-0 group">
      {logoContent}
    </Link>
  )
}

