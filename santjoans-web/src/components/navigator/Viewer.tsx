import { useEffect, useRef, useState } from 'react'
import { MosaicEngine } from '../../engine/MosaicEngine.ts'
import { attachPointerHandlers } from '../../engine/pointer.ts'
import { getCurrentScreenType } from '../../config/screenType.ts'
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
  const screen = getCurrentScreenType()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = new MosaicEngine(canvas)
    onEngineReady(engine)
    engine.setPopupHandler((p: ModelEntry) => setPopupPieze(p))
    const detach = attachPointerHandlers(canvas, engine)
    engine.firstLoad((remaining) => setLoading(remaining))
    return () => { detach() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <canvas
        ref={canvasRef}
        width={screen.canvasX}
        height={screen.canvasY()}
        style={{ display: 'block', background: 'grey' }}
      />
      {popupPieze && (
        <PiezePopup pieze={popupPieze} onClose={() => setPopupPieze(null)} />
      )}
    </>
  )
}
