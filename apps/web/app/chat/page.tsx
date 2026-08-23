import AppShell from '../../components/app-shell'
import ChatClient from './chat-client'

export default function ChatPage() {
  return (
    <AppShell active="Chat">
      <section className="chatContent">
        <header className="topbar chatHeader">
          <div><p className="eyebrow">CHAT</p><h1>Chat</h1></div>
        </header>
        <ChatClient />
      </section>
    </AppShell>
  )
}
