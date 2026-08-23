import DeveloperShell from '../../components/developer-shell'
import styles from './developer.module.css'

const capabilities = [
  { title: 'API', text: 'Build applications that talk to Ori through a stable platform boundary.', icon: '↗' },
  { title: 'Projects', text: 'Give each application a durable workspace for resources, configuration, and activity.', icon: '□' },
  { title: 'Tools', text: 'Connect explicit capabilities to Ori through defined interfaces and permissions.', icon: '⌘' },
  { title: 'Events', text: 'Observe important platform activity and eventually connect it to webhooks and integrations.', icon: '◌' },
]

const platformPieces = ['Projects', 'API', 'Authentication', 'Tools', 'Models', 'Events', 'SDKs', 'Developer Docs']
const roadmap = ['Stable API contract', 'Project credentials', 'Developer console', 'Webhooks & events', 'SDKs', 'Developer documentation']

export default function DeveloperPage() {
  return (
    <DeveloperShell active="Overview">
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>DEVELOPER PLATFORM</p>
            <h1>Build with Ori.</h1>
            <p className={styles.lede}>A dedicated developer workspace for connecting applications to Ori&apos;s intelligence, tools, projects, and future execution capabilities.</p>
            <div className={styles.actions}><a className={styles.primary} href="#capabilities">Explore the platform</a><a className={styles.secondary} href="/developer/docs">Developer docs</a></div>
          </div>
          <div className={styles.statusCard} aria-label="Developer platform status"><div className={styles.statusTop}><span className={styles.statusDot} /><span>Platform foundation</span></div><strong>In active development</strong><p>The developer workspace is designed to feel distinct from Ori&apos;s assistant UI while remaining part of the same Ori Platform.</p></div>
        </section>
        <section className={styles.section} id="capabilities" aria-labelledby="capabilities-heading"><div className={styles.sectionHeading}><p className={styles.eyebrow}>CAPABILITIES</p><h2 id="capabilities-heading">The pieces developers will build on.</h2></div><div className={styles.grid}>{capabilities.map((item) => <article className={styles.card} key={item.title}><span className={styles.icon} aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p><span className={styles.coming}>Foundation in development</span></article>)}</div></section>
        <section className={styles.platform} aria-labelledby="platform-heading"><div><p className={styles.eyebrow}>PLATFORM SURFACE</p><h2 id="platform-heading">One platform. Clear boundaries.</h2><p>Ori Platform remains the main product. This developer workspace is its specialized interface for projects, intelligence, tools, authentication, events, and documentation.</p></div><div className={styles.pieceGrid} aria-label="Developer platform components">{platformPieces.map((piece, index) => <span key={piece} className={index === 0 ? styles.pieceFeatured : styles.piece}>{piece}</span>)}</div></section>
        <section className={styles.boundary} aria-labelledby="boundary-heading"><div><p className={styles.eyebrow}>ARCHITECTURE</p><h2 id="boundary-heading">The platform is not the runtime.</h2></div><div className={styles.flow} aria-label="Platform architecture"><span>Your application</span><b>↓</b><span>Ori Developer Platform API</span><b>↓</b><span>Ori intelligence · tools · platform services</span></div></section>
        <section className={styles.roadmap} id="roadmap" aria-labelledby="roadmap-heading"><div><p className={styles.eyebrow}>ROADMAP</p><h2 id="roadmap-heading">What we&apos;re building next.</h2></div><ul>{roadmap.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ul></section>
      </div>
    </DeveloperShell>
  )
}
