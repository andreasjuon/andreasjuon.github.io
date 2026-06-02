'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FiX, FiSend } from 'react-icons/fi'

/**
 * Floating RAG chatbot widget. Talks to the FastAPI backend (hosted on Railway)
 * at NEXT_PUBLIC_CHATBOT_API_URL. Renders nothing if that env var is unset, so
 * the static build is safe before the backend exists.
 *
 * The backend owns all cost/abuse controls; this component only surfaces the
 * friendly messages it returns (rate limit, daily limit, too long).
 */

const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL

type Role = 'user' | 'assistant'

interface Source {
  title?: string | null
  web_key?: string | null
  doc_type?: string | null
}

interface Message {
  role: Role
  content: string
  sources?: Source[]
}

// Only surface publication sources (drop research/teaching statements etc.),
// keep ones we can both label and link, and dedupe by slug.
const PUBLICATION_DOC_TYPES = new Set(['publication', 'publication_description'])

// The backend returns the canned out-of-scope refusal but still attaches the
// docs it retrieved; don't show sources for a refusal.
function isRefusal(answer: string): boolean {
  const normalized = answer.toLowerCase().replace(/[’‘'`]/g, "'").trim()
  return normalized.startsWith('i can only answer questions related to andreas juon')
}

function publicationSources(sources: Source[] = []): Source[] {
  const seen = new Set<string>()
  const out: Source[] = []
  for (const s of sources) {
    if (!s.web_key || !s.title) continue
    if (!PUBLICATION_DOC_TYPES.has(s.doc_type ?? '')) continue
    if (seen.has(s.web_key)) continue
    seen.add(s.web_key)
    out.push(s)
  }
  return out
}

const GREETING: Message = {
  role: 'assistant',
  content:
    "Hi! I can answer questions about Andreas Juon's research, publications, datasets, and methods. What would you like to know?",
}

const SEEN_KEY = 'chatWidgetSeen'

function ScholarBotIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-9 w-9"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 28c-4.5.4-8 2.7-9.5 6.2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M30 28c4.5.4 8 2.7 9.5 6.2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x="15"
        y="8"
        width="18"
        height="16"
        rx="5"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M24 5v3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="4.75" r="1.75" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16h3M33 16h3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20.5" cy="15.5" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="27.5" cy="15.5" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M23 19.5h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M16 36c3.8 0 6.2.9 8 2.5V31c-1.8-1.5-4.4-2.5-8-2.5h-3v7.5h3Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 36c-3.8 0-6.2.9-8 2.5V31c1.8-1.5 4.4-2.5 8-2.5h3v7.5h-3Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M24 38.5v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 27.5h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M20 33.5 24 29l4 4.5M24 29v-2.5"
        stroke="#3182bd"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="29" r="1.75" fill="#3182bd" />
    </svg>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAttention, setShowAttention] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // One-time attention cue: show ping + tooltip for 5s on first visit
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(SEEN_KEY)) return
    setShowAttention(true)
    const timer = setTimeout(() => setShowAttention(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!API_URL) return null

  function dismiss() {
    setShowAttention(false)
    if (typeof window !== 'undefined') localStorage.setItem(SEEN_KEY, '1')
  }

  async function send() {
    const question = input.trim()
    if (!question || loading) return

    const history = messages.filter((m) => m !== GREETING)
    const next = [...messages, { role: 'user' as const, content: question }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
      })
      const data = await res.json().catch(() => ({}))
      const reply =
        data.answer ||
        data.message ||
        'Sorry, something went wrong. Please try again later.'
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: reply,
          sources: isRefusal(reply) ? [] : publicationSources(data.sources),
        },
      ])
    } catch {
      setMessages([
        ...next,
        { role: 'assistant', content: 'The assistant is unavailable right now. Please try again later.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Launcher + attention cue */}
      <div className="fixed bottom-5 right-5 z-50">
        {/* Tooltip */}
        {showAttention && !open && (
          <div className="absolute bottom-16 right-0 whitespace-nowrap rounded-lg bg-primary-dark px-3 py-2 text-xs text-white shadow-card-hover animate-fade-in-up pointer-events-none">
            Ask about my research
            <span className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 bg-primary-dark" />
          </div>
        )}

        {/* Ping ring (renders only during attention window) */}
        {showAttention && !open && (
          <span className="absolute inset-0 rounded-full bg-primary-dark opacity-40 animate-ping" />
        )}

        <button
          onClick={() => { setOpen((o) => !o); dismiss() }}
          aria-label={open ? 'Close chat' : 'Ask about my research'}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-dark text-white shadow-card-hover transition hover:scale-105"
        >
          {open ? <FiX size={22} /> : <ScholarBotIcon />}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] max-h-[calc(100vh-8rem)] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg bg-white shadow-card-hover">
          <header className="bg-primary-dark px-4 py-3 text-white">
            <p className="text-sm font-semibold">Ask about my research</p>
            <p className="text-xs text-white/70">Answers are AI-generated from Andreas Juon&apos;s work.</p>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span
                  className={
                    'inline-block max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ' +
                    (m.role === 'user'
                      ? 'bg-primary-dark text-white'
                      : 'bg-primary-light text-gray-800')
                  }
                >
                  {m.content}
                </span>
                {m.role === 'assistant' && m.sources && m.sources.length > 0 && (
                  <details className="mt-1 max-w-[85%] text-left">
                    <summary className="cursor-pointer list-none text-xs text-gray-500 hover:text-gray-700">
                      Sources ({m.sources.length})
                    </summary>
                    <ul className="mt-1 space-y-1 pl-1">
                      {m.sources.map((s) => (
                        <li key={s.web_key}>
                          <Link
                            href={`/publications/${s.web_key}`}
                            className="text-xs text-primary-dark underline underline-offset-2 hover:no-underline"
                          >
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <span className="inline-block rounded-lg bg-primary-light px-3 py-2 text-sm text-gray-500">
                  Thinking…
                </span>
              </div>
            )}
          </div>

          <div className="flex items-end gap-2 border-t border-gray-100 p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              maxLength={500}
              placeholder="Type your question…"
              className="max-h-24 flex-1 resize-none rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary-dark focus:outline-none"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-dark text-white transition disabled:opacity-40"
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
