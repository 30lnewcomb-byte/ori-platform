import { auth } from '@clerk/nextjs/server'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import styles from './landing.module.css'

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect('/chat')

  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Main navigation">
        <a href="/" className={styles.brand} aria-label="Ori home">ORI</a>
        <div className={styles.navActions}>
          <SignInButton mode="redirect" forceRedirectUrl="/chat">
            <button className={styles.signIn} type="button">Sign in</button>
          </SignInButton>
          <SignUpButton mode="redirect" forceRedirectUrl="/onboarding">
            <button className={styles.signUp} type="button">Create account</button>
          </SignUpButton>
        </div>
      </nav>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>ORI PLATFORM</p>
          <h1 id="hero-title">A place for your ideas to become work.</h1>
          <p className={styles.lede}>
            Ori is a personal AI platform for thinking, building, coding, and creating —
            designed to keep the experience focused on the work in front of you.
          </p>
          <div className={styles.heroActions}>
            <SignUpButton mode="redirect" forceRedirectUrl="/onboarding">
              <button className={styles.primaryCta} type="button">Get started</button>
            </SignUpButton>
            <SignInButton mode="redirect" forceRedirectUrl="/chat">
              <button className={styles.secondaryCta} type="button">Sign in</button>
            </SignInButton>
          </div>
          <p className={styles.note}>Start with an account. Your conversations stay with your Ori workspace.</p>
        </div>

        <div className={styles.heroPanel} aria-label="Ori workspace preview">
          {/* Workspace preview components omitted for brevity; see full file structure in the original source */}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>ORI PLATFORM</span>
        <div style={{ marginTop: '0.75rem' }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{ display: 'inline-flex', alignItems: 'center', color: '#000000' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  )
}
