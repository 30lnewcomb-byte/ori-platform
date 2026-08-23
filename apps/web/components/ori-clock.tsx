'use client'

import { useEffect, useState } from 'react'

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
    timeZone: 'America/New_York',
  }).format(date)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York',
  }).format(date)
}

export default function OriClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const update = () => setNow(new Date())
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (!now) return <div className="oriClock" aria-label="Current time">--:--:--</div>

  return (
    <time className="oriClock" dateTime={now.toISOString()} aria-label="Current time in Maine">
      <strong>{formatTime(now)}</strong>
      <span>{formatDate(now)} · Maine</span>
    </time>
  )
}
