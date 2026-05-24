import type { IView } from './IView.ts'
import type { PiezePixels } from '../../config/screenType.ts'
import type { ZoomModeIdx } from '../../config/zoomModes.ts'
import type { ModelEntry } from '../../model/types.ts'
import type { Model } from '../../model/model.ts'
import { centerModel } from '../../model/modelDirectory.ts'
import {
  PIEZE_MAIN_HALF_DIAGONAL, PIEZE_CENTER_X_SIDE, PIEZE_CENTER_Y_SIDE,
  MODEL_CENTER_START_X, MODEL_CENTER_START_Y, MODEL_CENTER_END_X, MODEL_CENTER_END_Y,
  MODEL_CENTER_MAX_COORD_X, MODEL_CENTER_MAX_COORD_Y,
} from '../../config/constants.ts'
import {
  isIntoCenterCoord, mainXtoCenterX, mainYtoCenterY,
  pixelToMillimeterX, pixelToMillimeterY,
  millimeterToCoordX, millimeterToCoordY,
} from '../geometry.ts'

export class CenterView implements IView {
  private ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  updateFromModel(pixels: PiezePixels, startX: number, startY: number, stopX: number, stopY: number): void {
    const drawn: boolean[][] = Array.from({ length: MODEL_CENTER_MAX_COORD_Y + 1 }, () =>
      new Array<boolean>(MODEL_CENTER_MAX_COORD_X + 1).fill(false)
    )
    for (let y = startY; y <= stopY; y++) {
      for (let x = startX; x <= stopX; x++) {
        if (isIntoCenterCoord(x, y)) {
          const cx = mainXtoCenterX(x)
          const cy = mainYtoCenterY(y)
          if (drawn[cy][cx]) continue
          drawn[cy][cx] = true
          const pieze = centerModel.getPieze(cx, cy)
          if (pieze !== null) {
            if (pieze.getImageElement(pixels) === null) {
              this.drawEmptyPieze(startX, startY, cx, cy)
            } else {
              this.drawPieze(pixels, startX, startY, pieze)
            }
          } else {
            this.drawEmptyPieze(startX, startY, cx, cy)
          }
        }
      }
    }
  }

  drawPieze(pixels: PiezePixels, startX: number, startY: number, pieze: ModelEntry): void {
    const img = pieze.getImageElement(pixels)
    if (!img) return
    const xOffset = (pieze.x * PIEZE_CENTER_X_SIDE) + (MODEL_CENTER_START_X - startX) * PIEZE_MAIN_HALF_DIAGONAL
    const yOffset = (pieze.y * PIEZE_CENTER_Y_SIDE) + (MODEL_CENTER_START_Y - startY) * PIEZE_MAIN_HALF_DIAGONAL
    const ctx = this.ctx
    ctx.save()
    ctx.translate(xOffset, yOffset)
    ctx.drawImage(img, 0, 0, PIEZE_CENTER_X_SIDE, PIEZE_CENTER_Y_SIDE)
    ctx.restore()
  }

  private drawEmptyPieze(startX: number, startY: number, x: number, y: number): void {
    const ctx = this.ctx
    const xOffset = (x * PIEZE_CENTER_X_SIDE) + (MODEL_CENTER_START_X - startX) * PIEZE_MAIN_HALF_DIAGONAL
    const yOffset = (y * PIEZE_CENTER_Y_SIDE) + (MODEL_CENTER_START_Y - startY) * PIEZE_MAIN_HALF_DIAGONAL
    ctx.save()
    ctx.translate(xOffset, yOffset)
    ctx.strokeStyle = '#A29481'
    ctx.fillStyle = 'grey'
    ctx.lineWidth = 2
    ctx.fillRect(0, 0, PIEZE_CENTER_X_SIDE, PIEZE_CENTER_Y_SIDE)
    ctx.strokeRect(0, 0, PIEZE_CENTER_X_SIDE, PIEZE_CENTER_Y_SIDE)
    ctx.restore()
  }

  getPickedPieze(zoomIdx: ZoomModeIdx, startX: number, startY: number, xPixel: number, yPixel: number): ModelEntry | null {
    const xMainMm = pixelToMillimeterX(zoomIdx, xPixel)
    const yMainMm = pixelToMillimeterY(zoomIdx, yPixel)
    const xMainCoord = millimeterToCoordX(xMainMm) + startX
    const yMainCoord = millimeterToCoordY(yMainMm) + startY

    if (xMainCoord >= MODEL_CENTER_START_X && xMainCoord < MODEL_CENTER_END_X &&
        yMainCoord >= MODEL_CENTER_START_Y && yMainCoord < MODEL_CENTER_END_Y) {
      const xCenterMm = Math.trunc(xMainMm + startX * PIEZE_MAIN_HALF_DIAGONAL - MODEL_CENTER_START_X * PIEZE_MAIN_HALF_DIAGONAL)
      const yCenterMm = Math.trunc(yMainMm + startY * PIEZE_MAIN_HALF_DIAGONAL - MODEL_CENTER_START_Y * PIEZE_MAIN_HALF_DIAGONAL)
      const xCenterCoord = Math.trunc(xCenterMm / PIEZE_CENTER_X_SIDE)
      const yCenterCoord = Math.trunc(yCenterMm / PIEZE_CENTER_Y_SIDE)
      return centerModel.getPieze(xCenterCoord, yCenterCoord)
    }
    return null
  }

  getModel(): Model {
    return centerModel
  }
}
