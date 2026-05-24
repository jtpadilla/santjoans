import {
  PIEZE_MAIN_HALF_DIAGONAL,
  MODEL_CENTER_START_X, MODEL_CENTER_START_Y,
  MODEL_CENTER_END_X, MODEL_CENTER_END_Y,
} from '../config/constants.ts'
import type { ZoomModeIdx } from '../config/zoomModes.ts'
import { ZOOM_MODES } from '../config/zoomModes.ts'
import { getCurrentScreenType } from '../config/screenType.ts'

const MAIN_X_TO_CENTER_X = 0.7142857142857143
const MAIN_Y_TO_CENTER_Y = 0.7

export function getIndex(x: number, y: number): number {
  return y * 100 + x
}

export function getRadians(rotation: number): number {
  return (2 * Math.PI * rotation) / 360
}

export function isOdd(n: number): boolean {
  return n % 2 !== 0
}

export function isEven(n: number): boolean {
  return n % 2 === 0
}

export function isValidMainCoord(x: number, y: number): boolean {
  if ((isEven(y) && isOdd(x)) || (isOdd(y) && isEven(x))) {
    if (x > MODEL_CENTER_START_X && x < MODEL_CENTER_END_X &&
        y > MODEL_CENTER_START_Y && y < MODEL_CENTER_END_Y) {
      return false
    }
    return true
  }
  return false
}

export function isIntoCenterCoord(x: number, y: number): boolean {
  return x >= MODEL_CENTER_START_X && x < MODEL_CENTER_END_X &&
         y >= MODEL_CENTER_START_Y && y < MODEL_CENTER_END_Y
}

export function mainXtoCenterX(mainX: number): number {
  return Math.trunc((mainX - MODEL_CENTER_START_X) * MAIN_X_TO_CENTER_X)
}

export function mainYtoCenterY(mainY: number): number {
  return Math.trunc((mainY - MODEL_CENTER_START_Y) * MAIN_Y_TO_CENTER_Y)
}

export function pixelToMillimeterX(zoomIdx: ZoomModeIdx, pixel: number): number {
  const mode = ZOOM_MODES[zoomIdx]
  return Math.trunc((pixel * mode.millimetersWidth) / getCurrentScreenType().canvasX)
}

export function pixelToMillimeterY(zoomIdx: ZoomModeIdx, pixel: number): number {
  const mode = ZOOM_MODES[zoomIdx]
  return Math.trunc((pixel * mode.millimetersHeight) / getCurrentScreenType().canvasY())
}

export function millimeterToCoordX(mm: number): number {
  return Math.trunc(mm / PIEZE_MAIN_HALF_DIAGONAL)
}

export function millimeterToCoordY(mm: number): number {
  return Math.trunc(mm / PIEZE_MAIN_HALF_DIAGONAL)
}

export function millimeterToCoordXRest(mm: number): number {
  return Math.trunc(mm % PIEZE_MAIN_HALF_DIAGONAL)
}

export function millimeterToCoordYRest(mm: number): number {
  return Math.trunc(mm % PIEZE_MAIN_HALF_DIAGONAL)
}
