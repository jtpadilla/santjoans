import { useState } from 'react'
import { PopupOverlay } from '../common/PopupOverlay.tsx'

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

  const showLandscape = (src: string) => setPopup({ mode: 'landscape', src })
  const showPortrait = (src: string) => setPopup({ mode: 'portrait', src })
  const showFour = (srcs: string[]) => setPopup({ mode: 'four', srcs })
  const closePopup = () => setPopup({ mode: null })

  return (
    <div className="presentation-root">
      <div className="presentation-header">
        <span
          className="presentation-link"
          onClick={() => showFour([
            './presentation/escudo1_long.png',
            './presentation/escudo2_long.png',
            './presentation/escudo3_long.png',
            './presentation/escudo4_long.png',
          ])}
        >
          <img src="./presentation/escudo0_long.png" alt="escudos" className="presentation-escudo-techo" />
        </span>
        <span className="presentation-link" onClick={() => showPortrait('./presentation/indio.png')}>
          <img src="./presentation/indio.png" alt="indio" className="presentation-indio" />
        </span>
      </div>

      <div className="presentation-images">
        <img
          src="./presentation/palacio_small.png"
          alt="Palacio"
          className="presentation-thumb"
          onClick={() => showLandscape('./presentation/palacio_long.png')}
        />
        <img
          src="./presentation/piezas_small.png"
          alt="Piezas"
          className="presentation-thumb"
          onClick={() => showPortrait('./presentation/piezas_long.png')}
        />
        <img
          src="./presentation/museo_small.png"
          alt="Museo"
          className="presentation-thumb"
          onClick={() => showLandscape('./presentation/museo_long.png')}
        />
      </div>

      <div className="presentation-footer">
        {loadingRemaining > 0 ? (
          <span className="presentation-loading">
            Quedan {loadingRemaining} piezas por cargar.
          </span>
        ) : (
          <button className="ver-mural-btn" onClick={onEnterNavigator}>
            Ver pavimento
          </button>
        )}
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
