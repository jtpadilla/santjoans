const SVG_PROPS = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconArrowUp() {
  return <svg {...SVG_PROPS}><polyline points="18 15 12 9 6 15" /></svg>
}

export function IconArrowDown() {
  return <svg {...SVG_PROPS}><polyline points="6 9 12 15 18 9" /></svg>
}

export function IconArrowLeft() {
  return <svg {...SVG_PROPS}><polyline points="15 18 9 12 15 6" /></svg>
}

export function IconArrowRight() {
  return <svg {...SVG_PROPS}><polyline points="9 6 15 12 9 18" /></svg>
}

export function IconHome() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 13 15 13 15 21" />
    </svg>
  )
}

export function IconZoomIn() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

export function IconZoomOut() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

export function IconHelp() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
