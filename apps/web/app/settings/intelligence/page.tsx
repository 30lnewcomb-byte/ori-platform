import AppShell from '../../../components/app-shell'

export default function IntelligenceSettingsPage() {
  return (
    <AppShell active="Home">
      <header className="topbar">
        <div>
          <p className="eyebrow">SETTINGS · INTELLIGENCE</p>
          <h1>Ori intelligence.</h1>
          <p className="appIntro">
            Manage Ori&apos;s native intelligence runtime. Model services stay server-side and
            are accessed through Ori&apos;s authenticated platform boundary.
          </p>
        </div>
      </header>

      <div className="homeGrid">
        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Ori TensorFlow Runtime</h3></div>
          <div className="dataList">
            <div className="dataRow">
              <div>
                <strong>Native intelligence</strong>
                <span>Ori&apos;s TensorFlow/Keras models run behind a private server-side runtime.</span>
              </div>
              <span>Core</span>
            </div>
            <div className="dataRow">
              <div>
                <strong>Runtime connection</strong>
                <span>The web application connects to the runtime with a server-side credential that is never sent to the browser.</span>
              </div>
              <span>Server-side</span>
            </div>
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Models</h3></div>
          <div className="dataList">
            <div className="dataRow">
              <div>
                <strong>ori-core</strong>
                <span>Current TensorFlow/Keras learned model for intent classification.</span>
              </div>
              <span>0.1.0</span>
            </div>
            <div className="dataRow">
              <div>
                <strong>Ori language model</strong>
                <span>Generative TensorFlow model slot reserved for the next intelligence stage.</span>
              </div>
              <span>In development</span>
            </div>
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionHeader"><h3>Provider policy</h3></div>
          <div className="dataList">
            <div className="dataRow">
              <div>
                <strong>External model providers</strong>
                <span>Ori&apos;s production intelligence path is provider-independent and does not use an external hosted chat provider.</span>
              </div>
              <span>Native</span>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
