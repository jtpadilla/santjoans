import { useState } from 'react'
import { PopupOverlay } from '../common/PopupOverlay.tsx'
import { LanguageSelector } from '../common/LanguageSelector.tsx'
import { useLocale } from '../../i18n/useLocale.ts'
import { getPresentationContent } from '../../i18n/presentationContent/index.ts'

type ImageMode = 'landscape' | 'portrait' | 'four' | null

interface PopupState {
  mode: ImageMode
  src?: string
  srcs?: string[]
}

interface Props {
  loadingRemaining: number
  onEnterNavigator: () => void
}

export function Presentation({ loadingRemaining, onEnterNavigator }: Props) {
  const [popup, setPopup] = useState<PopupState>({ mode: null })
  const { locale, m } = useLocale()

  const showLandscape = (src: string) => setPopup({ mode: 'landscape', src })
  const showPortrait = (src: string) => setPopup({ mode: 'portrait', src })
  const showFour = (srcs: string[]) => setPopup({ mode: 'four', srcs })
  const closePopup = () => setPopup({ mode: null })

  return (
    <div className="page-box">
      <div className="presentation-header">
        <h1 className="page-title">{m.appTitle}</h1>
        <LanguageSelector />
      </div>

      <div className="presentation-access">
        {loadingRemaining < 0 ? (
          <span className="presentation-loading">{m.loading}</span>
        ) : loadingRemaining > 0 ? (
          <span className="presentation-loading">{m.loadingWithCount(loadingRemaining)}</span>
        ) : (
          <button className="ver-mural-btn" onClick={onEnterNavigator}>{m.enterMural}</button>
        )}
      </div>

      {getPresentationContent(locale, { showLandscape, showPortrait, showFour })}

      <div className="presentation-footer-links">
        <a href={`./proyecto/proyecto.${locale}.html`} target="_blank" rel="noreferrer" className="presentation-info-link">
          {m.infoProject}
        </a>
      </div>

      {popup.mode === 'landscape' && popup.src && (
        <PopupOverlay onClose={closePopup}>
          <img src={popup.src} alt="" style={{ maxWidth: '80vw', maxHeight: '80vh' }} />
        </PopupOverlay>
      )}
      {popup.mode === 'portrait' && popup.src && (
        <PopupOverlay onClose={closePopup}>
          <img src={popup.src} alt="" style={{ maxWidth: '50vw', maxHeight: '85vh' }} />
        </PopupOverlay>
      )}
      {popup.mode === 'four' && popup.srcs && (
        <PopupOverlay onClose={closePopup}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {popup.srcs.map((s, i) => (
              <img key={i} src={s} alt="" style={{ maxWidth: '20vw', maxHeight: '70vh' }} />
            ))}
          </div>
        </PopupOverlay>
      )}
    </div>
  )
}
