import AppShell from '../../components/app-shell'

export default function ProjectsPage() {
  return (
    <AppShell active="Projects">
      <header className="topbar"><div><p className="eyebrow">PROJECTS</p><h1>Your work.</h1><p className="appIntro">Projects are durable workspaces for conversations, files, tasks, tools, and future Ori resources.</p></div><a className="primary" href="#new">+ New project</a></header>
      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Projects</h3><span className="eyebrow">0 ACTIVE</span></div>
          <div className="emptyState"><strong>No projects yet</strong><span>Create one when you have work that deserves a durable home.</span></div>
        </section>
        <section className="sectionBlock" id="new">
          <div className="sectionHeader"><h3>Project structure</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Conversations</strong><span>Keep related chats together.</span></div><span>Ready</span></div>
            <div className="dataRow"><div><strong>Files & resources</strong><span>Project assets and future configuration.</span></div><span>Ready</span></div>
            <div className="dataRow"><div><strong>Tasks & activity</strong><span>Track work without turning every small interaction into a project.</span></div><span>Ready</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
