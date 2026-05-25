import { useState } from 'react'
import { Viewer } from './Viewer.tsx'
import { DirectionWidget } from './DirectionWidget.tsx'
import { ZoomWidget } from './ZoomWidget.tsx'
import { PreviewWidget } from './PreviewWidget.tsx'
import { ImageButton } from './ImageButton.tsx'
import { HelpPopup } from './HelpPopup.tsx'
import { useMosaicStore } from '../../store/mosaicStore.ts'
import type { MosaicEngine } from '../../engine/MosaicEngine.ts'

export function Navigator() {
  const [engine, setEngine] = useState<MosaicEngine | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)

  const { startX, startY, zoomIdx, canMoveLeft, canMoveRight, canMoveUp, canMoveDown, canZoomIn, canZoomOut } =
    useMosaicStore(s => s)

  return (
    <div className="page-box navigator-page-box">
      <h1 className="page-title">Cerámica Zoo-Mórfica del palacio de Santjoans</h1>
      <div className="navigator-canvas-area">
        <Viewer onEngineReady={setEngine} />
      </div>
      {engine && (
        <div className="navigator-controls-bar">
          <DirectionWidget
            engine={engine}
            canMoveLeft={canMoveLeft}
            canMoveRight={canMoveRight}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            canHome={canZoomOut}
          />
          <PreviewWidget engine={engine} startX={startX} startY={startY} zoomIdx={zoomIdx} />
          <ZoomWidget engine={engine} zoomIdx={zoomIdx} canZoomIn={canZoomIn} canZoomOut={canZoomOut} />
          <div className="navigator-help-btn">
            <ImageButton
              src="./ui/help-icon.png"
              alt="Ayuda"
              onClick={() => setHelpOpen(true)}
            />
          </div>
        </div>
      )}
      {helpOpen && <HelpPopup onClose={() => setHelpOpen(false)} />}
    </div>
  )
}
