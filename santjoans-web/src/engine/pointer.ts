import type { MosaicEngine } from './MosaicEngine.ts'

export function attachPointerHandlers(canvas: HTMLCanvasElement, engine: MosaicEngine): () => void {
  function canvasXY(e: PointerEvent): [number, number] {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return [
      Math.trunc((e.clientX - rect.left) * scaleX),
      Math.trunc((e.clientY - rect.top) * scaleY),
    ]
  }

  function onPointerDown(e: PointerEvent) {
    canvas.setPointerCapture(e.pointerId)
    canvas.style.cursor = 'move'
    const [x, y] = canvasXY(e)
    engine.onPointerDown(x, y)
  }

  function onPointerMove(e: PointerEvent) {
    const [x, y] = canvasXY(e)
    engine.onPointerMove(x, y)
  }

  function onPointerUp(e: PointerEvent) {
    canvas.releasePointerCapture(e.pointerId)
    canvas.style.cursor = 'pointer'
    engine.onPointerUp()
  }

  function onPointerLeave() {
    canvas.style.cursor = 'pointer'
    engine.onPointerUp()
  }

  function onDblClick(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.trunc((e.clientX - rect.left) * scaleX)
    const y = Math.trunc((e.clientY - rect.top) * scaleY)
    engine.onDoubleClick(x, y)
  }

  canvas.style.cursor = 'pointer'
  canvas.style.touchAction = 'manipulation'
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('dblclick', onDblClick)

  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointerleave', onPointerLeave)
    canvas.removeEventListener('dblclick', onDblClick)
  }
}
