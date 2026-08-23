import AppShell from '../../components/app-shell'

export default function TasksPage() {
  return (
    <AppShell active="Tasks">
      <header className="topbar"><div><p className="eyebrow">TASKS</p><h1>Work to track.</h1><p className="appIntro">Long-running work, approvals, and progress belong here.</p></div><span className="eyebrow">0 RUNNING</span></header>
      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Active tasks</h3><span className="eyebrow">NONE</span></div>
          <div className="emptyState"><strong>No active tasks</strong><span>When Ori starts substantial work, you'll see progress and status here.</span></div>
        </section>
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Task flow</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Request</strong><span>A conversation can become trackable work.</span></div><span>01</span></div>
            <div className="dataRow"><div><strong>Work</strong><span>Ori reports progress while tools and projects are involved.</span></div><span>02</span></div>
            <div className="dataRow"><div><strong>Result</strong><span>Completed work links back to its conversation and project.</span></div><span>03</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
