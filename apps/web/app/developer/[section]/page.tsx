import { notFound } from 'next/navigation'
import DeveloperShell from '../../../components/developer-shell'
import styles from '../resource.module.css'

type Resource = {
  label: string
  eyebrow: string
  title: string
  description: string
  status: string
  statusTone?: 'ready' | 'building'
  summary: string
  facts: { label: string; value: string; detail: string }[]
  links: { label: string; href: string }[]
  code?: string
  note?: string
}

const resources: Record<string, Resource> = {
  projects: {
    label: 'Projects',
    eyebrow: 'PROJECTS',
    title: 'Project workspaces',
    description: 'Projects are the durable unit for applications built with Ori. They are designed to own configuration, credentials, tools, model access, and activity.',
    status: 'Foundation ready',
    statusTone: 'ready',
    summary: 'The project model is defined, but durable developer project storage and account-scoped creation are not enabled yet.',
    facts: [
      { label: 'UNIT', value: 'Project', detail: 'The top-level boundary for developer resources.' },
      { label: 'CURRENT', value: '0', detail: 'No developer projects are provisioned yet.' },
      { label: 'DESIGNED FOR', value: 'Apps', detail: 'Each app gets its own resources and credentials.' },
    ],
    links: [
      { label: 'Authentication', href: '/developer/authentication' },
      { label: 'API direction', href: '/developer/api' },
      { label: 'Developer docs', href: '/developer/docs' },
    ],
    note: 'No project creation button is presented as live until account identity and project persistence are connected.'
  },
  api: {
    label: 'API',
    eyebrow: 'API',
    title: 'Ori API surface',
    description: 'The public API is being designed as a stable, versioned contract in front of Ori capabilities. Internal runtime routes remain implementation details.',
    status: 'In development',
    statusTone: 'building',
    summary: 'The current production boundary is server-side. The stable developer API should be project-scoped and versioned before external credentials are issued.',
    facts: [
      { label: 'PUBLIC', value: 'Building', detail: 'No stable public developer contract is released yet.' },
      { label: 'VERSION', value: 'v1', detail: 'Planned namespace for the first stable public contract.' },
      { label: 'AUTH', value: 'Project', detail: 'Planned project-scoped credentials and permissions.' },
    ],
    links: [
      { label: 'Authentication', href: '/developer/authentication' },
      { label: 'Models', href: '/developer/models' },
      { label: 'Tools', href: '/developer/tools' },
    ],
    code: 'POST /v1/chat\nAuthorization: Bearer <project-key>\nContent-Type: application/json\n\n{\n  "messages": [\n    { "role": "user", "content": "Hello, Ori." }\n  ]\n}',
    note: 'This request shape illustrates the intended developer contract. It is not a released public endpoint.'
  },
  tools: {
    label: 'Tools',
    eyebrow: 'TOOLS',
    title: 'Tool connections',
    description: 'Tools are explicit capabilities connected through defined interfaces, validation, and execution boundaries.',
    status: 'Internal tools ready',
    statusTone: 'ready',
    summary: 'Ori currently has two internal server-side tool interfaces. The model proposes a call; the platform validates and commits execution.',
    facts: [
      { label: 'TOOLS', value: '2', detail: 'Current internal interfaces.' },
      { label: 'EXECUTION', value: 'Server', detail: 'Tools never execute directly in the browser.' },
      { label: 'CONTROL', value: 'Validated', detail: 'The platform keeps model output separate from execution permission.' },
    ],
    links: [
      { label: 'Models', href: '/developer/models' },
      { label: 'API', href: '/developer/api' },
      { label: 'Architecture', href: '/developer/docs' },
    ],
    code: 'run_sandbox_command\nwrite_workspace_file',
    note: 'These are internal platform interfaces, not public developer tools yet.'
  },
  models: {
    label: 'Models',
    eyebrow: 'MODELS',
    title: 'Ori intelligence',
    description: 'Model access sits behind the Ori Platform boundary. The current stack contains Ori-native learned models running in the private intelligence runtime.',
    status: '2 internal models',
    statusTone: 'ready',
    summary: 'Two internal models are currently part of the Ori intelligence stack; their runtime access is not exposed directly to the browser.',
    facts: [
      { label: 'ORI-CORE', value: 'Classifier', detail: 'Learned TensorFlow/Keras conversation and intent classification.' },
      { label: 'ORI-SMALL', value: 'Generator', detail: 'Compact decoder-only Transformer for Ori generation.' },
      { label: 'ACCESS', value: 'Private', detail: 'Model runtime remains behind the server-side platform boundary.' },
    ],
    links: [
      { label: 'API direction', href: '/developer/api' },
      { label: 'Activity', href: '/developer/activity' },
      { label: 'Docs', href: '/developer/docs' },
    ],
    code: 'ori-core\nTensorFlow / Keras classifier\n\nori-small\n2048 vocab · context 256\nd_model 192 · 4 heads · 4 blocks',
    note: 'Model architecture and training status are documented separately from future public model availability.'
  },
  activity: {
    label: 'Activity',
    eyebrow: 'ACTIVITY',
    title: 'Platform activity',
    description: 'Activity is the observability surface for developer work: project changes, API operations, tool execution, and system events.',
    status: 'Foundation ready',
    statusTone: 'ready',
    summary: 'The event model is defined. A user-facing activity stream and durable event storage still need to be wired to developer identity and projects.',
    facts: [
      { label: 'EVENTS', value: 'Defined', detail: 'The platform has a structured event direction.' },
      { label: 'WEBHOOKS', value: 'Planned', detail: 'External event delivery comes after the core event contract.' },
      { label: 'CURRENT', value: 'Internal', detail: 'No public event feed is exposed yet.' },
    ],
    links: [
      { label: 'Projects', href: '/developer/projects' },
      { label: 'API', href: '/developer/api' },
      { label: 'Tools', href: '/developer/tools' },
    ],
    note: 'Activity becomes useful once project identity, API operations, and tool events share one durable event stream.'
  },
  authentication: {
    label: 'Authentication',
    eyebrow: 'AUTHENTICATION',
    title: 'Developer identity & access',
    description: 'Authentication is the security boundary between a developer, their projects, and Ori platform resources.',
    status: 'Designing',
    statusTone: 'building',
    summary: 'The intended model uses developer identity, project-scoped credentials, least privilege, rotation, and revocation.',
    facts: [
      { label: 'IDENTITY', value: 'Developer', detail: 'A developer account is the parent identity.' },
      { label: 'CREDENTIALS', value: 'Project', detail: 'Keys should belong to a project, not the entire platform.' },
      { label: 'SECRETS', value: 'Server-side', detail: 'Runtime and provider secrets never reach the browser.' },
    ],
    links: [
      { label: 'Projects', href: '/developer/projects' },
      { label: 'API', href: '/developer/api' },
      { label: 'Settings', href: '/developer/settings' },
    ],
    code: 'Developer identity\n        ↓\nProject-scoped credential\n        ↓\nOri Developer API\n        ↓\nPlatform services',
    note: 'The internal ORI_INTELLIGENCE_API_KEY is a Vercel-to-TensorFlow server secret. It is not a developer API key.'
  },
  settings: {
    label: 'Settings',
    eyebrow: 'SETTINGS',
    title: 'Developer settings',
    description: 'Configuration for the Developer Platform belongs here once developer identity and project persistence are active.',
    status: 'Foundation',
    statusTone: 'building',
    summary: 'The settings surface is intentionally honest today: there are no account or project controls exposed until the corresponding backend exists.',
    facts: [
      { label: 'PROFILE', value: 'Planned', detail: 'Developer identity settings come with authentication.' },
      { label: 'API KEYS', value: 'Planned', detail: 'Project credential management comes with the public API.' },
      { label: 'SECURITY', value: 'Private', detail: 'Internal runtime secrets stay outside this UI.' },
    ],
    links: [
      { label: 'Authentication', href: '/developer/authentication' },
      { label: 'Projects', href: '/developer/projects' },
      { label: 'Docs', href: '/developer/docs' },
    ],
    note: 'This page deliberately does not expose provider credentials, Render secrets, VM credentials, or internal API keys.'
  },
}

