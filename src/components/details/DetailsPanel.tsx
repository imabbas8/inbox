import { useState } from 'react'
import type { ApiUser } from '../../types'
import { PanelIcon, PlusIcon, TagIcon, UserIcon } from '../icons'
import { CollapsibleSection } from '../ui/CollapsibleSection'
import { ErrorState } from '../ui/ErrorState'
import { Skeleton, SkeletonCircle } from '../ui/Skeleton'

interface DetailsPanelProps {
  user: ApiUser | null
  loading: boolean
  error: string | null
  onRetry: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[12px] text-gray-400">{label}</span>
      <span className="max-w-[60%] truncate text-right text-[12px] font-medium text-gray-800">
        {value}
      </span>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div className="space-y-5 p-4">
      {Array.from({ length: 3 }, (_, section) => (
        <div key={section} className="space-y-3">
          <Skeleton className="h-3 w-20" />
          {Array.from({ length: 3 }, (_, row) => (
            <div key={row} className="flex items-center justify-between">
              <Skeleton className="h-2.5 w-16" />
              <div className="flex items-center gap-2">
                <SkeletonCircle className="h-5 w-5" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/** Right column: chat metadata, contact info (from API), labels and notes. */
export function DetailsPanel({ user, loading, error, onRetry }: DetailsPanelProps) {
  const [labels, setLabels] = useState(['Closed Won', 'Chicago'])
  const [notes, setNotes] = useState(['Strong potential for future upgrades'])
  const [noteDraft, setNoteDraft] = useState('')

  const addNote = () => {
    const text = noteDraft.trim()
    if (!text) return
    setNotes((n) => [...n, text])
    setNoteDraft('')
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-gray-200 bg-white">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-100 px-4">
        <h2 className="text-[14px] font-semibold text-gray-900">Details</h2>
        <PanelIcon size={16} className="text-gray-400" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <DetailsSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : user ? (
          <>
            <CollapsibleSection title="Chat Data">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[12px] text-gray-400">Assignee</span>
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-gray-800">
                  <UserIcon size={13} className="text-gray-400" /> James West
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[12px] text-gray-400">Team</span>
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-gray-800">
                  <UserIcon size={13} className="text-gray-400" /> Sales Team
                </span>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Contact Data">
              <Field label="First Name" value={user.firstName} />
              <Field label="Last Name" value={user.lastName} />
              <Field label="Phone number" value={user.phone} />
              <Field label="Email" value={user.email} />
              <button
                type="button"
                className="pt-1 text-[12px] font-semibold text-gray-800 hover:underline"
              >
                See all
              </button>
            </CollapsibleSection>

            <CollapsibleSection title="Contact Labels">
              <div className="flex flex-wrap items-center gap-1.5">
                {labels.map((label) => (
                  <span
                    key={label}
                    className="flex items-center gap-1 rounded-full border border-blue-200 px-2 py-0.5 text-[11px] font-medium text-blue-600"
                  >
                    <TagIcon size={11} />
                    {label}
                  </span>
                ))}
                <button
                  type="button"
                  aria-label="Add label"
                  onClick={() => setLabels((l) => [...l, user.address.city])}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <PlusIcon size={11} />
                </button>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Notes">
              <div className="space-y-1.5">
                <input
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addNote()}
                  placeholder="Add a note"
                  className="w-full rounded-md bg-note px-2.5 py-1.5 text-[12px] text-gray-700 outline-none placeholder:text-gray-500"
                />
                {notes.map((note, i) => (
                  <p
                    key={i}
                    className="rounded-md bg-note px-2.5 py-1.5 text-[12px] text-gray-700"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Other Chats">
              <div className="flex items-center gap-2 py-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                  F
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-gray-800">
                    Fit4Life
                  </p>
                  <p className="truncate text-[11px] text-gray-400">
                    On my way!
                  </p>
                </div>
              </div>
            </CollapsibleSection>
          </>
        ) : (
          <p className="p-6 text-center text-sm text-gray-400">
            Select a chat to see details
          </p>
        )}
      </div>
    </aside>
  )
}
