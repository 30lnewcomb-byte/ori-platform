const nav = [
  ['Home', '/'], ['Chat', '/chat'], ['Projects', '/projects'],
  ['Sandbox', '/sandbox'], ['Developer', '/developer'], ['Settings', '/settings'],
];

export default function SandboxPage() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation"><div className="brand">ORI</div><nav>{nav.map(([label, href]) => <a className={label === 'Sandbox' ? 'navItem active' : 'navItem'} href={href} key={label}>{label}</a>)}</nav><div className="sidebarFooter">Ori Platform</div></aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">SANDBOX</p><h1>Ori's workspace.</h1></div></header>
        <div className="homeGrid">
          <section className="hero"><p className="eyebrow">SANDBOX STATUS</p><h2>Reusable execution space.</h2><p className="heroCopy">Ori is designed around a persistent sandbox that can be reused across compatible tasks instead of creating a new environment every time.</p><div className="actions"><a className="primary" href="#details">View sandbox details</a></div></section>
          <section className="sectionBlock" id="details"><div className="sectionHeader"><h3>Sandbox state</h3><span className="eyebrow">NOT CONNECTED</span></div><div className="emptyState"><strong>Runtime is not connected yet</strong><span>When the runtime exists, this page will show workspace state, running work, permissions, resource limits, and recent activity.</span></div></section>
        </div>
      </section>
    </main>
  );
}
