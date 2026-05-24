import type { Transaction } from './transaction.ts'
import { loadImages } from './imageLoader.ts'

let currentAbort: AbortController | null = null

export function runTransactions(transactions: Transaction[]): void {
  currentAbort?.abort()
  if (transactions.length === 0) return
  const ac = new AbortController()
  currentAbort = ac
  executeSequentially(transactions, ac.signal).catch(e => {
    if (e?.name !== 'AbortError') console.error(e)
  })
}

async function executeSequentially(transactions: Transaction[], signal: AbortSignal): Promise<void> {
  for (const txn of transactions) {
    if (signal.aborted) return
    const images = await loadImages(txn.urls(), signal)
    if (signal.aborted) return
    txn.commit(images)
  }
}
