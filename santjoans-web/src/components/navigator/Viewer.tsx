import { useEffect, useRef, useState } from 'react'
import { MosaicEngine } from '../../engine/MosaicEngine.ts'
import { attachPointerHandlers } from '../../engine/pointer.ts'
import { refreshScreenType } from '../../config/screenType.ts'
import { useMosaicStore } from '../../store/mosaicStore.ts'
import type { ModelEntry } from '../../model/types.ts'
import { PiezePopup } from './PiezePopup.tsx'

interface Props {
  onEngineReady: (engine: MosaicEngine) => void
}

export function Viewer({ onEngineReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [popupPieze, setPopupPieze] = useState<ModelEntry | null>(null)
  const setLoading = useMosaicStore(s => s.setLoading)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = new MosaicEngine(canvas)
    onEngineReady(engine)
    engine.setPopupHandler((p: ModelEntry) => setPopupPieze(p))
    const detach = attachPointerHandlers(canvas, engine)
    engine.firstLoad((remaining) => setLoading(remaining))

    function onResize() {
      if (refreshScreenType()) {
        engine.handleResize()
      }
    }
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        engine.invalidate()
      }
    }
    function onPageShow() {
      engine.invalidate()
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      detach()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <canvas
        ref={canvasRef}
        className="viewer-canvas"
        style={{ display: 'block' }}
      />
      {popupPieze && (
        <PiezePopup pieze={popupPieze} onClose={() => setPopupPieze(null)} />
      )}
    </>
  )
}
