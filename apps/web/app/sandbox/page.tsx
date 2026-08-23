import AppShell from '../../components/app-shell'

export default function OriWorldPage() {
  return (
    <AppShell active="Ori World">
      <header className="topbar"><div><p className="eyebrow">ORI WORLD</p><h1>Ori&apos;s world.</h1><p className="appIntro">A small, purpose-built working environment for code, files, experiments, tests, and controlled work.</p></div></header>
      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>World state</h3><span className="eyebrow">NOT CONNECTED</span></div>
          <div className="emptyState"><strong>The world is not connected yet</strong><span>When Ori World is implemented, this page will show workspace state, active work, permissions, resources, files, tests, and recent activity.</span></div>
        </section>
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>What belongs here</h3><span className="eyebrow">DESIGNED FOR ORI</span></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Workspace</strong><span>Persistent project context and working files.</span></div><span>Planned</span></div>
            <div className="dataRow"><div><strong>Code & tests</strong><span>A focused environment for development and verification.</span></div><span>Planned</span></div>
            <div className="dataRow"><div><strong>Experiments</strong><span>Small, controlled work areas without a paid sandbox service.</span></div><span>Planned</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
