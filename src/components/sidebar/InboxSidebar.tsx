import type { ApiUser } from '../../types'
import { fullName } from '../../utils/format'
import {
  ChevronDownIcon,
  ContactsIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from '../icons'
import { Avatar } from '../ui/Avatar'
import { Skeleton, SkeletonCircle } from '../ui/Skeleton'

interface InboxSidebarProps {
  users: ApiUser[]
  loading: boolean
  selectedUserId: number | null
  onSelectUser: (id: number) => void
  unreadCounts: Record<number, number>
  totalCount: number
}

function SidebarRow({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  count?: number
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[13px] ${
        active
          ? 'border border-gray-200 bg-white font-medium text-gray-900 shadow-sm'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">{count}</span>
      )}
    </button>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-4 mb-1 flex items-center justify-between px-2">
      <span className="text-[13px] font-semibold text-gray-800">{title}</span>
      <ChevronDownIcon size={14} className="text-gray-400" />
    </div>
  )
}

/** Left sidebar: inbox filters, teams, users (from API) and channels. */
export function InboxSidebar({
  users,
  loading,
  selectedUserId,
  onSelectUser,
  unreadCounts,
  totalCount,
}: InboxSidebarProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-gray-50/60 px-2 py-3">
      <h2 className="px-2 pb-2 text-[15px] font-bold text-gray-900">Inbox</h2>

      <SidebarRow icon={<UserIcon size={15} />} label="My Inbox" />
      <SidebarRow
        icon={<UsersIcon size={15} />}
        label="All"
        count={totalCount}
        active
      />
      <SidebarRow
        icon={<ContactsIcon size={15} />}
        label="Unassigned"
        count={5}
      />

      <SectionHeader title="Teams" />
      <SidebarRow icon={<TagIcon size={15} />} label="Sales" count={7} />
      <SidebarRow
        icon={<TagIcon size={15} />}
        label="Customer Support"
        count={16}
      />

      <SectionHeader title="Users" />
      {loading
        ? Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5">
              <SkeletonCircle className="h-6 w-6" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))
        : users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => onSelectUser(user.id)}
              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[13px] ${
                selectedUserId === user.id
                  ? 'border border-gray-200 bg-white font-medium text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Avatar
                  id={user.id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  size="sm"
                />
                <span className="truncate">
                  {fullName(user.firstName, user.lastName)}
                </span>
              </span>
              {unreadCounts[user.id] ? (
                <span className="text-xs text-gray-400">
                  {unreadCounts[user.id]}
                </span>
              ) : null}
            </button>
          ))}

      <SectionHeader title="Channels" />
      <SidebarRow
        icon={
          <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500 text-[9px] font-bold text-white">
            F
          </span>
        }
        label="Fit4Life"
      />
    </aside>
  )
}
