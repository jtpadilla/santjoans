import type { Transaction } from './transaction.ts'
import { loadImages } from './imageLoader.ts'

export type ProgressCallback = (remaining: number) => void

export async function loadAllSync(transactions: Transaction[], onProgress: ProgressCallback): Promise<void> {
  let remaining = transactions.reduce((sum, t) => sum + t.piezeCount(), 0)
  onProgress(remaining)
  const signal = new AbortController().signal  // no cancelación en carga inicial
  await Promise.all(
    transactions.map(async txn => {
      const images = await loadImages(txn.urls(), signal)
      txn.commit(images)
      remaining -= txn.piezeCount()
      onProgress(remaining)
    })
  )
}
