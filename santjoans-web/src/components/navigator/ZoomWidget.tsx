import { ImageButton } from './ImageButton.tsx'
import type { MosaicEngine } from '../../engine/MosaicEngine.ts'
import { ZOOM_MODES } from '../../config/zoomModes.ts'
import type { ZoomModeIdx } from '../../config/zoomModes.ts'

interface Props {
  engine: MosaicEngine
  zoomIdx: ZoomModeIdx
  canZoomIn: boolean
  canZoomOut: boolean
}

export function ZoomWidget({ engine, zoomIdx, canZoomIn, canZoomOut }: Props) {
  return (
    <div className="zoom-widget">
      <ImageButton src="./ui/zoom-in-icon.png" alt="Ampliar" disabled={!canZoomIn} onClick={() => engine.zoomInAction()} />
      <span className="zoom-label">{ZOOM_MODES[zoomIdx].label}</span>
      <ImageButton src="./ui/zoom-out-icon.png" alt="Reducir" disabled={!canZoomOut} onClick={() => engine.zoomOutAction()} />
    </div>
  )
}
