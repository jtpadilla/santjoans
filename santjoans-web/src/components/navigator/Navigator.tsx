import { useRef, useState } from 'react'
import { Viewer } from './Viewer.tsx'
import { DirectionWidget } from './DirectionWidget.tsx'
import { ZoomWidget } from './ZoomWidget.tsx'
import { PreviewWidget } from './PreviewWidget.tsx'
import { ImageButton } from './ImageButton.tsx'
import { HelpPopup } from './HelpPopup.tsx'
import { useMosaicStore } from '../../store/mosaicStore.ts'
import type { MosaicEngine } from '../../engine/MosaicEngine.ts'

export function Navigator() {
  const engineRef = useRef<MosaicEngine | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)

  const { startX, startY, zoomIdx, canMoveLeft, canMoveRight, canMoveUp, canMoveDown, canZoomIn, canZoomOut } =
    useMosaicStore(s => s)

  const engine = engineRef.current

  return (
    <div className="navigator-root">
      <div className="navigator-canvas-area">
        <Viewer engineRef={engineRef} />
      </div>
      <div className="navigator-controls">
        <div className="navigator-controls-top">
          {engine && (
            <PreviewWidget engine={engine} startX={startX} startY={startY} zoomIdx={zoomIdx} />
          )}
        </div>
        <div className="navigator-controls-middle">
          {engine && (
            <DirectionWidget
              engine={engine}
              canMoveLeft={canMoveLeft}
              canMoveRight={canMoveRight}
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
            />
          )}
        </div>
        <div className="navigator-controls-bottom">
          {engine && (
            <ZoomWidget engine={engine} zoomIdx={zoomIdx} canZoomIn={canZoomIn} canZoomOut={canZoomOut} />
          )}
          <ImageButton
            src="./ui/help-icon.png"
            alt="Ayuda"
            onClick={() => setHelpOpen(true)}
          />
        </div>
      </div>
      {helpOpen && <HelpPopup onClose={() => setHelpOpen(false)} />}
    </div>
  )
}
