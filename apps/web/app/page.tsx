const nav = ['Home', 'Chat', 'Projects', 'Sandbox', 'Developer', 'Settings'];

export default function HomePage() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">ORI</div>
        <nav>
          {nav.map((item, index) => (
            <a className={index === 0 ? 'navItem active' : 'navItem'} href="#" key={item}>
              {item}
            </a>
          ))}
        </nav>
        <div className="sidebarFooter">Ori Platform</div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">ORI PLATFORM</p>
            <h1>Good evening.</h1>
          </div>
          <button className="avatar" aria-label="Open profile">L</button>
        </header>

        <div className="homeGrid">
          <section className="hero">
            <p className="eyebrow">READY</p>
            <h2>What are we building today?</h2>
            <p className="heroCopy">
              Start a conversation, open a project, or give Ori a task to work on.
            </p>
            <div className="actions">
              <button className="primary">Start a chat</button>
              <button className="secondary">Open projects</button>
            </div>
          </section>

          <section className="sectionBlock" aria-labelledby="recent-heading">
            <div className="sectionHeader">
              <h3 id="recent-heading">Continue working</h3>
              <a href="#">View all</a>
            </div>
            <div className="emptyState">
              <strong>No recent work yet</strong>
              <span>Your conversations and projects will appear here.</span>
            </div>
          </section>

          <section className="sectionBlock" aria-labelledby="status-heading">
            <div className="sectionHeader">
              <h3 id="status-heading">System</h3>
            </div>
            <div className="statusRow">
              <span className="statusDot" aria-hidden="true" />
              <div>
                <strong>Ori is ready</strong>
                <span>No active tasks are running.</span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
