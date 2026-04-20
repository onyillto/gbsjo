import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gbajo - Co-operative Manager',
  description: 'Manage members, contributions, and elections seamlessly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
