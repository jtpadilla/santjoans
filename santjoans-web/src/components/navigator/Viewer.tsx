import { useEffect, useRef, useState } from 'react'
import { MosaicEngine } from '../../engine/MosaicEngine.ts'
import { attachPointerHandlers } from '../../engine/pointer.ts'
import { getCurrentScreenType, refreshScreenType } from '../../config/screenType.ts'
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

  // canvasSize drives re-render so React syncs width/height attributes
  const initScreen = getCurrentScreenType()
  const [canvasSize, setCanvasSize] = useState({ w: initScreen.canvasX, h: initScreen.canvasY() })

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
        const s = getCurrentScreenType()
        setCanvasSize({ w: s.canvasX, h: s.canvasY() })
      }
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      detach()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        className="viewer-canvas"
        style={{ display: 'block' }}
      />
      {popupPieze && (
        <PiezePopup pieze={popupPieze} onClose={() => setPopupPieze(null)} />
      )}
    </>
  )
}
