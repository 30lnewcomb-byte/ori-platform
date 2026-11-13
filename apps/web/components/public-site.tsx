import type { ReactNode } from 'react'
import Link from 'next/link'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import styles from './public-site.module.css'

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/developers', label: 'Developers' },
  { href: '/research', label: 'Research' },
  { href: '/company', label: 'Company' },
  { href: '/resources', label: 'Resources' },
]

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark} aria-label="Ori home">ORI<span> / </span></Link>
        <nav className={styles.navigation} aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <SignInButton mode="redirect" forceRedirectUrl="/chat">
            <button className={styles.textButton} type="button">Sign in</button>
          </SignInButton>
          <SignUpButton mode="redirect" forceRedirectUrl="/onboarding">
            <button className={styles.smallCta} type="button">Get started <span aria-hidden="true">↗</span></button>
          </SignUpButton>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link href="/" className={styles.footerBrand}>ORI</Link>
          <p>Tools for thinking, building, and making ideas real.</p>
          <div className={styles.footerLinks}>
            {navigation.slice(1).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <a href="https://github.com/30lnewcomb-byte" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Ori</span>
          <span>Built with curiosity.</span>
        </div>
      </footer>
    </div>
  )
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className={styles.pageIntro}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

export function FeatureCard({ number, title, description, href, linkLabel }: {
  number: string; title: string; description: string; href?: string; linkLabel?: string
}) {
  return (
    <article className={styles.featureCard}>
      <span className={styles.cardNumber}>{number}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {href && <Link href={href} className={styles.cardLink}>{linkLabel ?? 'Learn more'} <span aria-hidden="true">↗</span></Link>}
    </article>
  )
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className={styles.sectionHeading}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

export function ActionLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return <Link className={secondary ? styles.secondaryCta : styles.primaryCta} href={href}>{children}</Link>
}
