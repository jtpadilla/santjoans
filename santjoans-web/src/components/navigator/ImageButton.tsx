interface Props {
  src: string
  alt: string
  disabled?: boolean
  onClick: () => void
  title?: string
}

export function ImageButton({ src, alt, disabled, onClick, title }: Props) {
  return (
    <button
      className={`img-btn${disabled ? ' img-btn--disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      <img src={src} alt={alt} />
    </button>
  )
}
