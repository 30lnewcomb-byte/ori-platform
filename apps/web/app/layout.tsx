import { ClerkProvider } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { OriThemeProvider } from '../components/theme-provider'
import { normalizeOriPreferences } from '../lib/theme-settings'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ori',
  description: 'The Ori chat workspace for questions, ideas, and ongoing conversations. Developer administration lives in a separate workspace.',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser()
  const initialPreferences = normalizeOriPreferences(user?.privateMetadata?.oriPreferences)

  return (
    <html
      lang="en"
      data-ori-appearance={initialPreferences.appearance}
      data-ori-accent={initialPreferences.accent}
    >
      <body>
        <ClerkProvider afterSignOutUrl="/">
          <OriThemeProvider initialPreferences={initialPreferences}>
            {children}
            <Analytics />
          </OriThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
