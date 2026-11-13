import { FeatureCard, PageIntro, SiteFrame } from '../../components/public-site'
import styles from '../../components/public-site.module.css'

export default function ResearchPage() {
  return <SiteFrame><main className={styles.pageMain}>
    <PageIntro eyebrow="RESEARCH / EXPLORATION" title="Curiosity is where the work begins." description="Ori's research direction is about learning what works, testing ideas carefully, and making technical choices that are useful in the real world." />
    <section className={styles.pageSection}>
      <div className={styles.pageCards}>
        <FeatureCard number="01 / MODELS" title="Practical intelligence" description="Explore compact and specialized model approaches that can support useful workflows without unnecessary cost or complexity." />
        <FeatureCard number="02 / SYSTEMS" title="Reliable by design" description="Investigate how components can work together, recover from failures, and communicate their real status clearly." />
        <FeatureCard number="03 / HUMAN CONTROL" title="People stay in charge" description="Build around clear permissions, reviewable actions, and a human deciding when a system should act." />
      </div>
    </section>
    <p className={styles.appIntro}>This page describes areas of exploration, not claims of completed research or released capabilities. Updates can be added here as work is verified.</p>
  </main></SiteFrame>
}
