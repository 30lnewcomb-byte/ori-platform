import DeveloperShell from '../../../components/developer-shell'
import styles from '../resource.module.css'

const services = [
  ['Ori Platform', 'Web and control plane', 'Vercel', 'Connected'],
  ['Ori TensorFlow', 'Native learned intelligence runtime', 'Render', 'Connected'],
  ['Ori VM', 'Controlled execution runtime', 'Render', 'Connected'],
]

export default function DeveloperStatusPage() {
  return (
    <DeveloperShell active="Dashboard">
      <div className={styles.page}>
        <div className={styles.inner}>
          <a className={styles.breadcrumb} href="/developer/dashboard">Developer Console <span>→</span> Status</a>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>PLATFORM STATUS</p>
              <h1>Runtime status</h1>
              <p className={styles.lede}>A developer-facing view of the services that make up the current Ori platform boundary.</p>
            </div>
            <div className={styles.state}><span className={styles.dot} />Online</div>
          </header>
          <div className={styles.grid}>
            <section className={[styles.panel, styles.panelFull].join(' ')}>
              <div className={styles.panelHeader}><h2>Connected services</h2><span>PRIVATE TOPOLOGY</span></div>
              <div className={styles.list}>
                {services.map(([name, role, provider, state]) => (
                  <div className={styles.row} key={name}>
                    <span className={styles.icon}>●</span>
                    <div><strong>{name}</strong><small>{role}</small></div>
                    <span className={styles.badge}>{provider}</span>
                    <span className={styles.badge}>{{state}}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><h2>Boundary</h2><span>ARCHITECTURE</span></div>
              <pre className={styles.code}>Browser
  ↓
Ori Platform
  ↓
TensorFlow intelligence
  ↓
Optional VM execution</pre>
            </section>
            <section className={styles.panel}>
              <div className={styles.panelHeader}><h2>Security</h2><span>RULES</span></div>
              <div className={styles.copy}>
                <strong>Provider account credentials stay server-side.</strong>
                <span>The browser does not receive Render, Vercel, VM, or internal intelligence secrets.</span>
              </div>
            </section>
          </div>
          <footer className={styles.footer}><span>Ori Developer Platform</span><span>Infrastructure remains an implementation detail.</span></footer>
        </div>
      </div>
    </DeveloperShell>
  )
}
