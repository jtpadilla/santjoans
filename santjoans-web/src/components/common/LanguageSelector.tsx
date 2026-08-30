import { useLocale } from '../../i18n/useLocale.ts'
import { HTML_LANG, LOCALES, LOCALE_LABELS } from '../../i18n/types.ts'

export function LanguageSelector() {
  const { locale, setLocale } = useLocale()
  return (
    <div className="lang-selector" role="group" aria-label="Language / Idioma / Idioma / 语言">
      {LOCALES.map(l => (
        <button
          key={l}
          className="lang-btn"
          lang={HTML_LANG[l]}
          aria-pressed={locale === l}
          onClick={() => setLocale(l)}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  )
}
