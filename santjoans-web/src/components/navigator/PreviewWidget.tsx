import { useEffect, useRef } from 'react'
import type { ZoomModeIdx } from '../../config/zoomModes.ts'
import { ZOOM_MODES } from '../../config/zoomModes.ts'
import { PREVIEW_X, PREVIEW_Y, PIEZE_MAIN_HALF_DIAGONAL } from '../../config/constants.ts'
import type { MosaicEngine } from '../../engine/MosaicEngine.ts'

interface Props {
  engine: MosaicEngine
  startX: number
  startY: number
  zoomIdx: ZoomModeIdx
}

function mmToPreviewPxX(mm: number): number {
  return (mm * PREVIEW_X) / ZOOM_MODES[0].millimetersWidth
}
function mmToPreviewPxY(mm: number): number {
  return (mm * PREVIEW_Y) / ZOOM_MODES[0].millimetersHeight
}

export function PreviewWidget({ engine, startX, startY, zoomIdx }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Drag state within the preview
  const dragRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const mode = ZOOM_MODES[zoomIdx]
    const endX = startX + mode.unitWidth
    const endY = startY + mode.unitHeight

    const rectX = mmToPreviewPxX(startX * PIEZE_MAIN_HALF_DIAGONAL)
    const rectY = mmToPreviewPxY(startY * PIEZE_MAIN_HALF_DIAGONAL)
    const rectW = mmToPreviewPxX((endX - startX) * PIEZE_MAIN_HALF_DIAGONAL)
    const rectH = mmToPreviewPxY((endY - startY) * PIEZE_MAIN_HALF_DIAGONAL)

    // Dibujar fondo (miniatura.png) + rect de viewport
    const bg = new Image()
    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, PREVIEW_X, PREVIEW_Y)
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.strokeRect(rectX, rectY, rectW, rectH)
    }
    bg.src = './miniatura.png'
  }, [startX, startY, zoomIdx])

  function previewCoordToMain(px: number, py: number): [number, number] {
    const mode = ZOOM_MODES[zoomIdx]
    const mmX = (px / PREVIEW_X) * ZOOM_MODES[0].millimetersWidth
    const mmY = (py / PREVIEW_Y) * ZOOM_MODES[0].millimetersHeight
    const cx = Math.trunc(mmX / PIEZE_MAIN_HALF_DIAGONAL)
    const cy = Math.trunc(mmY / PIEZE_MAIN_HALF_DIAGONAL)
    return [cx - Math.trunc(mode.unitWidth / 2), cy - Math.trunc(mode.unitHeight / 2)]
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    dragRef.current = true
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const [nx, ny] = previewCoordToMain(px, py)
    engine.setPosition(nx, ny)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragRef.current) return
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const [nx, ny] = previewCoordToMain(px, py)
    engine.setPosition(nx, ny)
  }

  function handlePointerUp() {
    dragRef.current = false
  }

  return (
    <canvas
      ref={canvasRef}
      width={PREVIEW_X}
      height={PREVIEW_Y}
      className="preview-canvas"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
    />
  )
}
