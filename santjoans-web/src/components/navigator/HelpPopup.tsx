import { PopupOverlay } from '../common/PopupOverlay.tsx'

interface Props {
  onClose: () => void
}

export function HelpPopup({ onClose }: Props) {
  return (
    <PopupOverlay onClose={onClose}>
      <div className="help-popup">
        <h2>Ayuda de navegación</h2>
        <ul>
          <li>Usa los botones direccionales para mover el mosaico.</li>
          <li>Usa los botones de zoom (+/-) para ampliar o reducir.</li>
          <li>Arrastra el mosaico con el ratón para moverse.</li>
          <li>Doble click en una pieza para ver el detalle.</li>
          <li>Arrastra el rectángulo del minimapa para cambiar la posición.</li>
        </ul>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </PopupOverlay>
  )
}
