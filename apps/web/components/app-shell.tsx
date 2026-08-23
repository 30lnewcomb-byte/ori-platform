import type { ReactNode } from 'react'
import styles from './app-shell.module.css'

type NavItem = { label: string; href: string; newTab?: boolean }

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Chat', href: '/chat' },
  { label: 'Search', href: '/search' },
  { label: 'Projects', href: '/projects' },
  { label: 'Tasks', href: '/tasks' },
  { label: 'Activity', href: '/notifications' },
  { label: 'Ori World', href: '/sandbox' },
  { label: 'Developer', href: '/developer', newTab: true },
  { label: 'Settings', href: '/settings' },
]

export type AppSection = 'Home' | 'Chat' | 'Search' | 'Projects' | 'Tasks' | 'Activity' | 'Ori World' | 'Developer' | 'Settings'

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
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noreferrer' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
        <div className={styles.sidebarFooter}>Ori Platform</div>
      </aside>
      <section className={contentClass}>{children}</section>
    </main>
  )
}
