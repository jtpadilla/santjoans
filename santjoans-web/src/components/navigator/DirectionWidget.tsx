import { ImageButton } from './ImageButton.tsx'
import type { MosaicEngine } from '../../engine/MosaicEngine.ts'

interface Props {
  engine: MosaicEngine
  canMoveLeft: boolean
  canMoveRight: boolean
  canMoveUp: boolean
  canMoveDown: boolean
}

export function DirectionWidget({ engine, canMoveLeft, canMoveRight, canMoveUp, canMoveDown }: Props) {
  return (
    <div className="direction-widget">
      <div className="direction-row">
        <ImageButton src="./ui/up-icon.png" alt="Arriba" disabled={!canMoveUp} onClick={() => engine.moveUp()} />
      </div>
      <div className="direction-row">
        <ImageButton src="./ui/left-icon.png" alt="Izquierda" disabled={!canMoveLeft} onClick={() => engine.moveLeft()} />
        <ImageButton src="./ui/home-icon.png" alt="Reset" onClick={() => engine.setPosition(0, 0)} />
        <ImageButton src="./ui/right-icon.png" alt="Derecha" disabled={!canMoveRight} onClick={() => engine.moveRight()} />
      </div>
      <div className="direction-row">
        <ImageButton src="./ui/down-icon.png" alt="Abajo" disabled={!canMoveDown} onClick={() => engine.moveDown()} />
      </div>
    </div>
  )
}
