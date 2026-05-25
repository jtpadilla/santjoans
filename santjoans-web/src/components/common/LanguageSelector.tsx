import { useLocale } from '../../i18n/useLocale.ts'
import { LOCALES } from '../../i18n/types.ts'

export function LanguageSelector() {
  const { locale, setLocale } = useLocale()
  return (
    <div className="lang-selector" role="group" aria-label="Language / Idioma / Idioma">
      {LOCALES.map(l => (
        <button
          key={l}
          className="lang-btn"
          aria-pressed={locale === l}
          onClick={() => setLocale(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
