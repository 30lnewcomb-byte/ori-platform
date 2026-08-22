const nav = [
  ['Home', '/'], ['Chat', '/chat'], ['Projects', '/projects'],
  ['Sandbox', '/sandbox'], ['Developer', '/developer'], ['Settings', '/settings'],
];

export default function ChatPage() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">ORI</div>
        <nav>{nav.map(([label, href]) => <a className={label === 'Chat' ? 'navItem active' : 'navItem'} href={href} key={label}>{label}</a>)}</nav>
        <div className="sidebarFooter">Ori Platform</div>
      </aside>
      <section className="content chatContent">
        <header className="topbar"><div><p className="eyebrow">CHAT</p><h1>Work with Ori.</h1></div></header>

        <section className="conversation" aria-label="Conversation preview">
          <div className="message userMessage">
            <div className="messageLabel">You</div>
            <div className="userBubble">Can you check what's happening with the project?</div>
          </div>
          <div className="message oriMessage">
            <div className="oriIdentity"><span className="oriMark" aria-hidden="true">O</span><span>Ori</span></div>
            <div className="oriText">I'm ready to check it. When the connected tools are available, I'll be able to inspect the project and report back here.</div>
          </div>
        </section>

        <section className="composer" id="composer" aria-label="Message Ori">
          <textarea id="prompt" rows={2} placeholder="Message Ori..." aria-label="Message Ori" />
          <button type="button" className="sendButton" aria-label="Send message">↑</button>
        </section>
      </section>
    </main>
  );
}
