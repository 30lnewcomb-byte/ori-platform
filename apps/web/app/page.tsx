import AppShell from '../components/app-shell'

export default function HomePage() {
  return (
    <AppShell active="Home">
      <header className="topbar">
        <div><p className="eyebrow">ORI PLATFORM</p><h1>Good evening.</h1></div>
        <button className="avatar" aria-label="Open profile">L</button>
      </header>
      <div className="homeGrid">
        <section className="hero">
          <p className="eyebrow">READY</p>
          <h2>What are we building today?</h2>
          <p className="heroCopy">Start a conversation, open a project, or give Ori a task to work on.</p>
          <div className="actions"><a className="primary" href="/chat">Start a chat</a><a className="secondary" href="/projects">Open projects</a></div>
        </section>
        <section className="sectionBlock" aria-labelledby="recent-heading">
          <div className="sectionHeader"><h3 id="recent-heading">Continue working</h3><a href="/projects">View all</a></div>
          <div className="emptyState"><strong>No recent work yet</strong><span>Your conversations and projects will appear here.</span></div>
        </section>
        <section className="sectionBlock" aria-labelledby="status-heading">
          <div className="sectionHeader"><h3 id="status-heading">System</h3><a href="/notifications">View activity</a></div>
          <div className="statusRow"><span className="statusDot" aria-hidden="true" /><div><strong>Ori is ready</strong><span>No active tasks are running.</span></div></div>
        </section>
      </div>
    </AppShell>
  )
}
