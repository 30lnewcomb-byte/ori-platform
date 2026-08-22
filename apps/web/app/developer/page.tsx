import styles from './developer.module.css'

const capabilities = [
  { title: 'API', text: 'Build applications that talk to Ori through a stable platform boundary.', icon: '↗' },
  { title: 'Projects', text: 'Keep conversations, resources, sandboxes, and integrations organized.', icon: '□' },
  { title: 'Sandbox', text: 'Give Ori isolated execution space with explicit permissions and limits.', icon: '⌘' },
  { title: 'Events', text: 'Connect your systems to important activity through future webhooks and events.', icon: '◌' },
]

const roadmap = ['Typed API', 'Project credentials', 'Webhooks & events', 'SDKs', 'Developer documentation']

export default function DeveloperPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>ORI DEVELOPER PLATFORM</p>
          <h1>Build with Ori.</h1>
          <p className={styles.lede}>
            A developer surface for connecting your applications to Ori’s intelligence,
            tools, projects, and execution environment.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#roadmap">Explore the platform</a>
            <a className={styles.secondary} href="/">Back to Ori</a>
          </div>
        </div>
        <div className={styles.statusCard} aria-label="Developer platform status">
          <div className={styles.statusTop}>
            <span className={styles.statusDot} />
            <span>Platform foundation</span>
          </div>
          <strong>In active development</strong>
          <p>Core APIs and developer tooling are being designed around the Ori platform architecture.</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="capabilities-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>CAPABILITIES</p>
          <h2 id="capabilities-heading">The pieces developers will build on.</h2>
        </div>
        <div className={styles.grid}>
          {capabilities.map((item) => (
            <article className={styles.card} key={item.title}>
              <span className={styles.icon} aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className={styles.coming}>Building the foundation</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.platform}>
        <div>
          <p className={styles.eyebrow}>DESIGNED FOR ORI</p>
          <h2>One platform. Clear boundaries.</h2>
          <p>
            The developer platform sits above Ori’s intelligence and execution layers,
            so applications can use capabilities without coupling themselves to internal implementation details.
          </p>
        </div>
        <div className={styles.flow} aria-label="Platform architecture">
          <span>Your application</span>
          <b>↓</b>
          <span>Ori Platform API</span>
          <b>↓</b>
          <span>Intelligence · Tools · Sandbox</span>
        </div>
      </section>

      <section className={styles.roadmap} id="roadmap" aria-labelledby="roadmap-heading">
        <div>
          <p className={styles.eyebrow}>ROADMAP</p>
          <h2 id="roadmap-heading">What we’re building next.</h2>
        </div>
        <ul>
          {roadmap.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
