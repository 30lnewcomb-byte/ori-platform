import { ActionLink, FeatureCard, PageIntro, SiteFrame } from '../../components/public-site'
import styles from '../../components/public-site.module.css'

export default function CompanyPage() {
  return <SiteFrame><main className={styles.pageMain}>
    <PageIntro eyebrow="COMPANY / ABOUT ORI" title="Built around curiosity, useful tools, and real work." description="Ori is an independent technology project exploring how AI can help people think, build, code, and create — with a focus on practical tools and understandable systems." />
    <section className={styles.pageSection}>
      <div className={styles.pageCards}>
        <FeatureCard number="01 / PURPOSE" title="Make technology useful" description="The goal is to turn capable technology into tools that help people make progress on the things they care about." />
        <FeatureCard number="02 / APPROACH" title="Keep it understandable" description="Clear interfaces, honest status, and human oversight should be part of the product — not afterthoughts." />
        <FeatureCard number="03 / DIRECTION" title="Build step by step" description="Ori is evolving through experiments and working software. Pages should distinguish what exists today from what is still being built." />
      </div>
    </section>
    <div className={styles.callout}><div><h2>Follow the work.</h2><p>Explore the public projects and development activity behind Ori.</p></div><ActionLink href="https://github.com/30lnewcomb-byte">Visit GitHub ↗</ActionLink></div>
  </main></SiteFrame>
}
