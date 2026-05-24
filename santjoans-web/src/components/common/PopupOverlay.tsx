import React, { useEffect } from 'react'

interface Props {
  onClose: () => void
  children: React.ReactNode
}

export function PopupOverlay({ onClose, children }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="popup-glass" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
