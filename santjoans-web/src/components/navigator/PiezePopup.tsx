import { useEffect, useRef } from 'react'
import { PopupOverlay } from '../common/PopupOverlay.tsx'
import type { ModelEntry } from '../../model/types.ts'
import { getCurrentScreenType } from '../../config/screenType.ts'
import { loadImages } from '../../loader/imageLoader.ts'

interface Props {
  pieze: ModelEntry
  onClose: () => void
}

export function PiezePopup({ pieze, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const screen = getCurrentScreenType()
  const w = screen.piezeViewerWidth
  const h = screen.piezeViewerHeight
  const side = screen.piezeViewerSide

  useEffect(() => {
    const ac = new AbortController()
    document.body.style.cursor = 'wait'
    loadImages([pieze.getImageDetailedUrl()], ac.signal).then(([img]) => {
      document.body.style.cursor = 'default'
      const canvas = canvasRef.current
      if (!canvas || ac.signal.aborted) return
      const ctx = canvas.getContext('2d')!
      ctx.save()
      ctx.translate(h / 2, w / 2)
      ctx.rotate(pieze.detailRadians)
      ctx.drawImage(img, -(side / 2), -(side / 2), side, side)
      ctx.restore()
    }).catch(() => { document.body.style.cursor = 'default' })
    return () => { ac.abort(); document.body.style.cursor = 'default' }
  }, [pieze, w, h, side])

  return (
    <PopupOverlay onClose={onClose}>
      <canvas ref={canvasRef} width={w} height={h} />
    </PopupOverlay>
  )
}
