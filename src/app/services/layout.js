import ServicesShell from '@/components/services/ServicesShell'

// Shared by /services and every /services/<slug>, so the cover survives moving between them.
export default function ServicesLayout({ children }) {
  return <ServicesShell>{children}</ServicesShell>
}
