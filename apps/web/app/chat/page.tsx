import AppShell from '../../components/app-shell'
import ChatClient from './chat-client'

export default function ChatPage() {
  return (
    <AppShell active="Chat" contentClassName="chatPageContent">
      <section className="chatContent">
        <ChatClient />
      </section>
    </AppShell>
  )
}
