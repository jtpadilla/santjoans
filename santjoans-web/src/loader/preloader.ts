import { ZOOM_MODES } from '../config/zoomModes.ts'
import { mainModel, centerModel } from '../model/modelDirectory.ts'
import type { CacheEntry, ViewerContext } from '../model/types.ts'
import { loadImages } from './imageLoader.ts'
import type { ProgressCallback } from './syncPiezeLoader.ts'

const BATCH_SIZE = 2

export async function preloadInitialTiles(onProgress: ProgressCallback): Promise<void> {
  const zoomIdx = 0
  const mode = ZOOM_MODES[zoomIdx]
  const context: ViewerContext = {
    startX: 0, startY: 0,
    endX: mode.unitWidth, endY: mode.unitHeight,
    zoomIdx,
  }
  const pixels = mode.getPiezePixels()

  const seen = new Set<string>()
  const entries: CacheEntry[] = []
  for (const model of [mainModel, centerModel]) {
    for (const entry of model.queryByContext(model.getModelEntries(), context)) {
      const ce = entry.getCacheEntry()
      if (ce.getImageElement(pixels) !== null) continue
      if (seen.has(ce.imageName)) continue
      seen.add(ce.imageName)
      entries.push(ce)
    }
  }

  let remaining = entries.length
  onProgress(remaining)

  const signal = new AbortController().signal
  const batches: CacheEntry[][] = []
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    batches.push(entries.slice(i, i + BATCH_SIZE))
  }

  await Promise.all(batches.map(async batch => {
    const urls = batch.map(e => e.getImageUrl(pixels))
    const images = await loadImages(urls, signal)
    batch.forEach((e, i) => e.setImageElement(pixels, images[i]))
    remaining -= batch.length
    onProgress(remaining)
  }))
}
