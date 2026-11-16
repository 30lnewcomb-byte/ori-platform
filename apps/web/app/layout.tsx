import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ori',
  description: 'The Ori chat workspace for questions, ideas, and ongoing conversations. Developer administration lives in a separate workspace.',
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
