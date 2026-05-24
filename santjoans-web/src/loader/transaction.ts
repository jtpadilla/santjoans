import type { CacheEntry, ModelEntry, ViewerContext } from '../model/types.ts'
import type { IView } from '../engine/views/IView.ts'
import type { Model } from '../model/model.ts'
import { ZOOM_MODES } from '../config/zoomModes.ts'

const PIEZES_BY_TRANSACTION = 2

export interface Transaction {
  urls(): string[]
  piezeCount(): number
  commit(images: HTMLImageElement[]): void
}

class TransactionImpl implements Transaction {
  private entries: CacheEntry[]
  private view: IView
  private context: ViewerContext

  constructor(entries: CacheEntry[], view: IView, context: ViewerContext) {
    this.entries = entries
    this.view = view
    this.context = context
  }

  urls(): string[] {
    const pixels = ZOOM_MODES[this.context.zoomIdx].getPiezePixels()
    return this.entries.map(e => e.getImageUrl(pixels))
  }

  piezeCount(): number {
    return this.entries.length
  }

  commit(images: HTMLImageElement[]): void {
    const pixels = ZOOM_MODES[this.context.zoomIdx].getPiezePixels()
    this.entries.forEach((e, i) => e.setImageElement(pixels, images[i]))
    // Redibujar las piezas que ahora tienen imagen y están en el viewport
    const allRefs: ModelEntry[] = this.entries.flatMap(e => e.getReferences())
    const inViewport = this.view.getModel().queryByContext(allRefs, this.context)
    for (const entry of inViewport) {
      this.view.drawPieze(pixels, this.context.startX, this.context.startY, entry)
    }
  }
}

export function buildTransactionList(view: IView, context: ViewerContext): Transaction[] {
  return buildAll(view, context)
}

function buildAll(view: IView, context: ViewerContext): Transaction[] {
  const model: Model = view.getModel()
  const pixels = ZOOM_MODES[context.zoomIdx].getPiezePixels()
  const entries = model.queryByContext(model.getModelEntries(), context)
  const alreadySeen = new Set<string>()
  const transactions: Transaction[] = []
  let batch: CacheEntry[] = []

  for (const entry of entries) {
    const ce = entry.getCacheEntry()
    if (ce.getImageElement(pixels) !== null) continue
    if (alreadySeen.has(ce.imageName)) continue
    alreadySeen.add(ce.imageName)
    batch.push(ce)
    if (batch.length >= PIEZES_BY_TRANSACTION) {
      transactions.push(new TransactionImpl(batch, view, context))
      batch = []
    }
  }
  if (batch.length > 0) transactions.push(new TransactionImpl(batch, view, context))
  return transactions
}
