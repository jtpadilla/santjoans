import { Model } from './model.ts'
import type { ModelEntry, ViewerContext } from './types.ts'
import { ZOOM_MODES } from '../config/zoomModes.ts'

export class MainModel extends Model {
  constructor() {
    super('main')
  }

  queryByContext(entries: ModelEntry[], context: ViewerContext): ModelEntry[] {
    const mode = ZOOM_MODES[context.zoomIdx]
    const endX = context.startX + mode.unitWidth
    const endY = context.startY + mode.unitHeight
    return entries.filter(e =>
      e.x >= context.startX && e.y >= context.startY &&
      e.x <= endX && e.y <= endY
    )
  }
}
