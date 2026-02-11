import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recent Updates - Andreas Juon',
  description: 'News and updates from my research and work',
}

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
