import DeveloperShell from '../../../components/developer-shell'
import styles from '../resource.module.css'

const guides = [
  {
    number: '01',
    title: 'Connect an application',
    text: 'Start with the platform boundary, understand project-scoped credentials, and target the stable API once it is released.',
  },
  {
    number: '02',
    title: 'Work with Ori intelligence',
    text: 'Understand the difference between public model access and the private intelligence runtime that powers Ori today.',
  },
  {
    number: '03',
    title: 'Design tool integrations',
    text: 'Keep capability registration, permissions, validation, and execution separated so model output never becomes an execution permission.',
  },
  {
    number: '04',
    title: 'Understand the cloud boundary',
    text: 'See how the Ori control plane, learned intelligence runtime, and optional execution environment communicate through server-side interfaces.',
  },
]

export default function DeveloperGuidesPage() {
  return (
    <DeveloperShell active="Docs">
      <div className={styles.page}>
        <div className={styles.inner}>
          <a className={styles.breadcrumb} href="/developer/docs">Developer Docs <span>→</span> Guides</a>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>GUIDES</p>
              <h1>Architecture guides</h1>
              <p className={styles.lede}>Implementation notes for working with Ori without coupling to its internal services.</p>
            </div>
            <div className={styles.state}><span className={styles.dot} />Reference</div>
          </header>
          <div className={styles.grid}>
            {guides.map((guide) => (
              <section className={styles.panel} key={guide.number}>
                <div className={styles.panelHeader}><h2>{guide.title}</h2><span>{guide.number}</span></div>
                <div className={styles.copy}><span>{guide.text}</span></div>
              </section>
            ))}
            <section className={[styles.panel, styles.panelFull].join(' ')}>
              <div className={styles.panelHeader}><h2>Platform rule</h2><span>BOUNDARY FIRST</span></div>
              <div className={styles.copy}>
                <strong>Use the Ori boundary, not the provider.</strong>
                <span>Applications should depend on documented Ori contracts. Vercel, Render, model artifacts, internal routes, and execution infrastructure stay behind the platform boundary.</span>
              </div>
            </section>
          </div>
          <footer className={styles.footer}><span>Ori Developer Platform</span><span><a href="/developer/docs">Back to docs</a></span></footer>
        </div>
      </div>
    </DeveloperShell>
  )
}
