import type { MosaicEngine } from './MosaicEngine.ts'

interface PtrRec {
  x: number; y: number
  downX: number; downY: number
  downTime: number
  type: string
}

export function attachPointerHandlers(canvas: HTMLCanvasElement, engine: MosaicEngine): () => void {
  canvas.style.cursor = 'pointer'
  canvas.style.touchAction = 'none'

  const ptrs = new Map<number, PtrRec>()
  let pinchBaseDist = 0
  let mode: 'idle' | 'pan' | 'pinch' = 'idle'

  function xy(e: PointerEvent): [number, number] {
    const r = canvas.getBoundingClientRect()
    return [
      Math.trunc((e.clientX - r.left) * (canvas.width  / r.width)),
      Math.trunc((e.clientY - r.top)  * (canvas.height / r.height)),
    ]
  }

  function pinchDist(): number {
    const [a, b] = [...ptrs.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  function onPointerDown(e: PointerEvent) {
    canvas.setPointerCapture(e.pointerId)
    const [x, y] = xy(e)
    ptrs.set(e.pointerId, { x, y, downX: x, downY: y, downTime: Date.now(), type: e.pointerType })

    if (ptrs.size === 1) {
      mode = 'pan'
      engine.onPointerDown(x, y)
      canvas.style.cursor = 'move'
    } else if (ptrs.size === 2) {
      mode = 'pinch'
      engine.onPointerUp()   // cancelar pan en curso
      pinchBaseDist = pinchDist()
      canvas.style.cursor = 'default'
    }
    // 3+ dedos: ignorar
  }

  function onPointerMove(e: PointerEvent) {
    const rec = ptrs.get(e.pointerId)
    if (!rec) return
    const [x, y] = xy(e)
    rec.x = x
    rec.y = y

    if (mode === 'pan') {
      engine.onPointerMove(x, y)
    } else if (mode === 'pinch' && ptrs.size === 2) {
      const d = pinchDist()
      const RATIO = 1.35
      if (d > pinchBaseDist * RATIO && engine.canZoomIn()) {
        engine.zoomInAction()
        pinchBaseDist = d
      } else if (d < pinchBaseDist / RATIO && engine.canZoomOut()) {
        engine.zoomOutAction()
        pinchBaseDist = d
      }
    }
  }

  function endPointer(e: PointerEvent) {
    canvas.releasePointerCapture(e.pointerId)
    const rec = ptrs.get(e.pointerId)
    ptrs.delete(e.pointerId)

    if (mode === 'pinch') {
      if (ptrs.size === 0) {
        mode = 'idle'
        pinchBaseDist = 0
      }
      canvas.style.cursor = 'pointer'
      return
    }

    // modo pan, último dedo levantado
    if (mode === 'pan' && ptrs.size === 0) {
      engine.onPointerUp()
      mode = 'idle'
      canvas.style.cursor = 'pointer'

      // Tap-pick: solo en touch/pen, movimiento mínimo, tiempo breve
      if (rec && rec.type !== 'mouse') {
        const dist = Math.hypot(rec.x - rec.downX, rec.y - rec.downY)
        if (dist < 10 && Date.now() - rec.downTime < 250) {
          engine.onDoubleClick(rec.x, rec.y)
        }
      }
    }
  }

  function onPointerCancel(e: PointerEvent) {
    ptrs.delete(e.pointerId)
    if (ptrs.size === 0) {
      engine.onPointerUp()
      mode = 'idle'
      pinchBaseDist = 0
      canvas.style.cursor = 'pointer'
    }
  }

  function onPointerLeave() {
    if (ptrs.size > 0) return   // capturado: ignorar leave
    engine.onPointerUp()
    mode = 'idle'
    canvas.style.cursor = 'pointer'
  }

  function onDblClick(e: MouseEvent) {
    const r = canvas.getBoundingClientRect()
    engine.onDoubleClick(
      Math.trunc((e.clientX - r.left) * (canvas.width  / r.width)),
      Math.trunc((e.clientY - r.top)  * (canvas.height / r.height)),
    )
  }

  canvas.addEventListener('pointerdown',  onPointerDown)
  canvas.addEventListener('pointermove',  onPointerMove)
  canvas.addEventListener('pointerup',    endPointer)
  canvas.addEventListener('pointercancel', onPointerCancel)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('dblclick',     onDblClick)

  return () => {
    canvas.removeEventListener('pointerdown',  onPointerDown)
    canvas.removeEventListener('pointermove',  onPointerMove)
    canvas.removeEventListener('pointerup',    endPointer)
    canvas.removeEventListener('pointercancel', onPointerCancel)
    canvas.removeEventListener('pointerleave', onPointerLeave)
    canvas.removeEventListener('dblclick',     onDblClick)
  }
}
