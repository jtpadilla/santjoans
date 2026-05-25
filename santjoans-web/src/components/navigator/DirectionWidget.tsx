import { IconButton } from './IconButton.tsx'
import { IconArrowUp, IconArrowDown, IconArrowLeft, IconArrowRight, IconHome } from './icons.tsx'
import { useLocale } from '../../i18n/useLocale.ts'
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
  const { m } = useLocale()
  return (
    <div className="direction-widget">
      <div className="direction-row">
        <IconButton icon={<IconArrowUp />} alt={m.altUp} disabled={!canMoveUp} onClick={() => engine.moveUp()} />
      </div>
      <div className="direction-row">
        <IconButton icon={<IconArrowLeft />} alt={m.altLeft} disabled={!canMoveLeft} onClick={() => engine.moveLeft()} />
        <IconButton icon={<IconHome />} alt={m.altHome} disabled={!canHome} onClick={() => engine.homeAction()} />
        <IconButton icon={<IconArrowRight />} alt={m.altRight} disabled={!canMoveRight} onClick={() => engine.moveRight()} />
      </div>
      <div className="direction-row">
        <IconButton icon={<IconArrowDown />} alt={m.altDown} disabled={!canMoveDown} onClick={() => engine.moveDown()} />
      </div>
    </div>
  )
}
