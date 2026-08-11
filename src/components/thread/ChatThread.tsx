import { useEffect, useRef, useState } from 'react'
import type { ApiUser, Message } from '../../types'
import { fullName } from '../../utils/format'
import {
  BoltIcon,
  CalendarIcon,
  CheckDoubleIcon,
  ChevronDownIcon,
  DotsIcon,
  GifIcon,
  ImageIcon,
  MicIcon,
  MoonIcon,
  SendIcon,
  SmileIcon,
  StickerIcon,
  VideoIcon,
} from '../icons'
import { ErrorState } from '../ui/ErrorState'
import { Skeleton } from '../ui/Skeleton'

interface ChatThreadProps {
  user: ApiUser | null
  messages: Message[]
  loading: boolean
  error: string | null
  onRetry: () => void
  onSend: (text: string) => void
  onBack?: () => void
}

function ThreadSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <Skeleton className="mx-auto h-6 w-24 rounded-full" />
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton
          key={i}
          className={`h-14 w-56 rounded-xl ${i % 2 ? 'self-end' : 'self-start'}`}
        />
      ))}
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isOut = message.direction === 'out'
  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
      <div className="flex max-w-[70%] items-end gap-1.5">
        {isOut && (
          <span className="mb-0.5 flex items-center gap-1 text-[10px] text-gray-400">
            <CheckDoubleIcon size={12} className="text-sky-500" />
            {message.time}
          </span>
        )}
        <div
          className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
            isOut
              ? 'rounded-br-sm bg-bubble-out text-gray-800'
              : 'rounded-bl-sm bg-bubble-in text-gray-800'
          }`}
        >
          {message.text}
        </div>
        {!isOut && (
          <span className="mb-0.5 text-[10px] text-gray-400">
            {message.time}
          </span>
        )}
      </div>
    </div>
  )
}

const COMPOSER_ICONS = [ImageIcon, VideoIcon, GifIcon, SmileIcon, StickerIcon]

/** Center column: message thread with date chip, bubbles and composer. */
export function ChatThread({
  user,
  messages,
  loading,
  error,
  onRetry,
  onSend,
  onBack,
}: ChatThreadProps) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-white">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-100 px-4">
        <div className="flex items-center gap-1">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to chats"
              className="mr-1 rounded p-1 text-gray-500 hover:bg-gray-100 md:hidden"
            >
              <ChevronDownIcon size={16} className="rotate-90" />
            </button>
          )}
          <h2 className="text-[14px] font-semibold text-gray-900">
            {user ? fullName(user.firstName, user.lastName) : 'Select a chat'}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <button type="button" aria-label="More" className="rounded p-1.5 hover:bg-gray-100">
            <DotsIcon size={15} />
          </button>
          <button type="button" aria-label="Snooze" className="rounded p-1.5 hover:bg-gray-100">
            <MoonIcon size={15} />
          </button>
          <button
            type="button"
            aria-label="Close chat"
            className="rounded bg-gray-900 p-1.5 text-white"
          >
            <CalendarIcon size={15} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {loading ? (
          <ThreadSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : (
          <div className="flex flex-col gap-3 p-5">
            <span className="mx-auto rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500">
              28 August 2025
            </span>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 p-4 pt-2">
        <div className="rounded-xl border border-gray-200">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type something..."
            className="w-full bg-transparent px-3.5 pt-3 pb-2 text-[13px] outline-none placeholder:text-gray-400"
          />
          <div className="flex items-center justify-between px-3 pb-2.5">
            <div className="flex items-center gap-2.5 text-gray-400">
              {COMPOSER_ICONS.map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="hover:text-gray-600"
                  aria-label="Attachment option"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2.5 text-gray-400">
              <button type="button" className="hover:text-gray-600" aria-label="Quick replies">
                <BoltIcon size={16} />
              </button>
              <button type="button" className="hover:text-gray-600" aria-label="Voice note">
                <MicIcon size={16} />
              </button>
              <button
                type="button"
                onClick={send}
                aria-label="Send"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white disabled:opacity-40"
                disabled={!draft.trim()}
              >
                <SendIcon size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
