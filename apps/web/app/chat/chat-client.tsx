'use client'

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'ori.chat.history.v1'
const MAX_CONVERSATIONS = 100

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'chat-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

function titleFromMessage(content: string) {
  const clean = content.replace(/\s+/g, ' ').trim()
  if (!clean) return 'New chat'
  return clean.length > 48 ? clean.slice(0, 48).trim() + '…' : clean
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (sameDay) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function readHistory(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        Array.isArray(item.messages),
      )
      .slice(0, MAX_CONVERSATIONS)
  } catch {
    return []
  }
}

function writeHistory(conversations: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.slice(0, MAX_CONVERSATIONS)))
  } catch {
    // Chat still works when browser storage is unavailable.
  }
}

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentChatId, setCurrentChatId] = useState('')
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [historyReady, setHistoryReady] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const conversationRef = useRef<HTMLElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const loaded = readHistory()
    setConversations(loaded)

    const params = new URLSearchParams(window.location.search)
    const requestedId = params.get('chat')
    const forceNew = params.get('new') === '1'
    const requestedChat = loaded.find((chat) => chat.id === requestedId)

    if (requestedChat && !forceNew) {
      setCurrentChatId(requestedChat.id)
      setMessages(requestedChat.messages)
    } else {
      const freshId = makeId()
      setCurrentChatId(freshId)
      setMessages([])
      setError('')
      window.history.replaceState(null, '', '/chat?chat=' + encodeURIComponent(freshId))
    }

    setHistoryReady(true)
  }, [])

  useEffect(() => {
    function handlePopState() {
      const params = new URLSearchParams(window.location.search)
      const requestedId = params.get('chat')

      if (!requestedId) {
        const freshId = makeId()
        setCurrentChatId(freshId)
        setMessages([])
        setError('')
        return
      }

      const chat = conversations.find((item) => item.id === requestedId)
      setCurrentChatId(requestedId)
      setMessages(chat?.messages ?? [])
      setError('')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [conversations])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setHistoryOpen(false)
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    const conversation = conversationRef.current
    if (!conversation) return
    conversation.scrollTo({ top: conversation.scrollHeight, behavior: 'smooth' })
  }, [messages, busy, error])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px'
  }, [value])

  useEffect(() => {
    if (!historyReady || !currentChatId || messages.length === 0) return

    setConversations((current) => {
      const existingIndex = current.findIndex((chat) => chat.id === currentChatId)
      const existing = existingIndex >= 0 ? current[existingIndex] : undefined
      const firstUserMessage = messages.find((message) => message.role === 'user')
      const nextConversation: Conversation = {
        id: currentChatId,
        title: firstUserMessage ? titleFromMessage(firstUserMessage.content) : existing?.title ?? 'New chat',
        messages,
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      }

      const next = [...current]
      if (existingIndex >= 0) {
        next[existingIndex] = nextConversation
      } else {
        next.unshift(nextConversation)
      }

      next.sort((a, b) => b.updatedAt - a.updatedAt)
      writeHistory(next)
      return next.slice(0, MAX_CONVERSATIONS)
    })
  }, [messages, currentChatId, historyReady])

  function openNewChat() {
    if (busy) return
    const freshId = makeId()
    setCurrentChatId(freshId)
    setMessages([])
    setValue('')
    setError('')
    setHistoryOpen(false)
    window.history.pushState(null, '', '/chat?chat=' + encodeURIComponent(freshId))
    textareaRef.current?.focus()
  }

  function openChat(id: string) {
    if (busy || id === currentChatId) return
    const chat = conversations.find((item) => item.id === id)
    if (!chat) return

    setCurrentChatId(chat.id)
    setMessages(chat.messages)
    setValue('')
    setError('')
    setHistoryOpen(false)
    window.history.pushState(null, '', '/chat?chat=' + encodeURIComponent(chat.id))
    textareaRef.current?.focus()
  }

  function deleteChat(id: string, event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    if (busy) return

    setConversations((current) => {
      const next = current.filter((chat) => chat.id !== id)
      writeHistory(next)

      if (id === currentChatId) {
        const replacement = next[0]
        if (replacement) {
          setCurrentChatId(replacement.id)
          setMessages(replacement.messages)
          window.history.pushState(null, '', '/chat?chat=' + encodeURIComponent(replacement.id))
        } else {
          const freshId = makeId()
          setCurrentChatId(freshId)
          setMessages([])
          window.history.pushState(null, '', '/chat?chat=' + encodeURIComponent(freshId))
        }
        setValue('')
        setError('')
      }

      return next
    })
  }

  function runHistoryCommand() {
    setValue('')
    setHistoryOpen((open) => !open)
    textareaRef.current?.focus()
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = value.trim()
    if (!content || busy) return

    const command = content.toLowerCase()

    if (command === '/newchat') {
      openNewChat()
      return
    }

    if (command === '/history') {
      runHistoryCommand()
      return
    }

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

  const firstUserMessage = messages.find((message) => message.role === 'user')
  const currentTitle = firstUserMessage
    ? titleFromMessage(firstUserMessage.content)
    : conversations.find((chat) => chat.id === currentChatId)?.title ?? 'New chat'

  return (
    <div className="chatWorkspace">
      <div className={messages.length === 0 ? 'chatMain empty' : 'chatMain'}>
        <div className="chatSessionBar">
          <span className="chatSessionTitle">{currentTitle}</span>
        </div>

        <section ref={conversationRef} className="conversation" aria-label="Conversation" aria-live="polite">
          {messages.length === 0 ? (
            <div className="emptyState chatEmptyState">
              <strong>What’s on your mind today?</strong>
              <span>Ask Ori a question or tell it what you are working on.</span>
            </div>
          ) : (
            messages.map((message, index) => (
              <div className={'messageRow ' + message.role} key={message.role + '-' + index}>
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
          {value.startsWith('/') && !busy && (
            <div className="commandMenu" role="listbox" aria-label="Slash commands">
              <button type="button" className="commandItem" onClick={openNewChat}>
                <code>/newchat</code>
                <span>Start a new chat</span>
              </button>
              <button type="button" className="commandItem" onClick={runHistoryCommand}>
                <code>/history</code>
                <span>Open or close chat history</span>
              </button>
            </div>
          )}
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
      </div>

      <aside
        className={historyOpen ? 'chatHistory open' : 'chatHistory'}
        aria-label="Chat history"
        aria-hidden={!historyOpen}
      >
        <div className="chatHistoryHeader">
          <div>
            <p className="eyebrow">HISTORY</p>
            <strong>Chats</strong>
          </div>
          <button type="button" className="chatHistoryClose" onClick={() => setHistoryOpen(false)} aria-label="Close chat history">
            ×
          </button>
        </div>

        <div className="chatHistoryList">
          {conversations.length === 0 ? (
            <div className="chatHistoryEmpty">Your chats will appear here after you start talking with Ori.</div>
          ) : (
            conversations.map((chat) => (
              <div className={'chatHistoryRow' + (chat.id === currentChatId ? ' active' : '')} key={chat.id}>
                <button
                  type="button"
                  className="chatHistoryItem"
                  onClick={() => openChat(chat.id)}
                  disabled={busy}
                >
                  <span className="chatHistoryTitle">{chat.title}</span>
                  <span className="chatHistoryMeta">{formatDate(chat.updatedAt)}</span>
                </button>
                <button
                  type="button"
                  className="chatHistoryDelete"
                  aria-label={'Delete ' + chat.title}
                  onClick={(event) => deleteChat(chat.id, event)}
                  disabled={busy}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}
