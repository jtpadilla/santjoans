import { useLocaleStore } from './store.ts'
import { messages } from './messages.ts'

export function useLocale() {
  const locale = useLocaleStore(s => s.locale)
  const setLocale = useLocaleStore(s => s.setLocale)
  const m = messages[locale]
  return { locale, setLocale, m }
}
