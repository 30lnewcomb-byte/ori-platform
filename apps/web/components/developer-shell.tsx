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
      <aside className={styles.sidebar} aria-label="Developer navigation">
        <div className={styles.brandRow}>
          <a className={styles.brand} href="/" aria-label="Return to Ori Platform">ORI</a>
          <span className={styles.product}>Developer</span>
        </div>

        <nav className={styles.nav}>
          {developerNav.map((item) => {
            const isActive = item.label === active
            return (
              <a
                className={isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
                href={item.href}
                key={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className={styles.footer}>
          <a href="/">← Back to Ori</a>
        </div>
      </aside>
      <section className={styles.content}>{children}</section>
    </main>
  )
}
