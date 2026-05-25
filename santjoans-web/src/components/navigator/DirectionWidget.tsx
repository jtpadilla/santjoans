import { IconButton } from './IconButton.tsx'
import { IconArrowUp, IconArrowDown, IconArrowLeft, IconArrowRight, IconHome } from './icons.tsx'
import type { MosaicEngine } from '../../engine/MosaicEngine.ts'

interface Props {
  engine: MosaicEngine
  canMoveLeft: boolean
  canMoveRight: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  canHome: boolean
}

export function DirectionWidget({ engine, canMoveLeft, canMoveRight, canMoveUp, canMoveDown, canHome }: Props) {
  return (
    <div className="direction-widget">
      <div className="direction-row">
        <IconButton icon={<IconArrowUp />} alt="Arriba" disabled={!canMoveUp} onClick={() => engine.moveUp()} />
      </div>
      <div className="direction-row">
        <IconButton icon={<IconArrowLeft />} alt="Izquierda" disabled={!canMoveLeft} onClick={() => engine.moveLeft()} />
        <IconButton icon={<IconHome />} alt="Reset" disabled={!canHome} onClick={() => engine.homeAction()} />
        <IconButton icon={<IconArrowRight />} alt="Derecha" disabled={!canMoveRight} onClick={() => engine.moveRight()} />
      </div>
      <div className="direction-row">
        <IconButton icon={<IconArrowDown />} alt="Abajo" disabled={!canMoveDown} onClick={() => engine.moveDown()} />
      </div>
    </div>
  )
}
