import DeveloperShell from '../../../../components/developer-shell'
import styles from '../ori.module.css'

export default function OriReferencePage() {
  return (
    <DeveloperShell active="Docs">
      <div className={styles.page}>
        <div className={styles.inner}>
          <a className={styles.back} href="/developer/docs">← Developer Docs</a>

          <header className={styles.hero}>
            <p className={styles.eyebrow}>ORI REFERENCE</p>
            <h1>Everything about Ori.</h1>
            <p className={styles.lede}>A single product and engineering reference for what Ori is, how it works, what is live, what is private infrastructure, and what is deliberately being built later.</p>
            <div className={styles.badges}>
              <span className={styles.badge}>USER-OWNED</span>
              <span className={styles.badge}>TRUTHFUL UI</span>
              <span className={styles.badge}>NATIVE TENSORFLOW</span>
              <span className={styles.badge}>SERVER-SIDE BOUNDARY</span>
            </div>
          </header>

          <div className={styles.grid}>
            <section className={[styles.section, styles.full].join(' ')}>
              <h2>What Ori is</h2>
              <p>Ori is a user-owned AI platform. The core product is a focused conversation experience backed by Ori-native learned intelligence, with controlled tools and a dedicated work environment as the system grows.</p>
              <p style={{ marginTop: 10 }}>The important distinction is between the product and the infrastructure behind it. Users work with Ori. Developers can inspect the platform. Providers and internal runtimes remain implementation details behind server-side boundaries.</p>
            </section>

            <section className={styles.section}>
              <h2>What is live</h2>
              <ul>
                <li>Home and Chat are the primary product surfaces.</li>
                <li>Chat supports multi-turn conversations, New Chat, saved browser-local history, reopening chats, automatic titles, and deletion.</li>
                <li>Vercel hosts the Ori web/control plane.</li>
                <li>A private TensorFlow runtime handles native learned intelligence.</li>
                <li>Server-side tool orchestration can reach the controlled VM boundary.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>What is not presented as live</h2>
              <ul>
                <li>Developer authentication and project-scoped public API keys.</li>
                <li>A stable public Developer API.</li>
                <li>Public SDK packages.</li>
                <li>Full end-to-end Ori World orchestration.</li>
                <li>Cross-device server-side chat history.</li>
                <li>Large workspace surfaces such as Search, Projects, Tasks, and Activity.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Chat & history</h2>
              <p>Chat is currently local-first at the UI persistence layer. Saved conversations use the browser&apos;s local storage and are capped at 100 conversations.</p>
              <pre className={styles.code}>/chat
/chat?new=1
/chat?chat=&lt;conversation-id&gt;

storage key:
ori.chat.history.v1</pre>
              <div className={styles.note}>Local history is an implementation choice for the current product stage, not the permanent data model.</div>
            </section>

            <section className={styles.section}>
              <h2>Native intelligence</h2>
              <p>Ori&apos;s intelligence path uses a private TensorFlow runtime. The browser never receives the runtime credential.</p>
              <pre className={styles.code}>Browser
  ↓
Ori Platform
  ↓
Authenticated TensorFlow runtime
  ├─ ori-core  → intent classification
  └─ ori-small → compact generation</pre>
            </section>

            <section className={styles.section}>
              <h2>Ori World</h2>
              <p>Ori World is the planned controlled work environment for code, files, tests, experiments, logs, and approved execution.</p>
              <p style={{ marginTop: 10 }}>Its current web route is historically <strong>/sandbox</strong>, while the product name is <strong>Ori World</strong>. The server-side VM wrapper and prewarm gate exist, but a complete chat-to-work orchestration path is not yet presented as finished.</p>
            </section>

            <section className={[styles.section, styles.full].join(' ')}>
              <h2>Architecture</h2>
              <pre className={styles.code}>Developer / User
        ↓
Ori Platform
  web + server orchestration
        ↓
┌───────────────────────────────┐
│ Ori intelligence runtime     │
│ TensorFlow / Keras            │
└───────────────────────────────┘
        ↓ only when execution is committed
┌───────────────────────────────┐
│ Ori VM runtime                │
│ controlled execution/workspace│
└───────────────────────────────┘</pre>
              <p style={{ marginTop: 10 }}>The services can be deployed independently. Communication happens through explicit server-side interfaces rather than shared provider infrastructure.</p>
            </section>

            <section className={styles.section}>
              <h2>Security boundary</h2>
              <ul>
                <li>Provider account credentials stay server-side.</li>
                <li>Internal runtime API keys stay server-side.</li>
                <li>VM credentials stay server-side.</li>
                <li>Model output does not automatically equal execution permission.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Product rules</h2>
              <ul>
                <li>A button must have a real action.</li>
                <li>A navigation item must lead to a useful surface.</li>
                <li>A status label must reflect confirmed state.</li>
                <li>Planned capabilities belong in docs, not in fake finished UI.</li>
                <li>Internal infrastructure should not leak into the everyday assistant experience.</li>
              </ul>
            </section>
          </div>

          <footer className={styles.footer}>
            <span>Ori Developer Platform</span>
            <span><a href="/developer/dashboard">Dashboard</a> · <a href="/developer/status">Status</a> · <a href="/chat">Chat</a></span>
          </footer>
        </div>
      </div>
    </DeveloperShell>
  )
}
