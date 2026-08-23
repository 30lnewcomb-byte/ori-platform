import DeveloperShell from '../../../components/developer-shell'

const sections = {
  projects: {
    label: 'Projects',
    eyebrow: 'PROJECTS',
    title: 'Developer projects',
    text: 'Project management for applications built with Ori. The platform model is defined; the full project workspace is still in development.',
  },
  api: {
    label: 'API',
    eyebrow: 'API',
    title: 'Ori API',
    text: 'The public API surface will provide stable, versioned access to Ori capabilities. The contract is being designed before live credentials and endpoints are exposed.',
  },
  tools: {
    label: 'Tools',
    eyebrow: 'TOOLS',
    title: 'Tool connections',
    text: 'Explicit tool interfaces will let applications connect approved capabilities to Ori with clear permissions and execution boundaries.',
  },
  models: {
    label: 'Models',
    eyebrow: 'MODELS',
    title: 'Intelligence access',
    text: 'Model and intelligence access will sit behind the platform boundary. Live model connections are not exposed yet.',
  },
  events: {
    label: 'Events',
    eyebrow: 'EVENTS',
    title: 'Platform events',
    text: 'Events will provide a structured way to observe project, tool, API, and system activity, with webhooks planned later.',
  },
} as const

type SectionKey = keyof typeof sections

export default async function DeveloperSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const data = sections[section as SectionKey]

  if (!data) {
    return (
      <DeveloperShell active="Overview">
        <div style={{ maxWidth: 720 }}>
          <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 700, letterSpacing: '.14em' }}>DEVELOPER PLATFORM</p>
          <h1>Page not found.</h1>
          <p style={{ color: '#656b76', lineHeight: 1.6 }}>That Developer Platform section does not exist yet.</p>
        </div>
      </DeveloperShell>
    )
  }

  return (
    <DeveloperShell active={data.label}>
      <div style={{ maxWidth: 820 }}>
        <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 700, letterSpacing: '.14em' }}>{data.eyebrow}</p>
        <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(34px, 5vw, 56px)', letterSpacing: '-.04em' }}>{data.title}</h1>
        <p style={{ color: '#656b76', lineHeight: 1.7, maxWidth: 680 }}>{data.text}</p>
        <div style={{ marginTop: 30, padding: 22, background: '#fff', border: '1px solid #e5e8ed', borderRadius: 16 }}>
          <strong>In development</strong>
          <p style={{ margin: '8px 0 0', color: '#747b86', lineHeight: 1.6 }}>This page is part of the Developer Platform navigation now, but the underlying capability is not live yet.</p>
        </div>
      </div>
    </DeveloperShell>
  )
}
