import {
  GlobeIcon,
  HierarchyIcon,
  MailIcon,
  ShareIcon,
  UsersIcon,
} from '../icons'

const HEXAGONS = [
  { icon: ShareIcon, className: 'top-[16%] left-[12%]' },
  { icon: MailIcon, className: 'top-[38%] left-[7%]' },
  { icon: UsersIcon, className: 'top-[58%] left-[16%]' },
  { icon: HierarchyIcon, className: 'top-[34%] right-[10%]' },
  { icon: GlobeIcon, className: 'top-[58%] right-[6%]' },
]

/** Full-screen "Extracting Information..." state shown while boot data loads. */
export function ExtractingScreen() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#1d4ed8_0%,#0b1b3f_60%,#060f26_100%)] text-white">
      {HEXAGONS.map(({ icon: Icon, className }, i) => (
        <div
          key={i}
          className={`absolute flex h-14 w-14 items-center justify-center text-white/70 ${className}`}
          style={{
            clipPath:
              'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
            background: 'rgba(255,255,255,0.08)',
          }}
        >
          <Icon size={20} />
        </div>
      ))}

      <div className="relative mb-10 h-28 w-28">
        <div className="animate-spin-ring absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-blue-500/40" />
        <div className="absolute inset-2 rounded-full border border-white/10" />
      </div>

      <h1 className="text-2xl font-semibold tracking-wide">
        Extracting Information...
      </h1>
      <p className="mt-2 max-w-xs text-center text-sm text-blue-100/80">
        We are extracting information from the above honey combs to your system
      </p>
    </div>
  )
}
