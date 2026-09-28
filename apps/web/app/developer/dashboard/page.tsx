import DeveloperShell from '../../../components/developer-shell'
import styles from './dashboard.module.css'

const resources = [
  { name: 'Projects', detail: 'Durable developer workspaces', status: 'Foundation ready', href: '/developer/projects' },
  { name: 'API', detail: 'Stable public interface', status: 'In development', href: '/developer/api' },
  { name: 'Authentication', detail: 'Identity and project access', status: 'Designing', href: '/developer/authentication' },
  { name: 'Models', detail: 'Ori intelligence access', status: '2 internal models', href: '/developer/models' },
  { name: 'Tools', detail: 'Explicit capability connections', status: '2 internal tools', href: '/developer/tools' },
  { name: 'Activity', detail: 'Events and observability', status: 'Foundation ready', href: '/developer/activity' },
  { name: 'SDKs', detail: 'First-party integration clients', status: 'Planned', href: '/developer/sdk' },
]

const services = [
  { name: 'Ori Platform', role: 'Web & control plane', provider: 'Vercel', state: 'Connected' },
  { name: 'Ori TensorFlow', role: 'Native learned intelligence', provider: 'Render', state: 'Connected' },
  { name: 'Ori VM', role: 'Controlled execution', provider: 'Render', state: 'Connected' },
]

const docs = [
  { title: 'Getting started', detail: 'Understand the current platform boundary.', href: '/developer/docs' },
  { title: 'API reference', detail: 'Review internal runtime contracts and public API direction.', href: '/developer/docs' },
  { title: 'Models & intelligence', detail: 'See the current ori-core and ori-small stack.', href: '/developer/docs' },
  { title: 'Cross-cloud architecture', detail: 'See how the independently deployed services communicate.', href: '/developer/docs' },
]

export default function DeveloperDashboardPage() {
  return (
    <DeveloperShell active="Dashboard">
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>DEVELOPER DASHBOARD</p>
            <h1>Everything in one place.</h1>
            <p className={styles.lede}>
              Manage the Ori developer surface, inspect platform resources, and see what is connected without exposing infrastructure complexity to the assistant UI.
            </p>
          </div>
          <div className={styles.headerActions}>
            <a className={styles.primary} href="/developer/docs">Read docs</a>
            <a className={styles.secondary} href="/developer">Platform overview</a>
          </div>
        </header>

        <section className={styles.statusStrip} aria-label="Platform status">
          <div className={styles.statusLead}>
            <span className={styles.statusDot} />
            <div>
              <strong>Ori Developer Platform</strong>
              <span>Developer workspace is available.</span>
            </div>
          </div>
          <span className={styles.statusTag}>ONLINE</span>
        </section>

        <section className={styles.metrics} aria-label="Platform summary">
          <article className={styles.metric}>
            <span>PROJECTS</span>
            <strong>0</strong>
            <p>No developer projects yet.</p>
          </article>
          <article className={styles.metric}>
            <span>MODELS</span>
            <strong>2</strong>
            <p>Ori-native learned models in the internal runtime.</p>
          </article>
          <article className={styles.metric}>
            <span>TOOLS</span>
            <strong>2</strong>
            <p>Internal server-side tool interfaces.</p>
          </article>
          <article className={styles.metric}>
            <span>PUBLIC API</span>
            <strong>BUILDING</strong>
            <p>The stable public contract is still in development.</p>
          </article>
        </section>

        <section className={styles.twoColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>RESOURCES</p>
                <h2>Developer resources</h2>
              </div>
              <span className={styles.muted}>7 surfaces</span>
            </div>
            <div className={styles.resourceList}>
              {resources.map((resource) => (
                <a className={styles.resourceRow} href={resource.href} key={resource.name}>
                  <span className={styles.resourceIcon}>{resource.name.slice(0, 1)}</span>
                  <span className={styles.resourceCopy}>
                    <strong>{resource.name}</strong>
                    <small>{resource.detail}</small>
                  </span>
                  <span className={styles.resourceStatus}>{resource.status}</span>
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>SERVICES</p>
                <h2>Connected runtimes</h2>
              </div>
              <span className={styles.muted}>Private</span>
            </div>
            <div className={styles.serviceList}>
              {services.map((service) => (
                <div className={styles.serviceRow} key={service.name}>
                  <span className={styles.serviceState} />
                  <div>
                    <strong>{service.name}</strong>
                    <small>{service.role}</small>
                  </div>
                  <span className={styles.provider}>{service.provider}</span>
                  <span className={styles.connected}>{service.state}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.twoColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>QUICK START</p>
                <h2>Build your first integration</h2>
              </div>
            </div>
            <div className={styles.quickStart}>
              <div><span>01</span><strong>Understand the platform boundary</strong><p>Start with the architecture and current implementation status.</p></div>
              <div><span>02</span><strong>Read the API direction</strong><p>The public API is being designed independently from internal runtime routes.</p></div>
              <div><span>03</span><strong>Connect when the contract is ready</strong><p>Use project-scoped credentials and stable versioned endpoints once released.</p></div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>DOCUMENTATION</p>
                <h2>Developer Docs</h2>
              </div>
              <a className={styles.panelLink} href="/developer/status">View status →</a>
            </div>
            <div className={styles.docsList}>
              {docs.map((doc) => (
                <a className={styles.docRow} href={doc.href} key={doc.title}>
                  <span><strong>{doc.title}</strong><small>{doc.detail}</small></span>
                  <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Ori Developer Platform</span>
          <span>Public API: in development · <a href="/developer/status">System status</a></span>
        </footer>
      </div>
    </DeveloperShell>
  )
}
