'use client'

import { useEffect, useState, type ReactNode } from 'react'
import styles from './app-shell.module.css'

type SidebarChat = {
  id: string
  title: string
  updatedAt: number
}

type NavItem = { label: string; href: string }

const STORAGE_KEY = 'ori.chat.history.v1'

const toolItems: NavItem[] = [
  { label: 'Chat', href: '/chat?new=1' },
  { label: 'Developer', href: '/developer' },
]

function readRecentChats(): SidebarChat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.updatedAt === 'number',
      )
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 8)
  } catch {
    return []
  }
}

function formatChatDate(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  return sameDay
    ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

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
  const [recentChats, setRecentChats] = useState<SidebarChat[]>([])

  useEffect(() => {
    const syncHistory = () => setRecentChats(readRecentChats())
    syncHistory()
    window.addEventListener('ori:history-changed', syncHistory)
    window.addEventListener('storage', syncHistory)
    return () => {
      window.removeEventListener('ori:history-changed', syncHistory)
      window.removeEventListener('storage', syncHistory)
    }
  }, [])

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Primary navigation">
        <div className={styles.brand}>ORI</div>

        <a className={styles.newChat} href="/chat?new=1">
          <span aria-hidden="true">+</span>
          <strong>New chat</strong>
        </a>

        <div className={styles.sidebarScroll}>
          <section className={styles.section} aria-labelledby="tools-heading">
            <p id="tools-heading" className={styles.sectionLabel}>Tools</p>
            <nav className={styles.sectionNav}>
              {toolItems.map((item) => (
                <a className={styles.sidebarItem} href={item.href} key={item.label}>
                  {item.label}
                </a>
              ))}
            </nav>
          </section>

          {recentChats.length > 0 && (
            <section className={styles.section} aria-labelledby="chats-heading">
              <div className={styles.sectionHeader}>
                <p id="chats-heading" className={styles.sectionLabel}>Chats</p>
                <a className={styles.sectionLink} href="/chat?history=1">All</a>
              </div>
              <nav className={styles.chatList} aria-label="Recent chats">
                {recentChats.map((chat) => (
                  <a className={styles.chatItem} href={'/chat?chat=' + encodeURIComponent(chat.id)} key={chat.id}>
                    <span>{chat.title}</span>
                    <time dateTime={new Date(chat.updatedAt).toISOString()}>{formatChatDate(chat.updatedAt)}</time>
                  </a>
                ))}
              </nav>
            </section>
          )}

          {recentChats.length === 0 && (
            <section className={styles.section} aria-labelledby="chats-heading-empty">
              <div className={styles.sectionHeader}>
                <p id="chats-heading-empty" className={styles.sectionLabel}>Chats</p>
              </div>
              <a className={styles.emptyChats} href="/chat?new=1">
                Your conversations will appear here.
              </a>
            </section>
          )}
        </div>

        <div className={styles.sidebarBottom}>
          <details className={styles.moreMenu}>
            <summary className={styles.moreButton} aria-label="More options">•••</summary>
            <div className={styles.morePanel}>
              <a href="/developer/docs/ori" className={styles.moreItem}>
                <strong>About Ori</strong>
                <span>Read the system reference</span>
              </a>
            </div>
          </details>
          <div className={styles.sidebarFooter}>Ori Platform</div>
        </div>
      </aside>

      <nav className={styles.mobileNav} aria-label="Mobile navigation">
        <a href="/" className={active === 'Home' ? styles.mobileActive : ''}>Home</a>
        <a href="/chat?new=1">New chat</a>
        <a href="/chat?history=1" className={active === 'Chat' ? styles.mobileActive : ''}>Chats</a>
        <a href="/developer">Developer</a>
      </nav>

      <section className={contentClass}>{children}</section>
    </main>
  )
}
