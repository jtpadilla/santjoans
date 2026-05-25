import type { ZoomModeIdx } from './zoomModes.ts'
import { MODEL_RATIO_X_Y } from './constants.ts'

export type PiezePixels = '60' | '360' | '550'

interface ScreenDef {
  readonly screenWidth: number
  readonly screenHeight: number
  readonly imageViewerMaxWidthLandscape: number
  readonly imageViewerMaxWidthPortrait: number
  readonly imageViewerMaxWidthMultiImage: number
  readonly canvasX: number
  readonly piezeViewerHeight: number
  readonly piezeViewerWidth: number
  readonly piezeViewerSide: number
  readonly piezePixelsForDetail: PiezePixels
  piezePixelsForZoom(idx: ZoomModeIdx): PiezePixels
  canvasY(): number
}

const SCREEN_TYPES: ScreenDef[] = [
  {
    screenWidth: 800, screenHeight: 600,
    imageViewerMaxWidthLandscape: 400, imageViewerMaxWidthPortrait: 400, imageViewerMaxWidthMultiImage: 120,
    canvasX: 450, piezeViewerHeight: 400, piezeViewerWidth: 400, piezeViewerSide: 270,
    piezePixelsForDetail: '360',
    piezePixelsForZoom: (idx) => idx <= 3 ? '60' : '360',
    canvasY() { return Math.trunc(this.canvasX * MODEL_RATIO_X_Y) + 1 },
  },
  {
    screenWidth: 1024, screenHeight: 768,
    imageViewerMaxWidthLandscape: 500, imageViewerMaxWidthPortrait: 500, imageViewerMaxWidthMultiImage: 170,
    canvasX: 820, piezeViewerHeight: 550, piezeViewerWidth: 550, piezeViewerSide: 350,
    piezePixelsForDetail: '360',
    piezePixelsForZoom: (idx) => idx <= 2 ? '60' : '360',
    canvasY() { return Math.trunc(this.canvasX * MODEL_RATIO_X_Y) + 1 },
  },
  {
    screenWidth: 1280, screenHeight: 1024,
    imageViewerMaxWidthLandscape: 600, imageViewerMaxWidthPortrait: 600, imageViewerMaxWidthMultiImage: 200,
    canvasX: 1200, piezeViewerHeight: 720, piezeViewerWidth: 720, piezeViewerSide: 500,
    piezePixelsForDetail: '550',
    piezePixelsForZoom: (idx) => idx <= 1 ? '60' : '360',
    canvasY() { return Math.trunc(this.canvasX * MODEL_RATIO_X_Y) + 1 },
  },
  {
    screenWidth: 1920, screenHeight: 1080,
    imageViewerMaxWidthLandscape: 650, imageViewerMaxWidthPortrait: 650, imageViewerMaxWidthMultiImage: 220,
    canvasX: 1450, piezeViewerHeight: 740, piezeViewerWidth: 740, piezeViewerSide: 530,
    piezePixelsForDetail: '550',
    piezePixelsForZoom: (idx) => idx <= 1 ? '60' : idx <= 4 ? '360' : '550',
    canvasY() { return Math.trunc(this.canvasX * MODEL_RATIO_X_Y) + 1 },
  },
  {
    screenWidth: 1600, screenHeight: 1200,
    imageViewerMaxWidthLandscape: 650, imageViewerMaxWidthPortrait: 650, imageViewerMaxWidthMultiImage: 220,
    canvasX: 1500, piezeViewerHeight: 800, piezeViewerWidth: 800, piezeViewerSide: 530,
    piezePixelsForDetail: '550',
    piezePixelsForZoom: (idx) => idx <= 1 ? '60' : idx <= 4 ? '360' : '550',
    canvasY() { return Math.trunc(this.canvasX * MODEL_RATIO_X_Y) + 1 },
  },
]

function buildMobilePreset(viewportW: number): ScreenDef {
  const canvasX = Math.max(Math.min(viewportW - 16, 480), 280)
  const viewerSize = Math.min(canvasX - 20, 360)
  return {
    screenWidth: 0, screenHeight: 0,
    canvasX,
    imageViewerMaxWidthLandscape: viewerSize,
    imageViewerMaxWidthPortrait: viewerSize,
    imageViewerMaxWidthMultiImage: Math.trunc(viewerSize / 3),
    piezeViewerHeight: viewerSize, piezeViewerWidth: viewerSize,
    piezeViewerSide: Math.trunc(viewerSize * 0.7),
    piezePixelsForDetail: '360',
    piezePixelsForZoom: (idx) => idx <= 3 ? '60' : '360',
    canvasY() { return Math.trunc(this.canvasX * MODEL_RATIO_X_Y) + 1 },
  }
}

function computeScreenType(): ScreenDef {
  const w = window.innerWidth
  const h = window.innerHeight
  if (w < 600) return buildMobilePreset(w)
  // Orden: mayor → menor para encontrar el mejor ajuste
  const ordered = [SCREEN_TYPES[3], SCREEN_TYPES[4], SCREEN_TYPES[2], SCREEN_TYPES[1], SCREEN_TYPES[0]]
  return ordered.find(s => w >= s.screenWidth && h >= s.screenHeight) ?? SCREEN_TYPES[0]
}

let _current: ScreenDef | null = null

export function getCurrentScreenType(): ScreenDef {
  if (!_current) _current = computeScreenType()
  return _current
}

/** Recalcula el perfil desde el viewport actual. Devuelve true si el canvasX cambió. */
export function refreshScreenType(): boolean {
  const next = computeScreenType()
  if (_current && _current.canvasX === next.canvasX) return false
  _current = next
  return true
}
