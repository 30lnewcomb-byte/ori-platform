import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Ori — Think clearly. Build boldly.',
    template: '%s | Ori',
  },
  description: 'Ori brings conversation, coding, and creative work into one focused place.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider afterSignOutUrl="/">
          {children}
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  )
}
