'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass =
  'w-full bg-neutral-900 border border-neutral-800 rounded-full px-5 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-all text-sm font-medium'

export default function PartnerForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    organization: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipType: '',
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
      setForm({
        organization: '',
        contactPerson: '',
        email: '',
        phone: '',
        partnershipType: '',
        message: '',
      })
      router.push('/thank-you')
      return
    }

    setError('Something went wrong. Please try again or email us directly.')
  }

  return (
    <section className="bg-black py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto bg-neutral-950 rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-neutral-900 max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight">Start a Conversation</h2>
        <p className="text-neutral-300 text-center mt-3 leading-relaxed text-base font-normal">
          Fill in the form below and our team will reach out within 24 hours.
        </p>

        {submitted ? (
          <div className="bg-neutral-900 rounded-3xl p-8 mt-10 text-center border border-neutral-800 shadow-sm">
            <p className="text-white font-bold text-lg">
              Thank you! We&apos;ll review your request and be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <input
              type="text"
              name="organization"
              placeholder="Organization Name"
              value={form.organization}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person"
              value={form.contactPerson}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <select
              name="partnershipType"
              value={form.partnershipType}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="" className="bg-neutral-900">Partnership Type</option>
              <option value="Supplier" className="bg-neutral-900">Supplier</option>
              <option value="Corporate Client" className="bg-neutral-900">Corporate Client</option>
              <option value="NGO" className="bg-neutral-900">NGO</option>
              <option value="Government" className="bg-neutral-900">Government</option>
              <option value="Other" className="bg-neutral-900">Other</option>
            </select>
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
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
              {isSubmitting ? 'Sending...' : 'Submit Partnership Request'}
            </button>
            {error ? <p className="text-red-400 text-sm text-center font-medium mt-2">{error}</p> : null}
          </form>
        )}
      </div>
    </section>
  )
}
