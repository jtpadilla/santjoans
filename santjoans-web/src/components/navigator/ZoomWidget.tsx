import { IconButton } from './IconButton.tsx'
import { IconZoomIn, IconZoomOut } from './icons.tsx'
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
      <IconButton icon={<IconZoomIn />} alt="Ampliar" disabled={!canZoomIn} onClick={() => engine.zoomInAction()} />
      <span className="zoom-label">{ZOOM_MODES[zoomIdx].label}</span>
      <IconButton icon={<IconZoomOut />} alt="Reducir" disabled={!canZoomOut} onClick={() => engine.zoomOutAction()} />
    </div>
  )
}
