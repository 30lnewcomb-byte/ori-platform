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
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">CHAT</p><h1>Work with Ori.</h1></div></header>
        <div className="homeGrid">
          <section className="sectionBlock">
            <div className="sectionHeader"><h3>New conversation</h3><span className="eyebrow">READY</span></div>
            <div className="emptyState"><strong>What should Ori work on?</strong><span>Describe a question, task, or project. Tool execution and task progress will appear here as those systems come online.</span></div>
            <div className="actions"><a className="primary" href="#composer">Start writing</a></div>
          </section>
          <section className="sectionBlock" id="composer">
            <label htmlFor="prompt"><strong>Message Ori</strong></label>
            <textarea id="prompt" rows={6} placeholder="Ask Ori to help with something..." style={{width:'100%', marginTop:12, padding:14, border:'1px solid var(--border-subtle)', borderRadius:12, resize:'vertical', background:'var(--surface-base)', color:'var(--text-primary)'}} />
            <p className="eyebrow" style={{marginTop:10}}>CHAT BACKEND NOT CONNECTED YET</p>
          </section>
        </div>
      </section>
    </main>
  );
}
