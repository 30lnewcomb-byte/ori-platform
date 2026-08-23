const nav = [
  ['Home', '/'], ['Chat', '/chat'], ['Projects', '/projects'],
  ['Ori World', '/sandbox'], ['Developer', '/developer'], ['Settings', '/settings'],
];

export default function OriWorldPage() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation"><div className="brand">ORI</div><nav>{nav.map(([label, href]) => <a className={label === 'Ori World' ? 'navItem active' : 'navItem'} href={href} key={label}>{label}</a>)}</nav><div className="sidebarFooter">Ori Platform</div></aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">ORI WORLD</p><h1>Ori&apos;s world.</h1></div></header>
        <div className="homeGrid">
          <section className="hero"><p className="eyebrow">WORLD STATUS</p><h2>A small place for Ori to work.</h2><p className="heroCopy">Ori World is a purpose-built working environment for code, files, experiments, tests, and other controlled work. It is intentionally small and designed around what Ori actually needs.</p><div className="actions"><a className="primary" href="#details">View world details</a></div></section>
          <section className="sectionBlock" id="details"><div className="sectionHeader"><h3>Ori World state</h3><span className="eyebrow">NOT CONNECTED</span></div><div className="emptyState"><strong>The world is not connected yet</strong><span>When Ori World is implemented, this page will show workspace state, active work, permissions, resources, files, tests, and recent activity.</span></div></section>
          <section className="sectionBlock"><div className="sectionHeader"><h3>What belongs here</h3><span className="eyebrow">DESIGNED FOR ORI</span></div><div className="emptyState"><strong>Workspace · Code · Tests · Experiments</strong><span>This is not a generic hosted sandbox. The goal is a lightweight, purpose-built environment that can eventually run using infrastructure we control without requiring a paid sandbox service.</span></div></section>
        </div>
      </section>
    </main>
  );
}
