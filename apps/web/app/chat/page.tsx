import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AppShell from '../../components/app-shell'
import ChatClient from './chat-client'

export default async function ChatPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in?redirect_url=/chat')
  if (user.publicMetadata?.oriOnboardingComplete !== true) redirect('/onboarding')

  return (
    <AppShell active="Chat" contentClassName="chatPageContent">
      <section className="chatContent">
        <ChatClient />
      </section>
    </AppShell>
  )
}
