import DeveloperShell from '../../../components/developer-shell'
import styles from './docs.module.css'

const sections = [
  ['Getting started', 'Platform concepts, projects, authentication, and the path to your first integration.'],
  ['Platform overview', 'Projects, API boundaries, tools, intelligence, events, authentication, and the Developer Console.'],
  ['API reference', 'HTTP interfaces, request formats, responses, errors, and versioning.'],
  ['Authentication', 'Developer identity, project credentials, permissions, and revocation.'],
  ['Projects', 'Projects as the durable unit for application configuration, resources, tools, and activity.'],
  ['Tools', 'Explicit interfaces, permissions, and execution contracts for capabilities.'],
  ['SDKs', 'Official SDKs and language-specific integration patterns.'],
  ['Guides', 'Practical workflows for building with Ori Platform.'],
]

export default function DeveloperDocsPage() {
  return (
    <DeveloperShell active="Docs">
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <a className={styles.back} href="/developer">← Developer Platform</a>
            <p className={styles.eyebrow}>DEVELOPER DOCS</p>
            <h1>Build with Ori.</h1>
            <p className={styles.lede}>Reference material for Ori Platform developers.</p>
          </div>
          <div className={styles.version}>PLATFORM REFERENCE</div>
        </header>
        <section className={styles.grid} aria-label="Developer documentation sections">
          {sections.map(([title, text], index) => (
            <article className={styles.card} key={title}>
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>
        <footer className={styles.footer}>
          <a href="/developer">Developer Platform</a>
          <a href="/">Ori Platform</a>
        </footer>
      </div>
    </DeveloperShell>
  )
}
