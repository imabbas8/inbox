import { useCallback, useEffect, useMemo, useState } from 'react'
import { getComments, getUsers, searchUsers } from './api/dummyjson'
import { ChatList } from './components/chatlist/ChatList'
import { DetailsPanel } from './components/details/DetailsPanel'
import { TopNav } from './components/layout/TopNav'
import { ExtractingScreen } from './components/loading/ExtractingScreen'
import { InboxSidebar } from './components/sidebar/InboxSidebar'
import { ChatThread } from './components/thread/ChatThread'
import { useFetch } from './hooks/useFetch'
import type { Conversation, Message } from './types'
import { fakeTime } from './utils/format'

const BOOT_MIN_MS = 2200
const SEARCH_DEBOUNCE_MS = 350

export default function App() {
  // --- boot: keep the "Extracting Information..." screen up while users load
  const [bootDone, setBootDone] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setBootDone(true), BOOT_MIN_MS)
    return () => clearTimeout(timer)
  }, [])

  // --- search with debounce; empty query falls back to the full list
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    )
    return () => clearTimeout(timer)
  }, [search])

  const usersFetcher = useCallback(
    (signal: AbortSignal) =>
      debouncedSearch
        ? searchUsers(debouncedSearch, signal)
        : getUsers(12, signal),
    [debouncedSearch],
  )
  const users = useFetch(usersFetcher)

  // --- selected conversation + its messages
  const [selectedId, setSelectedId] = useState<number | null>(null)
  // on small screens the list and thread swap instead of sitting side by side
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)
  const selectChat = (id: number) => {
    setSelectedId(id)
    setMobileThreadOpen(true)
  }
  useEffect(() => {
    if (selectedId === null && users.data?.users.length) {
      setSelectedId(users.data.users[0].id)
    }
  }, [users.data, selectedId])

  const messagesFetcher = useCallback(
    (signal: AbortSignal) =>
      selectedId === null
        ? Promise.resolve(null)
        : getComments(selectedId, signal),
    [selectedId],
  )
  const messagesFetch = useFetch(messagesFetcher)

  // locally sent messages, kept per conversation
  const [sent, setSent] = useState<Record<number, Message[]>>({})

  const conversations: Conversation[] = useMemo(
    () =>
      (users.data?.users ?? []).map((user) => ({
        id: user.id,
        user,
        preview: `${user.company.title} at ${user.company.department}`,
        time: fakeTime(user.id),
        unread: user.id % 3 === 0 ? (user.id % 5) + 1 : 0,
      })),
    [users.data],
  )

  const messages: Message[] = useMemo(() => {
    const fromApi =
      messagesFetch.data?.comments.map((comment, i) => ({
        id: comment.id,
        text: comment.body,
        direction: (i % 2 === 0 ? 'in' : 'out') as 'in' | 'out',
        time: fakeTime(comment.id),
      })) ?? []
    const local = selectedId !== null ? (sent[selectedId] ?? []) : []
    return [...fromApi, ...local]
  }, [messagesFetch.data, sent, selectedId])

  const handleSend = (text: string) => {
    if (selectedId === null) return
    const message: Message = {
      id: Date.now(),
      text,
      direction: 'out',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    setSent((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), message],
    }))
  }

  const selectedUser =
    conversations.find((c) => c.id === selectedId)?.user ?? null

  const unreadCounts = Object.fromEntries(
    conversations.filter((c) => c.unread > 0).map((c) => [c.id, c.unread]),
  )

  const booting = !bootDone || (users.status === 'loading' && !users.data)
  if (booting && !debouncedSearch) {
    return (
      <div className="h-full">
        <ExtractingScreen />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <TopNav />
      <div className="flex min-h-0 flex-1">
        <div className="hidden lg:flex">
          <InboxSidebar
            users={users.data?.users ?? []}
            loading={users.status === 'loading'}
            selectedUserId={selectedId}
            onSelectUser={setSelectedId}
            unreadCounts={unreadCounts}
            totalCount={users.data?.total ?? 0}
          />
        </div>
        <div
          className={`${mobileThreadOpen ? 'hidden' : 'flex'} w-full md:flex md:w-auto`}
        >
          <ChatList
            conversations={conversations}
            loading={users.status === 'loading'}
            error={users.status === 'error' ? users.error : null}
            onRetry={users.retry}
            selectedId={selectedId}
            onSelect={selectChat}
            search={search}
            onSearchChange={setSearch}
          />
        </div>
        <div
          className={`${mobileThreadOpen ? 'flex' : 'hidden'} min-w-0 flex-1 md:flex`}
        >
          <ChatThread
            user={selectedUser}
            messages={messages}
            loading={messagesFetch.status === 'loading'}
            error={
              messagesFetch.status === 'error' ? messagesFetch.error : null
            }
            onRetry={messagesFetch.retry}
            onSend={handleSend}
            onBack={() => setMobileThreadOpen(false)}
          />
        </div>
        <div className="hidden xl:flex">
          <DetailsPanel
            user={selectedUser}
            loading={
              users.status === 'loading' || messagesFetch.status === 'loading'
            }
            error={null}
            onRetry={users.retry}
          />
        </div>
      </div>
    </div>
  )
}
