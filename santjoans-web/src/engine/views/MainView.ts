import type { IView } from './IView.ts'
import type { PiezePixels } from '../../config/screenType.ts'
import type { ZoomModeIdx } from '../../config/zoomModes.ts'
import type { ModelEntry } from '../../model/types.ts'
import type { Model } from '../../model/model.ts'
import { mainModel } from '../../model/modelDirectory.ts'
import {
  PIEZE_MAIN_SIDE, PIEZE_MAIN_HALF_DIAGONAL,
} from '../../config/constants.ts'
import {
  isValidMainCoord, isIntoCenterCoord,
  pixelToMillimeterX, pixelToMillimeterY,
  millimeterToCoordX, millimeterToCoordY,
  millimeterToCoordXRest, millimeterToCoordYRest,
  isEven, isOdd,
} from '../geometry.ts'

export class MainView implements IView {
  private ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  updateFromModel(pixels: PiezePixels, startX: number, startY: number, stopX: number, stopY: number): void {
    for (let y = startY; y <= stopY; y++) {
      for (let x = startX; x <= stopX; x++) {
        if (isValidMainCoord(x, y)) {
          const pieze = mainModel.getPieze(x, y)
          if (pieze !== null) {
            if (pieze.getImageElement(pixels) === null) {
              this.drawEmptyPieze(startX, startY, x, y)
            } else {
              this.drawPieze(pixels, startX, startY, pieze)
            }
          } else {
            this.drawEmptyPieze(startX, startY, x, y)
          }
        }
      }
    }
  }

  drawPieze(pixels: PiezePixels, startX: number, startY: number, pieze: ModelEntry): void {
    const ctx = this.ctx
    const img = pieze.getImageElement(pixels)
    if (!img) return
    const tmpX = pieze.x - startX
    const tmpY = pieze.y - startY
    ctx.save()
    ctx.translate(tmpX * PIEZE_MAIN_HALF_DIAGONAL, tmpY * PIEZE_MAIN_HALF_DIAGONAL)
    ctx.rotate(pieze.miniatureRadians)
    ctx.drawImage(img, -(PIEZE_MAIN_SIDE / 2), -(PIEZE_MAIN_SIDE / 2), PIEZE_MAIN_SIDE, PIEZE_MAIN_SIDE)
    ctx.restore()
  }

  private drawEmptyPieze(startX: number, startY: number, x: number, y: number): void {
    const ctx = this.ctx
    const tmpX = x - startX
    const tmpY = y - startY
    ctx.save()
    ctx.translate(tmpX * PIEZE_MAIN_HALF_DIAGONAL, tmpY * PIEZE_MAIN_HALF_DIAGONAL)
    ctx.rotate(Math.PI / 4)  // 45°
    ctx.strokeStyle = '#A29481'
    ctx.fillStyle = 'grey'
    ctx.lineWidth = 2
    ctx.fillRect(-(PIEZE_MAIN_SIDE / 2), -(PIEZE_MAIN_SIDE / 2), PIEZE_MAIN_SIDE, PIEZE_MAIN_SIDE)
    ctx.strokeRect(-(PIEZE_MAIN_SIDE / 2), -(PIEZE_MAIN_SIDE / 2), PIEZE_MAIN_SIDE, PIEZE_MAIN_SIDE)
    ctx.restore()
  }

  getPickedPieze(zoomIdx: ZoomModeIdx, startX: number, startY: number, xPixel: number, yPixel: number): ModelEntry | null {
    const xMainMm = pixelToMillimeterX(zoomIdx, xPixel)
    const yMainMm = pixelToMillimeterY(zoomIdx, yPixel)

    let xMainCoord = millimeterToCoordX(xMainMm)
    let yMainCoord = millimeterToCoordY(yMainMm)

    xMainCoord += startX
    yMainCoord += startY

    if (isIntoCenterCoord(xMainCoord, yMainCoord)) return null

    const xMilliRest = millimeterToCoordXRest(xMainMm)
    const yMilliRest = millimeterToCoordYRest(yMainMm)

    const goUp = (isEven(yMainCoord) && isOdd(xMainCoord)) || (isOdd(yMainCoord) && isEven(xMainCoord))

    let left: boolean
    if (goUp) {
      left = xMilliRest <= PIEZE_MAIN_HALF_DIAGONAL - yMilliRest
    } else {
      left = xMilliRest <= yMilliRest
    }

    let xPieze: number
    let yPieze: number

    if (isEven(yMainCoord)) {
      if (isEven(xMainCoord)) {
        if (left) { yPieze = yMainCoord + 1; xPieze = xMainCoord }
        else       { yPieze = yMainCoord;     xPieze = xMainCoord + 1 }
      } else {
        if (left) { yPieze = yMainCoord;     xPieze = xMainCoord }
        else       { yPieze = yMainCoord + 1; xPieze = xMainCoord + 1 }
      }
    } else {
      if (isEven(xMainCoord)) {
        if (left) { yPieze = yMainCoord;     xPieze = xMainCoord }
        else       { yPieze = yMainCoord + 1; xPieze = xMainCoord + 1 }
      } else {
        if (left) { yPieze = yMainCoord + 1; xPieze = xMainCoord }
        else       { yPieze = yMainCoord;     xPieze = xMainCoord + 1 }
      }
    }

    return mainModel.getPieze(xPieze, yPieze)
  }

  getModel(): Model {
    return mainModel
  }
}
