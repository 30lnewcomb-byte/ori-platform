import AppShell from '../../components/app-shell'

export default function NotificationsPage() {
  return (
    <AppShell active="Activity">
      <header className="topbar"><div><p className="eyebrow">ACTIVITY</p><h1>What Ori is doing.</h1><p className="appIntro">A live record of important changes, approvals, issues, and completed work.</p></div><span className="eyebrow">LIVE SYSTEM</span></header>
      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Today</h3><span className="eyebrow">0 EVENTS</span></div>
          <div className="emptyState"><strong>No activity yet</strong><span>When Ori starts work, meaningful system events will appear here instead of fake activity.</span></div>
        </section>
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Notifications</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Important system events</strong><span>Issues, approvals, completed tasks, and meaningful changes.</span></div><span>Ready</span></div>
            <div className="dataRow"><div><strong>External reporting</strong><span>Google Chat and email escalation can connect here later.</span></div><span>Planned</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
