import { create } from 'zustand'
import type { Locale } from './types.ts'
import { DEFAULT_LOCALE, STORAGE_KEY } from './types.ts'

function readLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'ca' || stored === 'en') return stored
  } catch {
    // storage unavailable (e.g. Safari private mode)
  }
  return DEFAULT_LOCALE
}

interface LocaleState {
  locale: Locale
  setLocale: (l: Locale) => void
}

export const useLocaleStore = create<LocaleState>(set => ({
  locale: readLocale(),
  setLocale: (l) => {
    try { localStorage.setItem(STORAGE_KEY, l) } catch { /* ignore */ }
    document.documentElement.lang = l
    set({ locale: l })
  },
}))
