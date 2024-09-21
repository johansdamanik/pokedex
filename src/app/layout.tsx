import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/toaster'

import './globals.css'

export const metadata: Metadata = {
  title: 'Pokédex',
  description: 'A Pokémon Index with modern looks',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-geist antialiased`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
