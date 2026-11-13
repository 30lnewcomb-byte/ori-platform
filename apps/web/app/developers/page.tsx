import { ActionLink, FeatureCard, PageIntro, SiteFrame } from '../../components/public-site'
import styles from '../../components/public-site.module.css'

const developerProject = process.env.NEXT_PUBLIC_DEVELOPER_PLATFORM_URL || 'https://github.com/30lnewcomb-byte/ori-developer-platform'

export default function DevelopersPage() {
  return <SiteFrame><main className={styles.pageMain}>
    <PageIntro eyebrow="DEVELOPERS / BUILD WITH ORI" title="A workspace for the people building what comes next." description="The Ori developer experience is a separate project from the main Ori Platform. Its goal is to bring project work, model access, tools, and developer workflows into one place." />
    <section className={styles.pageSection}>
      <div className={styles.pageCards}>
        <FeatureCard number="01 / WORKSPACE" title="Developer Platform" description="A dedicated application is being built for managing projects and exploring the Ori developer ecosystem." href={developerProject} linkLabel="View developer project ↗" />
        <FeatureCard number="02 / MODELS" title="Model access" description="The platform is being designed to make model capabilities and their availability easier to understand. Live integrations are still being developed." />
        <FeatureCard number="03 / TOOLS" title="Build with clarity" description="The direction is a practical toolset with clear states, explicit permissions, and no pretend-connected services." />
      </div>
    </section>
    <div className={styles.callout}><div><h2>Two projects. One connected direction.</h2><p>The Developer Platform remains its own repository and application, separate from Ori Platform.</p></div><ActionLink href={developerProject}>Explore the developer project ↗</ActionLink></div>
  </main></SiteFrame>
}
