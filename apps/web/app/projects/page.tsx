import AppShell from '../../components/app-shell'

export default function ProjectsPage() {
  return (
    <AppShell active="Projects">
      <header className="topbar">
        <div>
          <p className="eyebrow">PROJECTS</p>
          <h1>Your work.</h1>
          <p className="appIntro">Projects are durable workspaces for conversations, files, tasks, tools, and Ori resources.</p>
        </div>
      </header>
      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Projects</h3><span className="eyebrow">0 PROJECTS</span></div>
          <div className="emptyState">
            <strong>No projects yet</strong>
            <span>Your projects will appear here when you create them.</span>
          </div>
        </section>
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Project structure</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Conversations</strong><span>Keep related chats together.</span></div><span>Workspace</span></div>
            <div className="dataRow"><div><strong>Files & resources</strong><span>Project assets and configuration.</span></div><span>Workspace</span></div>
            <div className="dataRow"><div><strong>Tasks & activity</strong><span>Track work without turning every interaction into a project.</span></div><span>Workspace</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
