interface SkeletonProps {
  className?: string
}

/** Grey pulsing placeholder bar matching the Figma skeleton state. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return <div className={`skeleton rounded-full ${className}`} />
}
