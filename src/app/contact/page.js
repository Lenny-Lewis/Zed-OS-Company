'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import { images } from '@/data/images'

const inputClass =
  'w-full bg-neutral-900 border border-neutral-800 rounded-full px-5 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-all text-sm font-medium'

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default function ContactPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const response = await fetch('https://formspree.io/f/xbdeoozz', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: new FormData(e.currentTarget),
    })

    setIsSubmitting(false)

    if (response.ok) {
      setSubmitted(true)
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' })
      router.push('/thank-you')
      return
    }

    setError('Something went wrong. Please try again or email us directly.')
  }

  return (
    <>
      <PageHero
        label="REACH US"
        title="Contact Us"
        subtitle="We'd love to hear from you. Let's talk."
        backgroundImage={images.pageHeroBg}
      />

      <div className="bg-black py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-neutral-950 rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-neutral-900">
          <div>
            <div className="relative h-56 rounded-3xl overflow-hidden mb-8 shadow-xs border border-neutral-800">
              <Image
                src={images.aboutOffice}
                alt="Zed OS Technologies office"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Get In Touch</h2>

            <ul className="mt-8 space-y-5">
              <li className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <PhoneIcon />
                </div>
                <span className="text-neutral-300 text-base font-medium">+254 758 296 887</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <EmailIcon />
                </div>
                <span className="text-neutral-300 text-base font-medium">Lennoxlewis.lenny@gmail.com</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <LocationIcon />
                </div>
                <span className="text-neutral-300 text-base font-medium">P.O. Box 2371-40100, Kisumu Town West, Kenya</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <ClockIcon />
                </div>
                <span className="text-neutral-300 text-base font-medium">Monday – Friday, 8:00 AM – 6:00 PM EAT</span>
              </li>
            </ul>
          </div>

          <div className="bg-neutral-900 rounded-3xl p-8 md:p-10 border border-neutral-800 shadow-xs">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-md">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-extrabold text-2xl mt-6">Message Sent!</h3>
                <p className="text-neutral-300 mt-3 font-normal">
                  Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="" className="bg-neutral-900">Subject</option>
                  <option value="General Inquiry" className="bg-neutral-900">General Inquiry</option>
                  <option value="Supply Request" className="bg-neutral-900">Supply Request</option>
                  <option value="Vehicle Hire" className="bg-neutral-900">Vehicle Hire</option>
                  <option value="Conference Booking" className="bg-neutral-900">Conference Booking</option>
                  <option value="Consultancy" className="bg-neutral-900">Consultancy</option>
                  <option value="Partnership" className="bg-neutral-900">Partnership</option>
                </select>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-all text-sm font-medium"
                />
                <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed text-black py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-md mt-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {error ? <p className="text-red-400 text-sm text-center font-medium mt-2">{error}</p> : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
