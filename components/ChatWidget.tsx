'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi'

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

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  if (!API_URL) return null

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
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Ask about my research'}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-dark text-white shadow-card-hover transition hover:scale-105"
      >
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
      </button>

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
