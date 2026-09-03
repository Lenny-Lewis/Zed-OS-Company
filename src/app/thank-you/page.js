import Link from 'next/link'
import Reveal from '@/components/Reveal'

export const metadata = {
  title: 'Thank You | Zed OS Technologies Limited',
  description: 'Your message has been sent successfully.',
}

export default function ThankYouPage() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 md:px-8 py-16 md:py-24 bg-black">
      <Reveal className="max-w-xl w-full bg-neutral-950 border border-neutral-900 rounded-[2.5rem] p-10 md:p-14 text-center shadow-2xl">
        <span className="text-white uppercase tracking-widest text-xs font-bold bg-neutral-900 px-4 py-1.5 rounded-full inline-block mb-5 border border-neutral-800">
          Message Received
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Thank you for reaching out.</h1>
        <p className="text-neutral-300 mt-4 leading-relaxed text-base font-normal">
          Your message has been sent successfully. We&apos;ll review it and get back to you as soon as possible.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white hover:bg-neutral-200 px-8 py-3.5 text-black font-bold text-sm tracking-wide transition-all shadow-md"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-neutral-800 px-8 py-3.5 text-white font-bold text-sm tracking-wide hover:bg-neutral-900 transition-colors"
          >
            Send Another Message
          </Link>
        </div>
      </Reveal>
    </main>
  )
}
