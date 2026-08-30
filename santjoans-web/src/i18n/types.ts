export type Locale = 'es' | 'ca' | 'en' | 'zh'
export const LOCALES: Locale[] = ['es', 'ca', 'en', 'zh']
export const DEFAULT_LOCALE: Locale = 'es'
export const STORAGE_KEY = 'santjoans-locale'

/** Texto del botón del selector de idioma */
export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  ca: 'CA',
  en: 'EN',
  zh: '中文',
}

/** Valor del atributo `lang` del documento (BCP 47). El chino es simplificado. */
export const HTML_LANG: Record<Locale, string> = {
  es: 'es',
  ca: 'ca',
  en: 'en',
  zh: 'zh-Hans',
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value)
}
