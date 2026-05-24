import type { PiezePixels } from '../config/screenType.ts'
import type { CacheEntry, ModelEntry } from './types.ts'
import type { PiezeClass } from './types.ts'
import { getCurrentScreenType } from '../config/screenType.ts'

class CacheEntryImpl implements CacheEntry {
  readonly imageName: string
  private images = new Map<PiezePixels, HTMLImageElement>()
  private refs: ModelEntry[] = []
  private piezeClass: PiezeClass

  constructor(name: string, piezeClass: PiezeClass) {
    this.imageName = name.toLowerCase()
    this.piezeClass = piezeClass
  }

  getImageUrl(pixels: PiezePixels): string {
    return `./piezes/${pixels}/${this.piezeClass}/${this.imageName}`
  }

  getImageElement(pixels: PiezePixels): HTMLImageElement | null {
    return this.images.get(pixels) ?? null
  }

  setImageElement(pixels: PiezePixels, img: HTMLImageElement): void {
    this.images.set(pixels, img)
  }

  addReference(entry: ModelEntry): void {
    this.refs.push(entry)
  }

  getReferences(): ModelEntry[] {
    return this.refs
  }
}

export class Cache {
  private map = new Map<string, CacheEntryImpl>()
  private piezeClass: PiezeClass

  constructor(piezeClass: PiezeClass) {
    this.piezeClass = piezeClass
  }

  getCacheEntry(entry: ModelEntry): CacheEntry {
    const key = entry.name.toLowerCase()
    let ce = this.map.get(key)
    if (!ce) {
      ce = new CacheEntryImpl(entry.name, this.piezeClass)
      this.map.set(key, ce)
    }
    ce.addReference(entry)
    return ce
  }

  getDetailPixels(): PiezePixels {
    return getCurrentScreenType().piezePixelsForDetail
  }

  allEntries(): CacheEntry[] {
    return Array.from(this.map.values())
  }
}
