'use client'

export default function WhatsAppButton() {
  const phoneNumber = '254758296887'
  const message = encodeURIComponent(
    'Hello Zed OS Technologies, I would like to inquire about your services.'
  )
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 md:w-13 md:h-13 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-white/20 group"
      title="Chat with us on WhatsApp"
    >
      <svg
        className="w-7 h-7 fill-current transition-transform group-hover:rotate-6"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.636-1.157 4.227 4.321-1.133.58.337zm11.51-6.196c-.301-.15-1.784-.881-2.06-.982-.275-.1-.476-.15-.676.15-.2.3-.777.982-.953 1.182-.175.2-.351.225-.652.075-.3-.15-1.266-.467-2.413-1.488-.893-.795-1.496-1.777-1.671-2.077-.176-.3-.019-.462.13-.611.136-.134.301-.35.452-.525.15-.175.201-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.628-.927-2.228-.244-.585-.493-.506-.676-.516-.174-.009-.375-.01-.576-.01-.2 0-.526.075-.802.375-.275.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.907 1.227 3.107.15.2 2.119 3.235 5.134 4.538.717.31 1.277.495 1.713.633.72.229 1.375.196 1.893.119.578-.085 1.784-.729 2.035-1.432.25-.702.25-1.303.175-1.431-.075-.128-.276-.203-.577-.353z" />
      </svg>
    </a>
  )
}
