const nav = [['Home','/'],['Chat','/chat'],['Projects','/projects'],['Sandbox','/sandbox'],['Developer','/developer'],['Settings','/settings']];

export default function TasksPage() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation"><div className="brand">ORI</div><nav>{nav.map(([label,href]) => <a className="navItem" href={href} key={label}>{label}</a>)}</nav><div className="sidebarFooter">Ori Platform</div></aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">TASKS</p><h1>Work Ori can keep track of.</h1></div></header>
        <div className="homeGrid">
          <section className="sectionBlock"><div className="sectionHeader"><h3>Active tasks</h3><span className="eyebrow">0 RUNNING</span></div><div className="emptyState"><strong>No active tasks</strong><span>Long-running work will live here with progress, status, approvals, and a direct path back to its conversation.</span></div></section>
          <section className="sectionBlock"><div className="sectionHeader"><h3>Task model</h3></div><div className="emptyState"><strong>Conversation → task → result</strong><span>Ori can turn a substantial request into trackable work without forcing every small interaction into a project.</span></div></section>
        </div>
      </section>
    </main>
  );
}
