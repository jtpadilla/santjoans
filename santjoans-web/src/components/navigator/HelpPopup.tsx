import { PopupOverlay } from '../common/PopupOverlay.tsx'
import { useLocale } from '../../i18n/useLocale.ts'

interface Props {
  onClose: () => void
}

export function HelpPopup({ onClose }: Props) {
  const { m } = useLocale()
  return (
    <PopupOverlay onClose={onClose}>
      <div className="help-popup">
        <h2>{m.helpTitle}</h2>
        <ul>
          <li>{m.helpItem1}</li>
          <li>{m.helpItem2}</li>
          <li>{m.helpItem3}</li>
          <li>{m.helpItem4}</li>
          <li>{m.helpItem5}</li>
        </ul>
        <button onClick={onClose}>{m.helpClose}</button>
      </div>
    </PopupOverlay>
  )
}
