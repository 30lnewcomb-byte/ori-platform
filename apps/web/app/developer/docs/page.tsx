import AppShell from '../../../components/app-shell'
import styles from './docs.module.css'

const sections = [
  ['Getting started', 'Learn the platform concepts and the path from your first project to your first integration.'],
  ['Platform overview', 'Understand Projects, API boundaries, tools, intelligence, events, authentication, and the Developer Console.'],
  ['API reference', 'Reference the stable HTTP interface, request formats, responses, errors, and versioning as the API becomes available.'],
  ['Authentication', 'Learn how developer identity, project-scoped credentials, permissions, and revocation will work.'],
  ['Projects', 'Use projects as the durable unit for application configuration, resources, tools, and activity.'],
  ['Tools', 'Connect capabilities to Ori through explicit interfaces, permissions, and execution contracts.'],
  ['SDKs', 'Use official SDKs once the public API contract is stable.'],
  ['Guides', 'Follow practical workflows for building integrations and working with Ori capabilities.'],
]

export default function DeveloperDocsPage() {
  return (
    <AppShell active="Developer">
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <a className={styles.back} href="/developer">← Developer Platform</a>
            <p className={styles.eyebrow}>ORI DEVELOPER DOCS</p>
            <h1>Build with Ori.</h1>
            <p className={styles.lede}>The documentation home for Ori Platform developers.</p>
          </div>
          <div className={styles.version}>EARLY DEVELOPMENT</div>
        </header>
        <section className={styles.notice}>
          <strong>Documentation follows the product.</strong>
          <span>Only capabilities that are actually implemented will be documented as available. Planned features are clearly marked so the docs never pretend Ori can do something it cannot.</span>
        </section>
        <section className={styles.grid} aria-label="Developer documentation sections">
          {sections.map(([title, text], index) => (
            <a
              className={styles.card}
              href={`#${title.toLowerCase().replaceAll(' ', '-')}`}
              key={title}
              id={title.toLowerCase().replaceAll(' ', '-')}
            >
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <h2>{title}</h2>
              <p>{text}</p>
              <span className={styles.link}>Read section →</span>
            </a>
          ))}
        </section>
        <footer className={styles.footer}>
          <a href="/developer">Developer Platform</a>
          <a href="/">Ori Platform</a>
        </footer>
      </div>
    </AppShell>
  )
}
