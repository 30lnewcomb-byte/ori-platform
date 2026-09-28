import type { ReactNode } from 'react'
import styles from './app-shell.module.css'

type NavItem = { label: string; href: string }

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Chat', href: '/chat?new=1' },
]

export type AppSection = 'Home' | 'Chat'

export default function AppShell({
  active,
  contentClassName,
  children,
}: {
  active: AppSection
  contentClassName?: string
  children: ReactNode
}) {
  const contentClass = contentClassName ? `${styles.content} ${contentClassName}` : styles.content

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Primary navigation">
        <div className={styles.brand}>ORI</div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
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
        <div className={styles.sidebarBottom}>
          <details className={styles.moreMenu}>
            <summary className={styles.moreButton} aria-label="More options">•••</summary>
            <div className={styles.morePanel}>
              <a href="/developer/docs/ori" className={styles.moreItem}>
                <strong>About Ori</strong>
                <span>Read the system reference</span>
              </a>
              <a href="/developer" className={styles.moreItem}>
                <strong>Developer</strong>
                <span>Platform tools and reference</span>
              </a>
            </div>
          </details>
          <div className={styles.sidebarFooter}>Ori Platform</div>
        </div>
      </aside>
      <section className={contentClass}>{children}</section>
    </main>
  )
}
