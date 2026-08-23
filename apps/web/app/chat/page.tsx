import AppShell from '../../components/app-shell'

export default function ChatPage() {
  return (
    <AppShell active="Chat">
      <section className="chatContent">
        <header className="topbar"><div><p className="eyebrow">CHAT</p><h1>Chat</h1></div></header>
        <section className="conversation" aria-label="Conversation">
          <div className="emptyState" style={{ margin: 'auto 0', minHeight: 0, alignItems: 'center', textAlign: 'center' }}>
            <strong>Start a conversation with Ori.</strong>
            <span>Your conversation will appear here.</span>
          </div>
        </section>
        <section className="composer" id="composer" aria-label="Message Ori">
          <textarea id="prompt" rows={2} placeholder="Message Ori..." aria-label="Message Ori" />
          <button type="button" className="sendButton" aria-label="Send message">↑</button>
        </section>
      </section>
    </AppShell>
  )
}
