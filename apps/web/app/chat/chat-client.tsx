'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'

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
  const conversationRef = useRef<HTMLElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const conversation = conversationRef.current
    if (!conversation) return
    conversation.scrollTo({ top: conversation.scrollHeight, behavior: 'smooth' })
  }, [messages, busy, error])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`
  }, [value])

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
        body: JSON.stringify({
          messages: nextMessages,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
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
      textareaRef.current?.focus()
    }
  }

  return (
    <>
      <section ref={conversationRef} className="conversation" aria-label="Conversation" aria-live="polite">
        {messages.length === 0 ? (
          <div className="emptyState chatEmptyState">
            <strong>Start a conversation with Ori.</strong>
            <span>Ask anything about your projects, tasks, or what you want to build.</span>
          </div>
        ) : (
          messages.map((message, index) => (
            <div className={`messageRow ${message.role}`} key={`${message.role}-${index}`}>
              {message.role === 'user' ? (
                <div className="userMessage">{message.content}</div>
              ) : (
                <div className="oriMessage"><span className="messageLabel">ORI</span>{message.content}</div>
              )}
            </div>
          ))
        )}

        {busy && (
          <div className="messageRow assistant" aria-live="polite">
            <div className="oriMessage"><span className="messageLabel">ORI</span><span className="thinkingDots" aria-label="Ori is thinking"><i /><i /><i /></span></div>
          </div>
        )}

        {error && <div className="chatError" role="alert">{error}</div>}
      </section>

      <form className="composer" onSubmit={sendMessage} aria-label="Message Ori">
        <textarea
          ref={textareaRef}
          id="prompt"
          rows={1}
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
