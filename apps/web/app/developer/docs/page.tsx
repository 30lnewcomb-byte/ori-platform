import DeveloperShell from '../../../components/developer-shell'
import styles from './docs.module.css'

const sections = [
  { title: 'Ori — complete reference', text: 'Product and engineering reference for Ori.', href: '/developer/docs/ori' },
  { title: 'Getting started', text: 'Platform boundaries and current integration path.', href: '/developer/guides' },
  { title: 'Platform overview', text: 'How the Developer Platform is organized.', href: '/developer/dashboard' },
  { title: 'API reference', text: 'Public API direction and current internal runtime contract.', href: '/developer/api' },
  { title: 'Authentication', text: 'Developer identity, project credentials, and security boundary.', href: '/developer/authentication' },
  { title: 'Projects', text: 'Project model and current state.', href: '/developer/projects' },
  { title: 'Tools', text: 'Tool registration, validation, and execution boundaries.', href: '/developer/tools' },
  { title: 'Models & intelligence', text: 'Current Ori-native model stack.', href: '/developer/models' },
  { title: 'Activity & events', text: 'Event model and current observability state.', href: '/developer/activity' },
  { title: 'SDKs', text: 'First-party SDK direction.', href: '/developer/sdk' },
  { title: 'Platform status', text: 'Documented service boundary and topology.', href: '/developer/status' },
  { title: 'Guides', text: 'Architecture notes for working with Ori without coupling to internal infrastructure.', href: '/developer/guides' },
]

export default function DeveloperDocsPage() {
  return (
    <DeveloperShell active="Docs">
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <a className={styles.back} href="/developer/dashboard">← Developer Console</a>
            <p className={styles.eyebrow}>DEVELOPER DOCS</p>
            <h1>Developer docs</h1>
            <p className={styles.lede}>Reference material for the Ori platform: capabilities, contracts, architecture, and implementation status.</p>
          </div>
          <div className={styles.version}>PLATFORM REFERENCE</div>
        </header>

        <div className={styles.notice}>
          <strong>Documentation rule</strong>
          <span>Available capabilities are described as available. Planned or in-development capabilities are labeled explicitly rather than presented as live APIs.</span>
        </div>

        <section className={styles.grid} aria-label="Developer documentation sections">
          {sections.map((section, index) => (
            <a className={styles.card} href={section.href} key={section.title}>
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              <span className={styles.link}>Open →</span>
            </a>
          ))}
        </section>

        <footer className={styles.footer}>
          <a href="/developer/dashboard">Dashboard</a>
          <a href="/developer/status">Status</a>
          <a href="/">Ori Platform</a>
        </footer>
      </div>
    </DeveloperShell>
  )
}
