import AppShell from '../../components/app-shell'

export default function SettingsPage() {
  return (
    <AppShell active="Home">
      <header className="topbar">
        <div>
          <p className="eyebrow">SETTINGS</p>
          <h1>Configure Ori.</h1>
          <p className="appIntro">Manage Ori&apos;s preferences, intelligence, permissions, notifications, and integrations.</p>
        </div>
      </header>

      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Intelligence</h3></div>
          <div className="dataList">
            <a className="dataRow" href="/settings/intelligence" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div>
                <strong>Ori Intelligence</strong>
                <span>Configure Ori&apos;s native TensorFlow runtime and model services.</span>
              </div>
              <span>Open →</span>
            </a>
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Account</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Liam</strong><span>Account controls and identity.</span></div><span>Connected</span></div>
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Preferences</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Appearance</strong><span>Theme and interface preferences.</span></div><span>Not configured</span></div>
            <div className="dataRow"><div><strong>Notifications</strong><span>Choose where important Ori events are reported.</span></div><span>Not configured</span></div>
            <div className="dataRow"><div><strong>Integrations</strong><span>Connect external services when you need them.</span></div><span>Not connected</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
