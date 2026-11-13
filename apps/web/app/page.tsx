import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { ActionLink, FeatureCard, SectionHeading, SiteFrame } from '../components/public-site'
import styles from '../components/public-site.module.css'

export default async function HomePage() {
  const { userId } = await auth()
  if (userId) redirect('/chat')

  return (
    <SiteFrame>
      <main>
        <section className={styles.homeHero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>A PLATFORM FOR WHAT'S NEXT</p>
            <h1>Think clearly.<br />Build boldly.</h1>
            <p>Ori brings conversation, coding, and creative work into one focused place — so an idea can move from the first question to something real.</p>
            <div className={styles.heroActions}>
              <ActionLink href="/sign-up">Get started <span aria-hidden="true">↗</span></ActionLink>
              <ActionLink href="/products" secondary>Explore Ori</ActionLink>
            </div>
          </div>
          <div className={styles.heroAside} aria-label="Abstract Ori visual">
            <div className={styles.heroAsideTop}><span>ORI / PLATFORM</span><span>01 — 03</span></div>
            <div className={styles.heroOrb}><span>ORI</span></div>
            <div className={styles.heroAsideBottom}>A calm workspace for curiosity, problem-solving, and making things happen.</div>
          </div>
        </section>
        <section className={styles.homeBand}>
          <div className={styles.bandInner}>
            <div>
              <p className={styles.eyebrow}>ONE PLACE, MANY DIRECTIONS</p>
              <h2>Good ideas deserve room to grow.</h2>
            </div>
            <div><p>Some projects start with a question. Others start with a blank file, a sketch, or a problem that needs untangling. Ori is being built to support that whole journey without making the experience feel complicated.</p></div>
          </div>
        </section>
        <section className={styles.featureGrid}>
          <SectionHeading eyebrow="EXPLORE ORI" title="A workspace that can move with your ideas." description="Start with the part of the work that matters today. Explore the wider Ori ecosystem as your project grows." />
          <FeatureCard number="01 / PLATFORM" title="Ori Platform" description="A focused place to talk through ideas, learn, plan, and work with AI." href="/products" linkLabel="Explore the platform" />
          <FeatureCard number="02 / BUILD" title="Developer tools" description="A separate developer workspace is taking shape for projects, models, tools, and integrations." href="/developers" linkLabel="Meet the developer platform" />
          <FeatureCard number="03 / EXPERIMENT" title="Research & exploration" description="Follow the experiments and technical directions shaping what Ori could become." href="/research" linkLabel="Explore what we're exploring" />
        </section>
        <section className={styles.pageMain}>
          <div className={styles.callout}>
            <div><h2>Ready to get started?</h2><p>Step into the Ori workspace and see where your next idea goes.</p></div>
            <ActionLink href="/sign-up">Create your account <span aria-hidden="true">↗</span></ActionLink>
          </div>
        </section>
      </main>
    </SiteFrame>
  )
}
