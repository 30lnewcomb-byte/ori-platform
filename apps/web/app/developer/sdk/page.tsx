import DeveloperShell from '../../../components/developer-shell'
import styles from '../resource.module.css'

export default function DeveloperSdkPage() {
  return (
    <DeveloperShell active="Docs">
      <div className={styles.page}>
        <div className={styles.inner}>
          <a className={styles.breadcrumb} href="/developer/docs">Developer Docs <span>→</span> SDKs</a>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>SDKS</p>
              <h1>Official SDKs</h1>
              <p className={styles.lede}>SDKs will wrap the stable Ori API rather than becoming a separate source of truth.</p>
            </div>
            <div className={styles.state}><span className={styles.dot} />Designing</div>
          </header>
          <div className={styles.grid}>
            <section className={[styles.panel, styles.panelFull].join(' ')}>
              <div className={styles.panelHeader}><h2>What the SDKs will do</h2><span>CONTRACT FIRST</span></div>
              <div className={styles.copy}>
                <strong>JavaScript/TypeScript and Python are the planned first-party targets.</strong>
                <span>The SDK surface will track the versioned public API, standardize authentication and errors, and keep request construction out of application code.</span>
                <div className={styles.note}>No install command is published yet because the public API contract is still being defined.</div>
              </div>
            </section>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><h2>Planned packages</h2><span>PLANNED</span></div>
              <div className={styles.list}>
                <div className={styles.row}><span className={styles.icon}>TS</span><div><strong>Ori JavaScript / TypeScript</strong><small>Typed client for web, Node.js, and server integrations.</small></div><span className={styles.badge}>PLANNED</span></div>
                <div className={styles.row}><span className={styles.icon}>PY</span><div><strong>Ori Python</strong><small>Python client for scripts, services, and AI workflows.</small></div><span className={styles.badge}>PLANNED</span></div>
              </div>
            </section>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><h2>Contract rule</h2><span>GUARDRAIL</span></div>
              <pre className={styles.code}>SDK → versioned public API → Ori Platform</pre>
            </section>
          </div>
          <footer className={styles.footer}><span>Ori Developer Platform</span><span>SDKs follow the public API contract.</span></footer>
        </div>
      </div>
    </DeveloperShell>
  )
}
