import AppShell from '../../../components/app-shell'

export default function IntelligenceSettingsPage() {
  return (
    <AppShell active="Home">
      <header className="topbar">
        <div>
          <p className="eyebrow">SETTINGS · INTELLIGENCE</p>
          <h1>Ori intelligence.</h1>
          <p className="appIntro">Configure the model services Ori can use. Secrets stay server-side and are never shown back in the interface.</p>
        </div>
      </header>

      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Hugging Face</h3></div>
          <div className="dataList">
            <div className="dataRow">
              <div>
                <strong>Access token</strong>
                <span>Used by Ori's server-side intelligence layer to authenticate with Hugging Face.</span>
              </div>
              <span>Secure</span>
            </div>
            <form action="/api/settings/intelligence" method="post" style={{display:'grid', gap:'12px', marginTop:'16px'}}>
              <label htmlFor="hf-token">Hugging Face token</label>
              <input id="hf-token" name="hfToken" type="password" autoComplete="off" placeholder="hf_••••••••••••••••" required />
              <button type="submit">Save token</button>
            </form>
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Ori model</h3></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>TensorFlow Ori</strong><span>Ori's own model and training pipeline.</span></div><span>Core</span></div>
            <div className="dataRow"><div><strong>Qwen Mentor</strong><span>Mentor and teacher for improving Ori's model.</span></div><span>Mentor</span></div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
