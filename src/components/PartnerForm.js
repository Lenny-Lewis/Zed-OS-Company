'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/ScrollReveal'

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/60'

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
    <section className="bg-black px-5 py-20 md:px-8 md:py-28">
      <ScrollReveal className="mx-auto max-w-3xl border-y border-white/15 py-12 md:py-16">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-white/55">Partner with ZedOS</p>
        <h2 className="mt-4 text-center text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl">Start a Conversation</h2>
        <p className="mt-3 text-center text-base leading-relaxed text-white/65">
          Fill in the form below and our team will reach out within 24 hours.
        </p>

        {submitted ? (
          <div className="mt-10 border-t border-white/15 pt-8 text-center">
            <p className="text-lg font-medium text-white">
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
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] p-4 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/60"
            />
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-white py-3.5 text-sm font-medium text-black transition-colors hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Submit Partnership Request'}
            </button>
            {error ? <p className="text-red-400 text-sm text-center font-medium mt-2">{error}</p> : null}
          </form>
        )}
      </ScrollReveal>
    </section>
  )
}
