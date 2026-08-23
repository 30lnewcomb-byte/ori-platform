const nav = [
  ['Home', '/'], ['Chat', '/chat'], ['Search', '/search'], ['Projects', '/projects'],
  ['Tasks', '/tasks'], ['Activity', '/notifications'], ['Sandbox', '/sandbox'],
  ['Developer', '/developer'], ['Settings', '/settings'],
];

export default function ProjectsPage() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation"><div className="brand">ORI</div><nav>{nav.map(([label, href]) => <a className={label === 'Projects' ? 'navItem active' : 'navItem'} href={href} key={label}>{label}</a>)}</nav><div className="sidebarFooter">Ori Platform</div></aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">PROJECTS</p><h1>Your work.</h1></div></header>
        <div className="homeGrid">
          <section className="sectionBlock"><div className="sectionHeader"><h3>Projects</h3><span className="eyebrow">0 ACTIVE</span></div><div className="emptyState"><strong>No projects yet</strong><span>Projects will become the durable home for conversations, files, sandboxes, tools, and developer resources.</span></div><div className="actions"><a className="primary" href="#new">Create a project</a></div></section>
          <section className="sectionBlock" id="new"><div className="sectionHeader"><h3>Project structure</h3></div><div className="emptyState"><strong>Work stays organized</strong><span>Each project can eventually connect its own conversations, reusable sandbox, files, permissions, and integrations.</span></div></section>
        </div>
      </section>
    </main>
  );
}
