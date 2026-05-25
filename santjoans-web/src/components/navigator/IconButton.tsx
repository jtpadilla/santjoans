import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  alt: string
  disabled?: boolean
  onClick: () => void
  title?: string
}

export function IconButton({ icon, alt, disabled, onClick, title }: Props) {
  return (
    <button
      className="icon-btn"
      onClick={onClick}
      disabled={disabled}
      title={title ?? alt}
      aria-label={alt}
    >
      {icon}
    </button>
  )
}
