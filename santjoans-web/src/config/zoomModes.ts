import type { PiezePixels } from './screenType.ts'

export interface ZoomMode {
  readonly label: string
  readonly unitWidth: number
  readonly unitHeight: number
  readonly steepX: number
  readonly steepY: number
  readonly millimetersWidth: number
  readonly millimetersHeight: number
  getPiezePixels(): PiezePixels
}

import { PIEZE_MAIN_HALF_DIAGONAL, MODEL_RATIO_X_Y } from './constants.ts'
import { getCurrentScreenType } from './screenType.ts'

function mmWidth(unitW: number) {
  return Math.trunc(unitW * PIEZE_MAIN_HALF_DIAGONAL)
}
function mmHeight(unitW: number) {
  return Math.trunc(mmWidth(unitW) * MODEL_RATIO_X_Y)
}

export const ZOOM_MODES = [
  { label: '100%', unitWidth: 54, unitHeight: 26, steepX: 0, steepY: 0,
    get millimetersWidth() { return mmWidth(this.unitWidth) },
    get millimetersHeight() { return mmHeight(this.unitWidth) },
    getPiezePixels() { return getCurrentScreenType().piezePixelsForZoom(0) },
  },
  { label: '150%', unitWidth: 40, unitHeight: 20, steepX: 2, steepY: 2,
    get millimetersWidth() { return mmWidth(this.unitWidth) },
    get millimetersHeight() { return mmHeight(this.unitWidth) },
    getPiezePixels() { return getCurrentScreenType().piezePixelsForZoom(1) },
  },
  { label: '200%', unitWidth: 26, unitHeight: 13, steepX: 1, steepY: 1,
    get millimetersWidth() { return mmWidth(this.unitWidth) },
    get millimetersHeight() { return mmHeight(this.unitWidth) },
    getPiezePixels() { return getCurrentScreenType().piezePixelsForZoom(2) },
  },
  { label: '400%', unitWidth: 14, unitHeight: 7, steepX: 1, steepY: 1,
    get millimetersWidth() { return mmWidth(this.unitWidth) },
    get millimetersHeight() { return mmHeight(this.unitWidth) },
    getPiezePixels() { return getCurrentScreenType().piezePixelsForZoom(3) },
  },
  { label: '800%', unitWidth: 8, unitHeight: 5, steepX: 2, steepY: 2,
    get millimetersWidth() { return mmWidth(this.unitWidth) },
    get millimetersHeight() { return mmHeight(this.unitWidth) },
    getPiezePixels() { return getCurrentScreenType().piezePixelsForZoom(4) },
  },
  { label: '1600%', unitWidth: 5, unitHeight: 3, steepX: 1, steepY: 1,
    get millimetersWidth() { return mmWidth(this.unitWidth) },
    get millimetersHeight() { return mmHeight(this.unitWidth) },
    getPiezePixels() { return getCurrentScreenType().piezePixelsForZoom(5) },
  },
] as const satisfies ZoomMode[]

export type ZoomModeIdx = 0 | 1 | 2 | 3 | 4 | 5
export const ZOOM_MAX_IDX: ZoomModeIdx = 5
export const ZOOM_MIN_IDX: ZoomModeIdx = 0

export function zoomIn(idx: ZoomModeIdx): ZoomModeIdx {
  return Math.min(idx + 1, ZOOM_MAX_IDX) as ZoomModeIdx
}
export function zoomOut(idx: ZoomModeIdx): ZoomModeIdx {
  return Math.max(idx - 1, ZOOM_MIN_IDX) as ZoomModeIdx
}
