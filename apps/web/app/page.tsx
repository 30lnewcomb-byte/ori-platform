import AppShell from '../components/app-shell'

export default function HomePage() {
  return (
    <AppShell active="Home">
      <header className="topbar">
        <div>
          <p className="eyebrow">ORI</p>
          <h1>Chat with Ori.</h1>
          <p className="appIntro">Start a new conversation with Ori.</p>
        </div>
      </header>

      <div className="homeWorkspace">
        <section className="quickStart" aria-labelledby="quick-start-heading">
          <div>
            <p className="eyebrow">CHAT</p>
            <h2 id="quick-start-heading">Start here.</h2>
          </div>
          <div className="quickActions">
            <a className="primary" href="/chat?new=1">New chat</a>
          </div>
        </section>

        <section className="sectionBlock" aria-labelledby="available-heading">
          <div className="sectionHeader">
            <h3 id="available-heading">Available</h3>
            <a href="/developer/docs/ori">About Ori</a>
          </div>
          <div className="dataList">
            <div className="dataRow">
              <div><strong>Conversation</strong><span>Multi-turn chat with Ori.</span></div>
            </div>
            <div className="dataRow">
              <div><strong>History</strong><span>Saved in this browser. Use <code>/history</code> to open it.</span></div>
            </div>
            <div className="dataRow">
              <div><strong>Commands</strong><span><code>/newchat</code> starts fresh. <code>/history</code> opens or closes history.</span></div>
            </div>
          </div>
        </section>

        <p className="homeFootnote">Existing conversations are available from chat history when you need them.</p>
      </div>
    </AppShell>
  )
}
