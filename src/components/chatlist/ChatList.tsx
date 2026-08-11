import type { Conversation } from '../../types'
import { fullName } from '../../utils/format'
import {
  ChevronDownIcon,
  ComposeIcon,
  FilterIcon,
  PanelLeftIcon,
  SearchIcon,
} from '../icons'
import { Avatar } from '../ui/Avatar'
import { ErrorState } from '../ui/ErrorState'
import { Skeleton, SkeletonCircle } from '../ui/Skeleton'

interface ChatListProps {
  conversations: Conversation[]
  loading: boolean
  error: string | null
  onRetry: () => void
  selectedId: number | null
  onSelect: (id: number) => void
  search: string
  onSearchChange: (value: string) => void
}

function ChatListSkeleton() {
  return (
    <ul>
      {Array.from({ length: 9 }, (_, i) => (
        <li key={i} className="flex items-center gap-3 px-4 py-3">
          <SkeletonCircle className="h-9 w-9" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2.5 w-44" />
          </div>
          <Skeleton className="h-2.5 w-8" />
        </li>
      ))}
    </ul>
  )
}

/** Middle column: searchable conversation list fed by the users API. */
export function ChatList({
  conversations,
  loading,
  error,
  onRetry,
  selectedId,
  onSelect,
  search,
  onSearchChange,
}: ChatListProps) {
  return (
    <section className="flex w-full flex-col border-r border-gray-200 bg-white md:w-72 md:shrink-0">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-100 px-4">
        <div className="flex items-center gap-2">
          <PanelLeftIcon size={16} className="text-gray-400" />
          <h2 className="text-[14px] font-semibold text-gray-900">
            Michael Johnson
          </h2>
        </div>
        <button
          type="button"
          aria-label="New chat"
          className="text-gray-500 hover:text-gray-800"
        >
          <ComposeIcon size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2.5">
        <div className="flex flex-1 items-center gap-2 rounded-md bg-gray-50 px-2.5 py-1.5">
          <SearchIcon size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Chat"
            className="w-full bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          aria-label="Filters"
          className="text-gray-500 hover:text-gray-800"
        >
          <FilterIcon size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-[12px] text-gray-500">
        <button type="button" className="flex items-center gap-1 font-medium">
          Open <ChevronDownIcon size={12} />
        </button>
        <button type="button" className="flex items-center gap-1 font-medium">
          Newest <ChevronDownIcon size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <ChatListSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : conversations.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">
            No chats found
          </p>
        ) : (
          <ul>
            {conversations.map((conv) => (
              <li key={conv.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conv.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left ${
                    selectedId === conv.id
                      ? 'border-y border-gray-200 bg-gray-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar
                    id={conv.user.id}
                    firstName={conv.user.firstName}
                    lastName={conv.user.lastName}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13px] font-semibold text-gray-900">
                        {fullName(conv.user.firstName, conv.user.lastName)}
                      </span>
                      <span className="shrink-0 text-[11px] text-gray-400">
                        {conv.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[12px] text-gray-500">
                        {conv.preview}
                      </p>
                      {conv.unread > 0 && (
                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