export default async function DeveloperSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const data = resources[section]
  if (!data) notFound()

  return (
    <DeveloperShell active={data.label}>
      <div className={styles.page}>
        <div className={styles.inner}>
          <a className={styles.breadcrumb} href="/developer/dashboard">Developer Console <span>→</span> {data.label}</a>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>{data.eyebrow}</p>
              <h1>{data.title}</h1>
              <p className={styles.lede}>{data.description}</p>
            </div>
            <div className={styles.state}><span className={styles.dot} />{data.status}</div>
          </header>

          <div className={styles.grid}>
            <section className={[styles.panel, styles.panelFull].join(' ')}>
              <div className={styles.panelHeader}><h2>Current state</h2><span>TRUTHFUL PLATFORM STATUS</span></div>
              <div className={styles.copy}><strong>{data.summary}</strong>{data.note && <div className={styles.note}>{data.note}</div>}</div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}><h2>Platform facts</h2><span>IMPLEMENTATION</span></div>
              <div className={styles.list}>
                {data.facts.map((fact) => (
                  <div className={styles.row} key={fact.label}>
                    <span className={styles.icon}>{fact.label.slice(0,1)}</span>
                    <div><strong>{fact.value}</strong><small>{fact.detail}</small></div>
                    <span className={[styles.badge, data.statusTone === 'ready' ? styles.badgeReady : ''].join(' ')}>{fact.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}><h2>Related surfaces</h2><span>NEXT</span></div>
              <div className={styles.links}>
                {data.links.map((link) => <a className={styles.link} href={link.href} key={link.href + link.label}>{link.label} →</a>)}
              </div>
            </section>

            {data.code && (
              <section className={styles.panel}>
                <div className={styles.panelHeader}><h2>Interface shape</h2><span>REFERENCE</span></div>
                <pre className={styles.code}>{data.code}</pre>
              </section>
            )}
          </div>

          <footer className={styles.footer}>
            <span>Ori Developer Platform</span>
            <span>Implementation status changes as capabilities become real.</span>
          </footer>
        </div>
      </div>
    </DeveloperShell>
  )
}
