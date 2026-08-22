const nav = [['Home','/'],['Chat','/chat'],['Projects','/projects'],['Sandbox','/sandbox'],['Developer','/developer'],['Settings','/settings']];

export default function NotificationsPage() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation"><div className="brand">ORI</div><nav>{nav.map(([label,href]) => <a className="navItem" href={href} key={label}>{label}</a>)}</nav><div className="sidebarFooter">Ori Platform</div></aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">ACTIVITY</p><h1>What Ori is doing.</h1></div></header>
        <div className="homeGrid">
          <section className="sectionBlock"><div className="sectionHeader"><h3>Activity</h3><span className="eyebrow">LIVE SYSTEM</span></div><div className="emptyState"><strong>No active activity</strong><span>When Ori starts work, important status changes, issues, approvals, and completed tasks can appear here.</span></div></section>
          <section className="sectionBlock"><div className="sectionHeader"><h3>Notifications</h3></div><div className="emptyState"><strong>You’re all caught up</strong><span>Notification preferences and external reporting channels will connect here later.</span></div></section>
        </div>
      </section>
    </main>
  );
}
