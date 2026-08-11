import {
  ContactsIcon,
  InboxIcon,
  MegaphoneIcon,
  SettingsIcon,
  SparkIcon,
  WorkflowIcon,
} from '../icons'

const NAV_ITEMS = [
  { label: 'Inbox', icon: InboxIcon, active: true },
  { label: 'Contacts', icon: ContactsIcon },
  { label: 'AI Employees', icon: SparkIcon },
  { label: 'Workflows', icon: WorkflowIcon },
  { label: 'Campaigns', icon: MegaphoneIcon },
]

/** Top navigation bar with brand, primary tabs and account controls. */
export function TopNav() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-6">
        <a href="#" className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-[11px] font-bold text-white">
            h
          </span>
          <span className="text-lg font-bold text-brand">heyy</span>
        </a>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium ${
                active
                  ? 'border border-gray-200 bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Settings"
          className="text-gray-500 hover:text-gray-800"
        >
          <SettingsIcon size={17} />
        </button>
        <button type="button" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white">
            M
          </span>
          <span className="text-[13px] font-medium text-gray-800">
            Michael Johnson
          </span>
        </button>
      </div>
    </header>
  )
}
