'use client'

import { useState, type FormEvent } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const starterMessages: Message[] = []

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>(starterMessages)
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = value.trim()
    if (!content || busy) return

    const nextMessages = [...messages, { role: 'user' as const, content }]
    setMessages(nextMessages)
    setValue('')
    setError('')
    setBusy(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error ?? 'Ori could not respond.')
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.content }])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ori could not respond.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="conversation" aria-label="Conversation">
        {messages.length === 0 ? (
          <div className="emptyState" style={{ margin: 'auto 0', minHeight: 0, alignItems: 'center', textAlign: 'center' }}>
            <strong>Start a conversation with Ori.</strong>
            <span>Your conversation will appear here.</span>
          </div>
        ) : (
          messages.map((message, index) => (
            <div className={`messageRow ${message.role}`} key={`${message.role}-${index}`}>
              {message.role === 'user' ? (
                <div className="userMessage">{message.content}</div>
              ) : (
                <div className="oriMessage">{message.content}</div>
              )}
            </div>
          ))
        )}

        {busy && (
          <div className="messageRow assistant" aria-live="polite">
            <div className="oriMessage">Ori is thinking…</div>
          </div>
        )}

        {error && <div className="chatError" role="alert">{error}</div>}
      </section>

      <form className="composer" onSubmit={sendMessage} aria-label="Message Ori">
        <textarea
          id="prompt"
          rows={2}
          placeholder="Message Ori..."
          aria-label="Message Ori"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={busy}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
        />
        <button type="submit" className="sendButton" aria-label="Send message" disabled={busy || !value.trim()}>
          ↑
        </button>
      </form>
    </>
  )
}
