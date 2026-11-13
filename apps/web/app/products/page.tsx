import { ActionLink, FeatureCard, PageIntro, SiteFrame } from '../../components/public-site'
import styles from '../../components/public-site.module.css'

export default function ProductsPage() {
  return <SiteFrame><main className={styles.pageMain}>
    <PageIntro eyebrow="PRODUCTS / ORI" title="A growing set of tools for getting things done." description="Ori is being developed as a connected ecosystem: a focused AI workspace today, with more specialized tools and capabilities taking shape around it." />
    <section className={styles.pageSection}>
      <div className={styles.pageCards}>
        <FeatureCard number="01 / AVAILABLE WORKSPACE" title="Ori Platform" description="The main Ori experience for conversations, thinking through problems, and moving projects forward." href="/sign-up" linkLabel="Open Ori" />
        <FeatureCard number="02 / IN DEVELOPMENT" title="Ori Mechanic" description="A separate project focused on helping with technical work through carefully scoped tools and human oversight." href="/developers" linkLabel="Explore the developer ecosystem" />
        <FeatureCard number="03 / MODEL PROJECT" title="Ori Small" description="A compact model effort intended to support selected Ori workflows. It is still part of the development roadmap." href="/research" linkLabel="See what we're exploring" />
      </div>
    </section>
    <div className={styles.callout}><div><h2>Start with the Ori workspace.</h2><p>Use the platform that is available now while the wider ecosystem continues to develop.</p></div><ActionLink href="/sign-up">Get started ↗</ActionLink></div>
  </main></SiteFrame>
}
