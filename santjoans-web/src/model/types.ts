import type { PiezePixels } from '../config/screenType.ts'

export type PiezeClass = 'main' | 'center'

export interface PiezeData {
  readonly name: string
  readonly x: number
  readonly y: number
  readonly miniature_rotation: number
  readonly detail_rotation: number
  readonly class: PiezeClass
}

export interface CacheEntry {
  readonly imageName: string
  getImageUrl(pixels: PiezePixels): string
  getImageElement(pixels: PiezePixels): HTMLImageElement | null
  setImageElement(pixels: PiezePixels, img: HTMLImageElement): void
  addReference(entry: ModelEntry): void
  getReferences(): ModelEntry[]
}

export interface ModelEntry {
  readonly name: string
  readonly x: number
  readonly y: number
  readonly miniatureRotation: number
  readonly detailRotation: number
  readonly miniatureRadians: number
  readonly detailRadians: number
  getImageElement(pixels: PiezePixels): HTMLImageElement | null
  getCacheEntry(): CacheEntry
  getImageDetailedUrl(): string
}

export interface ViewerContext {
  readonly startX: number
  readonly startY: number
  readonly endX: number
  readonly endY: number
  readonly zoomIdx: number
}
