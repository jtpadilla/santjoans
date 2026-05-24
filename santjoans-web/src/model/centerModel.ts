import { Model } from './model.ts'
import type { ModelEntry, ViewerContext } from './types.ts'
import { ZOOM_MODES } from '../config/zoomModes.ts'

// Porte literal de CenterModel.java — estas tablas definen los límites válidos de viewport
// para que cada pieza central sea visible (la zona central tiene forma romboidal en la rejilla)
const INVALID_START_X = [23, 24, 26, 27, 28, 30, 31, 33, 34, 35]
const INVALID_END_X   = [21, 22, 23, 25, 26, 28, 29, 30, 32, 33]
const INVALID_START_Y = [9, 10, 12, 13, 15, 16, 17]
const INVALID_END_Y   = [7,  8,  9, 11, 12, 14, 15]

export class CenterModel extends Model {
  constructor() {
    super('center')
  }

  queryByContext(entries: ModelEntry[], context: ViewerContext): ModelEntry[] {
    const mode = ZOOM_MODES[context.zoomIdx]
    const endX = context.startX + mode.unitWidth
    const endY = context.startY + mode.unitHeight
    return entries.filter(e =>
      context.startX < INVALID_START_X[e.x] && endX > INVALID_END_X[e.x] &&
      context.startY < INVALID_START_Y[e.y] && endY > INVALID_END_Y[e.y]
    )
  }
}
