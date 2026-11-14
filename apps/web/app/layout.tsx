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
          <aside className="renderDependencyNotice" role="note" aria-label="Service hosting notice">
            <span>
              <strong>Service hosting notice</strong>
              Ori Platform uses Render-hosted services for intelligence and VM capabilities. If a supporting service is starting, unavailable, or under maintenance, those features may be temporarily unavailable while other parts of the platform can remain accessible.
            </span>
            <a href="https://ori-ai-tan.vercel.app/status">System status</a>
          </aside>
          {children}
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  )
}
