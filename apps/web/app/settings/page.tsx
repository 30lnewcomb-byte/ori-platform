import AppShell from '../../components/app-shell'

export default function SettingsPage() {
  return (
    <AppShell active="Settings">
      <header className="topbar"><div><p className="eyebrow">SETTINGS</p><h1>Configure Ori.</h1><p className="appIntro">Account, appearance, permissions, notifications, and integrations will live here.</p></div></header>
      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Account</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Liam</strong><span>Account controls and identity.</span></div><span>Connected</span></div>
          </div>
        </section>
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Preferences</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Appearance</strong><span>Theme and interface preferences.</span></div><span>Planned</span></div>
            <div className="dataRow"><div><strong>Notifications</strong><span>Control where Ori reports important events.</span></div><span>Planned</span></div>
            <div className="dataRow"><div><strong>Integrations</strong><span>Connect services explicitly when you're ready.</span></div><span>Planned</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
