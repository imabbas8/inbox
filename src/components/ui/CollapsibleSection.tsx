import { useState, type ReactNode } from 'react'
import { ChevronDownIcon } from '../icons'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

/** Section with chevron header used in the sidebar and details panel. */
export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 py-2 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-1.5 text-[13px] font-semibold text-gray-800"
      >
        {title}
        <ChevronDownIcon
          size={14}
          className={`text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && <div className="px-4 pt-1 pb-2">{children}</div>}
    </div>
  )
}
