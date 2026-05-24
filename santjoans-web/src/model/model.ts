import type { PiezePixels } from '../config/screenType.ts'
import type { PiezeClass, CacheEntry, ModelEntry, ViewerContext } from './types.ts'
import { getCurrentScreenType } from '../config/screenType.ts'
import { Cache } from './cache.ts'
import { getRadians } from '../engine/geometry.ts'

class ModelEntryImpl implements ModelEntry {
  readonly name: string
  readonly x: number
  readonly y: number
  readonly miniatureRotation: number
  readonly detailRotation: number
  readonly miniatureRadians: number
  readonly detailRadians: number
  private _cache: CacheEntry
  private piezeClass: PiezeClass

  constructor(name: string, x: number, y: number, minRot: number, detRot: number, cache: Cache, piezeClass: PiezeClass) {
    this.name = name
    this.x = x
    this.y = y
    this.miniatureRotation = minRot
    this.detailRotation = detRot
    this.miniatureRadians = getRadians(minRot)
    this.detailRadians = getRadians(detRot)
    this.piezeClass = piezeClass
    this._cache = cache.getCacheEntry(this)
  }

  getImageElement(pixels: PiezePixels): HTMLImageElement | null {
    return this._cache.getImageElement(pixels)
  }

  getCacheEntry(): CacheEntry {
    return this._cache
  }

  getImageDetailedUrl(): string {
    const detailPixels = getCurrentScreenType().piezePixelsForDetail
    return `./piezes/${detailPixels}/${this.piezeClass}/${this.name.toLowerCase()}`
  }
}

export abstract class Model {
  protected map = new Map<number, ModelEntry>()
  private cache: Cache
  private piezeClass: PiezeClass

  constructor(piezeClass: PiezeClass) {
    this.piezeClass = piezeClass
    this.cache = new Cache(piezeClass)
  }

  addPieze(name: string, x: number, y: number, miniatureRotation: number, detailRotation: number): void {
    const entry = new ModelEntryImpl(name, x, y, miniatureRotation, detailRotation, this.cache, this.piezeClass)
    this.map.set(x * 1000 + y, entry)
  }

  getPieze(x: number, y: number): ModelEntry | null {
    return this.map.get(x * 1000 + y) ?? null
  }

  getModelEntries(): ModelEntry[] {
    return Array.from(this.map.values())
  }

  getName(): string {
    return this.piezeClass
  }

  abstract queryByContext(entries: ModelEntry[], context: ViewerContext): ModelEntry[]
}
