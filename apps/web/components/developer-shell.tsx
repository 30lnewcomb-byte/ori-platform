import type { ReactNode } from 'react'
import styles from './developer-shell.module.css'

type DeveloperNavItem = { label: string; href: string }

const developerNav: DeveloperNavItem[] = [
  { label: 'Overview', href: '/developer' },
  { label: 'Projects', href: '/developer/projects' },
  { label: 'API', href: '/developer/api' },
  { label: 'Tools', href: '/developer/tools' },
  { label: 'Models', href: '/developer/models' },
  { label: 'Events', href: '/developer/events' },
  { label: 'Docs', href: '/developer/docs' },
]

export default function DeveloperShell({
  active,
  children,
}: {
  active: string
  children: ReactNode
}) {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <a className={styles.brand} href="/" aria-label="Return to Ori Platform">ORI</a>
          <span className={styles.product}>Developer Platform</span>
        </div>
        <nav className={styles.tabs} aria-label="Developer Platform navigation">
          {developerNav.map((item) => {
            const isActive = item.label === active
            return (
              <a
                className={isActive ? `${styles.tab} ${styles.active}` : styles.tab}
                href={item.href}
                key={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
        <a className={styles.back} href="/">Back to Ori</a>
      </header>
      <section className={styles.content}>{children}</section>
    </main>
  )
}
