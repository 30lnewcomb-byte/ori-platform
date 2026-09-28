import AppShell from '../components/app-shell'

export default function HomePage() {
  return (
    <AppShell active="Home">
      <header className="topbar">
        <div>
          <p className="eyebrow">ORI PLATFORM</p>
          <h1>Work with Ori.</h1>
          <p className="appIntro">A focused workspace for talking with Ori and continuing conversations without extra product surfaces getting in the way.</p>
        </div>
      </header>

      <div className="homeWorkspace">
        <section className="quickStart" aria-labelledby="quick-start-heading">
          <div>
            <p className="eyebrow">START</p>
            <h2 id="quick-start-heading">What would you like to work on?</h2>
          </div>
          <div className="quickActions">
            <a className="primary" href="/chat?new=1">Start a new chat</a>
            <a className="secondary" href="/chat">Open Chat</a>
          </div>
        </section>

        <section className="sectionBlock" aria-labelledby="about-heading">
          <div className="sectionHeader"><h3 id="about-heading">About Ori</h3><a href="/developer/docs/ori">Read the full reference</a></div>
          <div className="dataList">
            <div className="dataRow"><div><strong>Conversation</strong><span>Chat with Ori through the platform&apos;s server-side intelligence boundary.</span></div><span>LIVE</span></div>
            <div className="dataRow"><div><strong>Chat history</strong><span>Your browser keeps recent conversations so New Chat and reopening previous chats work immediately.</span></div><span>LOCAL</span></div>
            <div className="dataRow"><div><strong>Native intelligence</strong><span>Ori uses its private TensorFlow runtime rather than exposing the model service directly to the browser.</span></div><span>PRIVATE</span></div>
          </div>
        </section>

        <section className="sectionBlock" aria-labelledby="status-heading">
          <div className="sectionHeader"><h3 id="status-heading">What is available</h3></div>
          <div className="statusRow"><span className="statusDot" aria-hidden="true" /><div><strong>Ori is focused on the conversation experience right now.</strong><span>Projects, task tracking, indexing, and other larger workspace surfaces are being kept out of the primary navigation until they have real functionality behind them.</span></div></div>
        </section>
      </div>
    </AppShell>
  )
}
