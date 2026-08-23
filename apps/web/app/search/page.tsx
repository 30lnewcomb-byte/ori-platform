import AppShell from '../../components/app-shell'

export default function SearchPage() {
  return (
    <AppShell active="Search">
      <header className="topbar"><div><p className="eyebrow">SEARCH</p><h1>Find your work.</h1><p className="appIntro">Search across chats, projects, files, and activity from one place.</p></div></header>
      <div className="homeGrid">
        <section className="sectionBlock">
          <label htmlFor="search"><strong>Search Ori</strong></label>
          <input id="search" type="search" placeholder="Search chats, projects, files, and activity..." style={{ width: '100%', marginTop: 12, padding: '14px 15px', border: '1px solid var(--border-subtle)', borderRadius: 12, background: 'var(--surface-base)', color: 'var(--text-primary)' }} />
        </section>
        <section className="sectionBlock"><div className="emptyState"><strong>Nothing to search yet</strong><span>As conversations and projects become persistent, this surface will search across them from one place.</span></div></section>
      </div>
    </AppShell>
  )
}
