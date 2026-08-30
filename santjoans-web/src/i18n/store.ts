import { create } from 'zustand'
import type { Locale } from './types.ts'
import { DEFAULT_LOCALE, HTML_LANG, STORAGE_KEY, isLocale } from './types.ts'

function readLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // storage unavailable (e.g. Safari private mode)
  }
  return DEFAULT_LOCALE
}

function applyHtmlLang(l: Locale) {
  document.documentElement.lang = HTML_LANG[l]
}

interface LocaleState {
  locale: Locale
  setLocale: (l: Locale) => void
}

const initialLocale = readLocale()
applyHtmlLang(initialLocale)

export const useLocaleStore = create<LocaleState>(set => ({
  locale: initialLocale,
  setLocale: (l) => {
    try { localStorage.setItem(STORAGE_KEY, l) } catch { /* ignore */ }
    applyHtmlLang(l)
    set({ locale: l })
  },
}))
