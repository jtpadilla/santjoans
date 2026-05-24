import type { PiezePixels } from '../../config/screenType.ts'
import type { ZoomModeIdx } from '../../config/zoomModes.ts'
import type { ModelEntry } from '../../model/types.ts'
import type { Model } from '../../model/model.ts'

export interface IView {
  updateFromModel(pixels: PiezePixels, startX: number, startY: number, stopX: number, stopY: number): void
  drawPieze(pixels: PiezePixels, startX: number, startY: number, pieze: ModelEntry): void
  getPickedPieze(zoomIdx: ZoomModeIdx, startX: number, startY: number, xPixel: number, yPixel: number): ModelEntry | null
  getModel(): Model
}
