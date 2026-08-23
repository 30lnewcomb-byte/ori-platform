'use client'

import { useEffect, useState } from 'react'
import AppShell from '../components/app-shell'

function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning.'
  if (hour < 18) return 'Good afternoon.'
  return 'Good evening.'
}

export default function HomePage() {
  const [greeting, setGreeting] = useState('Hello.')

  useEffect(() => {
    const updateGreeting = () => setGreeting(getGreeting())
    updateGreeting()
    const interval = window.setInterval(updateGreeting, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <AppShell active="Home">
      <header className="topbar">
        <div>
          <p className="eyebrow">ORI PLATFORM</p>
          <h1>{greeting}</h1>
          <p className="appIntro">Start something new or pick up where you left off.</p>
        </div>
        <button className="avatar" aria-label="Open profile">L</button>
      </header>

      <div className="homeWorkspace">
        <section className="quickStart" aria-labelledby="quick-start-heading">
          <div>
            <p className="eyebrow">QUICK START</p>
            <h2 id="quick-start-heading">What do you want to work on?</h2>
          </div>
          <div className="quickActions">
            <a className="primary" href="/chat">Start a chat</a>
            <a className="secondary" href="/projects">Open a project</a>
            <a className="secondary" href="/tasks">View tasks</a>
          </div>
        </section>

        <div className="homeColumns">
          <section className="sectionBlock" aria-labelledby="recent-heading">
            <div className="sectionHeader"><h3 id="recent-heading">Recent work</h3><a href="/projects">View all</a></div>
            <div className="emptyState"><strong>Nothing here yet</strong><span>Your recent conversations and projects will appear here once you start working.</span></div>
          </section>

          <section className="sectionBlock" aria-labelledby="tasks-heading">
            <div className="sectionHeader"><h3 id="tasks-heading">Tasks</h3><a href="/tasks">View all</a></div>
            <div className="emptyState"><strong>No active tasks</strong><span>When Ori has work in progress, active tasks will appear here.</span></div>
          </section>
        </div>

        <section className="sectionBlock" aria-labelledby="activity-heading">
          <div className="sectionHeader"><h3 id="activity-heading">Activity</h3><a href="/notifications">View activity</a></div>
          <div className="statusRow"><span className="statusDot" aria-hidden="true" /><div><strong>Platform online</strong><span>The interface is connected and ready. Ori&apos;s intelligence is not connected yet.</span></div></div>
        </section>
      </div>
    </AppShell>
  )
}
