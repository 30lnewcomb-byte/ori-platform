import AppShell from '../../components/app-shell'

export default function NotificationsPage() {
  return (
    <AppShell active="Activity">
      <header className="topbar">
        <div>
          <p className="eyebrow">ACTIVITY</p>
          <h1>What Ori is doing.</h1>
          <p className="appIntro">A record of important changes, approvals, issues, and completed work.</p>
        </div>
      </header>
      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Today</h3><span className="eyebrow">0 EVENTS</span></div>
          <div className="emptyState">
            <strong>No activity yet</strong>
            <span>Meaningful system events will appear here as your workspace changes.</span>
          </div>
        </section>
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Notifications</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Important system events</strong><span>Issues, approvals, completed tasks, and meaningful changes.</span></div><span>Events</span></div>
            <div className="dataRow"><div><strong>External reporting</strong><span>Additional reporting channels can be connected from integrations.</span></div><span>Not connected</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
