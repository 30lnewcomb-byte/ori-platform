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
          <div className={styles.panelTop}>
            <span className={styles.panelBrand}>ORI</span>
            <span className={styles.liveMark}><i /> Ready</span>
          </div>
          <div className={styles.panelContent}>
            <span className={styles.panelEyebrow}>YOUR WORKSPACE</span>
            <strong>What are you working on?</strong>
            <span>Chat, code, explore an idea, or start something new.</span>
          </div>
          <div className={styles.panelComposer}>
            <span>Message Ori...</span>
            <span className={styles.sendIcon}>↑</span>
          </div>
        </div>
      </section>

      <section className={styles.valueSection} aria-labelledby="value-title">
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>BUILT AROUND THE WORK</p>
          <h2 id="value-title">Simple on the surface. Capable underneath.</h2>
          <p>Ori keeps the interface calm while the platform handles the complexity behind it.</p>
        </div>
        <div className={styles.valueGrid}>
          <article className={styles.valueCard}>
            <span className={styles.cardNumber}>01</span>
            <h3>Think</h3>
            <p>Have a conversation, work through a problem, or turn a rough idea into a clear next step.</p>
          </article>
          <article className={styles.valueCard}>
            <span className={styles.cardNumber}>02</span>
            <h3>Build</h3>
            <p>Move from discussion into practical work, with coding and developer tools available when they are needed.</p>
          </article>
          <article className={styles.valueCard}>
            <span className={styles.cardNumber}>03</span>
            <h3>Create</h3>
            <p>Make room for technical and creative projects without turning the main experience into a control panel.</p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>ORI PLATFORM</span>
      </footer>
    </main>
  )
}

function LandingRedirect() {
  const destination = '/chat'
  return (
    <meta httpEquiv="refresh" content={`0;url=${destination}`} />
  )
}
