import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AppShell from '../../components/app-shell'
import ChatClient from './chat-client'

export default async function ChatPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/chat')

  return (
    <AppShell active="Chat" contentClassName="chatPageContent">
      <section className="chatContent">
        <ChatClient />
      </section>
    </AppShell>
  )
}
