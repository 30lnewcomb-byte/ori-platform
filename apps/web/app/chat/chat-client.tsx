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

const EMPTY_PROMPTS = [
  'What’s on your mind today?',
  'What would you like to work on?',
  'What can we figure out together?',
  'What are you thinking about?',
  'Where should we start?',
  'What would you like to explore?',
  'What are you working on today?',
  'Got something on your mind?',
  'What should we tackle?',
  'What can Ori help with?',
  'Ready when you are.',
  'What are we working on?',
  'What would you like to figure out?',
  'Need a hand with something?',
  'What should we dive into?',
  'What’s up?',
  'What would you like to talk about?',
  'Have something in mind?',
  'What should we look at?',
  'What do you want to build today?',
]

function pickEmptyPrompt() {
  return EMPTY_PROMPTS[Math.floor(Math.random() * EMPTY_PROMPTS.length)]
}

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'chat-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

async function requestOriTitle(messages: Message[]) {
  const response = await fetch('/api/chat/title', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: messages.slice(0, 6) }),
    cache: 'no-store',
  })

  const data = await response.json()
  if (!response.ok || typeof data?.title !== 'string' || !data.title.trim()) {
    throw new Error(data?.error ?? 'Ori could not name this conversation.')
  }

  return data.title.trim()
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

async function readServerHistory(): Promise<Conversation[] | null> {
  try {
    const response = await fetch('/api/chats', { cache: 'no-store' })
    if (!response.ok) return null
    const data = await response.json()
    if (!Array.isArray(data?.conversations)) return []
    return data.conversations.slice(0, MAX_CONVERSATIONS)
  } catch {
    return null
  }
}

async function saveServerConversation(conversation: Conversation) {
  try {
    await fetch('/api/chats/' + encodeURIComponent(conversation.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: conversation.title,
        messages: conversation.messages,
      }),
    })
  } catch {
    // Local cache remains available when the database is temporarily unavailable.
  }
}

async function deleteServerConversation(id: string) {
  try {
    await fetch('/api/chats/' + encodeURIComponent(id), { method: 'DELETE' })
  } catch {
    // Local cache is still updated immediately.
  }
}

function writeHistory(conversations: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.slice(0, MAX_CONVERSATIONS)))
    window.dispatchEvent(new Event('ori:history-changed'))
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
  const [emptyPrompt, setEmptyPrompt] = useState('What’s on your mind today?')
  const conversationRef = useRef<HTMLElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const titleRequestRef = useRef(0)

  useEffect(() => {
    // Quietly wake Ori's TensorFlow runtime when the New Chat page opens.
    // The request is intentionally fire-and-forget so the user never has to
    // manage Render or wait on infrastructure UI.
    void fetch('/api/intelligence/warmup', {
      method: 'GET',
      cache: 'no-store',
      keepalive: true,
    }).catch(() => {
      // Sending a warmup is best-effort; the chat API performs its own
      // runtime wake-up before generating a response.
    })
  }, [])

  useEffect(() => {
    let active = true

    async function loadConversationHistory() {
      const localChats = readHistory()
      let loaded = await readServerHistory()

      if (loaded && loaded.length === 0 && localChats.length > 0) {
        await Promise.all(localChats.map((conversation) => saveServerConversation(conversation)))
        loaded = localChats
      }

      const effectiveChats = loaded ?? localChats
      if (!active) return

      setConversations(effectiveChats)

      const params = new URLSearchParams(window.location.search)
      const requestedId = params.get('chat')
      const forceNew = params.get('new') === '1'
      const openHistory = params.get('history') === '1'
      const requestedChat = effectiveChats.find((chat) => chat.id === requestedId)
      setHistoryOpen(openHistory)

      if (requestedChat && !forceNew) {
        setCurrentChatId(requestedChat.id)
        setMessages(requestedChat.messages)
      } else {
        const freshId = makeId()
        setCurrentChatId(freshId)
        setMessages([])
        setError('')
        setEmptyPrompt(pickEmptyPrompt())
        window.history.replaceState(null, '', '/chat?chat=' + encodeURIComponent(freshId))
      }

      setEmptyPrompt(pickEmptyPrompt())
      setHistoryReady(true)
    }

    void loadConversationHistory()
    return () => {
      active = false
    }
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

    const existing = conversations.find((chat) => chat.id === currentChatId)
    const nextConversation: Conversation = {
      id: currentChatId,
      title: existing?.title || 'New chat',
      messages,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    }

    setConversations((current) => {
      const existingIndex = current.findIndex((chat) => chat.id === currentChatId)
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

    void saveServerConversation(nextConversation)
  }, [messages, currentChatId, historyReady, conversations])


  function openNewChat() {
    if (busy) return
    const freshId = makeId()
    setCurrentChatId(freshId)
    setMessages([])
    setEmptyPrompt(pickEmptyPrompt())
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
    void deleteServerConversation(id)

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
          setEmptyPrompt(pickEmptyPrompt())
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

      const assistantMessage = { role: 'assistant' as const, content: data.content }
      const completedMessages = [...nextMessages, assistantMessage]
      setMessages(completedMessages)

      const userTurnCount = completedMessages.filter((message) => message.role === 'user').length
      if (userTurnCount <= 3) {
        const requestId = ++titleRequestRef.current
        void requestOriTitle(completedMessages)
          .then((title) => {
            if (requestId !== titleRequestRef.current) return
            setConversations((current) => {
              const index = current.findIndex((chat) => chat.id === currentChatId)
              if (index < 0) return current

              const updatedConversation = {
                ...current[index],
                title,
                updatedAt: Date.now(),
              }
              const next = [...current]
              next[index] = updatedConversation
              writeHistory(next)
              void saveServerConversation(updatedConversation)
              return next
            })
          })
          .catch(() => {
            // Conversation remains usable with the temporary "New chat" title.
          })
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ori could not respond.')
    } finally {
      setBusy(false)
      textareaRef.current?.focus()
    }
  }

  const currentTitle = conversations.find((chat) => chat.id === currentChatId)?.title ?? (messages.length > 0 ? 'New chat' : '')

  return (
    <div className="chatWorkspace">
      <div className={messages.length === 0 ? 'chatMain empty' : 'chatMain'}>
        {messages.length === 0 ? (
          <div className="emptyChatStage">
            <div className="emptyState chatEmptyState">
              <strong>{emptyPrompt}</strong>
            </div>

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
        ) : (
          <>
            <section ref={conversationRef} className="conversation" aria-label="Conversation" aria-live="polite">
              <div className="conversationHeading">{currentTitle}</div>
              {messages.map((message, index) => (
                <div className={'messageRow ' + message.role} key={message.role + '-' + index}>
                  {message.role === 'user' ? (
                    <div className="userMessage">{message.content}</div>
                  ) : (
                    <div className="oriMessage"><span className="messageLabel">ORI</span>{message.content}</div>
                  )}
                </div>
              ))}

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
          </>
        )}
      </div>

      {historyOpen && (
        <button
          type="button"
          className="chatHistoryScrim"
          aria-label="Close chat history"
          onClick={() => setHistoryOpen(false)}
        />
      )}

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
