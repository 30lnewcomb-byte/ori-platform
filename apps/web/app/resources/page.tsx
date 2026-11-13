import { ActionLink, FeatureCard, PageIntro, SiteFrame } from '../../components/public-site'
import styles from '../../components/public-site.module.css'

export default function ResourcesPage() {
  return <SiteFrame><main className={styles.pageMain}>
    <PageIntro eyebrow="RESOURCES / GET INVOLVED" title="Find your way around the Ori ecosystem." description="A starting point for exploring the platform, following development, and finding the projects behind the work." />
    <section className={styles.pageSection}>
      <div className={styles.pageCards}>
        <FeatureCard number="01 / START HERE" title="Ori Platform" description="Visit the main workspace and begin with a conversation or an idea." href="/sign-up" linkLabel="Get started" />
        <FeatureCard number="02 / SOURCE CODE" title="GitHub" description="Explore the public repositories and follow changes as the projects develop." href="https://github.com/30lnewcomb-byte" linkLabel="Visit GitHub ↗" />
        <FeatureCard number="03 / DEVELOPERS" title="Developer Platform" description="See the separate developer project and its ongoing implementation." href="/developers" linkLabel="Explore developer resources" />
      </div>
    </section>
    <div className={styles.callout}><div><h2>Have a project in mind?</h2><p>Open Ori and start working through the first step.</p></div><ActionLink href="/sign-up">Open Ori ↗</ActionLink></div>
  </main></SiteFrame>
}
