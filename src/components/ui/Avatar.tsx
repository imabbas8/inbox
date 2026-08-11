import { avatarColor, initials } from '../../utils/format'

interface AvatarProps {
  id: number
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-10 w-10 text-sm',
}

/** Colored initials avatar, deterministic per user id. */
export function Avatar({ id, firstName, lastName, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${SIZES[size]} ${avatarColor(id)}`}
    >
      {initials(firstName, lastName)}
    </div>
  )
}
