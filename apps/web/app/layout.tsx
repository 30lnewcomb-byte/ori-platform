import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ori',
  description: 'Ori is a focused AI platform for thinking, building, coding, and creating.',
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
