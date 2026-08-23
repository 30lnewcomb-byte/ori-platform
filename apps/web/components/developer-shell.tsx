import type { ReactNode } from 'react'
import styles from './developer-shell.module.css'

type DeveloperNavItem = { label: string; href?: string; status?: string }

const developerNav: DeveloperNavItem[] = [
  { label: 'Overview', href: '/developer' },
  { label: 'Projects', status: 'Planned' },
  { label: 'API', status: 'Planned' },
  { label: 'Tools', status: 'Planned' },
  { label: 'Models', status: 'Planned' },
  { label: 'Events', status: 'Planned' },
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
            const className = isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            if (!item.href) {
              return (
                <span className={`${className} ${styles.planned}`} key={item.label} aria-disabled="true">
                  {item.label}
                  <small>{item.status}</small>
                </span>
              )
            }
            return (
              <a
                className={className}
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
