const nav = [
  ['Home', '/'], ['Chat', '/chat'], ['Projects', '/projects'],
  ['Sandbox', '/sandbox'], ['Developer', '/developer'], ['Settings', '/settings'],
];

export default function SettingsPage() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation"><div className="brand">ORI</div><nav>{nav.map(([label, href]) => <a className={label === 'Settings' ? 'navItem active' : 'navItem'} href={href} key={label}>{label}</a>)}</nav><div className="sidebarFooter">Ori Platform</div></aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">SETTINGS</p><h1>How Ori works for you.</h1></div></header>
        <div className="homeGrid">
          <section className="sectionBlock"><div className="sectionHeader"><h3>Account</h3></div><div className="statusRow"><div><strong>Liam</strong><span>Account controls will live here.</span></div></div></section>
          <section className="sectionBlock"><div className="sectionHeader"><h3>System</h3></div><div className="emptyState"><strong>Platform settings are coming together</strong><span>Appearance, permissions, notifications, integrations, and system preferences will be connected as the underlying services are implemented.</span></div></section>
        </div>
      </section>
    </main>
  );
}
