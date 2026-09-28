import DeveloperShell from '../../../components/developer-shell'
import styles from './docs.module.css'

const sections = [
  { title: 'Getting started', text: 'Learn the platform boundary, project model, and path to a first integration.', href: '/developer/projects' },
  { title: 'Platform overview', text: 'Understand how the Developer Platform sits around Ori capabilities.', href: '/developer/dashboard' },
  { title: 'API reference', text: 'Review the intended versioned API and current internal runtime contract.', href: '/developer/api' },
  { title: 'Authentication', text: 'See the planned developer identity, project credentials, and security boundary.', href: '/developer/authentication' },
  { title: 'Projects', text: 'Understand projects as the durable unit for developer resources.', href: '/developer/projects' },
  { title: 'Tools', text: 'Read about explicit capabilities, validation, and execution boundaries.', href: '/developer/tools' },
  { title: 'Models & intelligence', text: 'See the current Ori-native learned model stack.', href: '/developer/models' },
  { title: 'Activity & events', text: 'Understand the event model and future observability surface.', href: '/developer/activity' },
  { title: 'SDKs', text: 'See the first-party SDK direction and contract-first rule.', href: '/developer/sdk' },
  { title: 'Platform status', text: 'Inspect the documented service boundary and current topology.', href: '/developer/status' },
  { title: 'Guides', text: 'Practical architecture guidance for building on Ori without coupling to internal infrastructure.', href: '/developer/guides' },
]

export default function DeveloperDocsPage() {
  return (
    <DeveloperShell active="Docs">
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <a className={styles.back} href="/developer/dashboard">← Developer Console</a>
            <p className={styles.eyebrow}>DEVELOPER DOCS</p>
            <h1>Build with Ori.</h1>
            <p className={styles.lede}>The canonical guide to the Ori Developer Platform: capabilities, contracts, architecture, and what is actually live.</p>
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
              <span className={styles.link}>Open reference →</span>
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
