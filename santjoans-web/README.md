# santjoans-web

Aplicación React del visor interactivo del tapiz de azulejos del Palacio Santjoans.
Es la reescritura (2026) de la aplicación original en GWT (2011).
Sitio web: [www.santjoans.es](http://www.santjoans.es)

## Stack

| Paquete | Versión | Para qué |
|---|---|---|
| react, react-dom | ^19 | UI |
| typescript | ~6.0 | Tipado |
| vite + @vitejs/plugin-react | ^8 | Build y dev server |
| zustand | ^5 | Estado global de UI |
| fast-xml-parser | ^5 | Conversión piezes.xml→JSON en build |
| vitest | ^4 | Tests unitarios |

## Comandos

```bash
npm install        # primera vez
npm run dev        # servidor de desarrollo → http://localhost:5173
npm run build      # build de producción → dist/
npm run preview    # sirve dist/ → http://localhost:4173
npm test           # 21 tests unitarios de geometría
```

## Funcionalidades

### Visor del mosaico
- Renderizado Canvas 2D en coordenadas mm (fidelidad al original GWT)
- 6 niveles de zoom (100%–1600%) con carga progresiva de tiles
- Pan: arrastrar con ratón o con un dedo en táctil
- Pinch-to-zoom con dos dedos (mapea a los 6 niveles discretos)
- Tap simple sobre pieza (táctil) o doble clic (ratón) abre popup de detalle
- Botones de dirección N/S/E/O, zoom +/-, Home (vuelve a 100% posición 0,0)
- Minimapa interactivo (drag para mover el viewport)

### Responsive Web Design
- Layout fluido: `max-width: 700px`, sin scroll horizontal en móvil
- Canvas redimensiona al viewport y reacciona a resize/orientationchange
- Preset «mobile» para viewport <600px (canvas dinámico viewport – 16px)
- Barra de control con flex-wrap (fluye a segunda fila en pantallas estrechas)
- Botones ≥44px de área táctil (iOS HIG / Material Design)
- Media queries en 600px y 400px

### Diseño visual
- Paleta «Patrimonio mediterráneo»: crema/cobalto/ocre
- Tipografía: Cormorant Garamond (títulos) + Inter (cuerpo), vía Google Fonts
- Iconos SVG inline en stroke cobalto (sin assets externos)
- Sistema de tokens CSS (`--color-*`, `--font-*`, `--sp-*`, `--radius-*`, `--shadow-*`)

## Estructura

```
src/
  config/       constantes, modos de zoom, tipos de pantalla (responsive)
  model/        modelo de datos (singletons, cache de imágenes)
  engine/       motor canvas: MosaicEngine, vistas, geometría, pointer (touch+mouse)
  loader/       carga asíncrona de imágenes y transacciones
  store/        mosaicStore.ts (Zustand)
  hooks/        useHashRoute.ts
  components/
    common/         PopupOverlay
    presentation/   Presentation (pantalla de bienvenida)
    navigator/      Navigator, Viewer, widgets de zoom/dirección/preview/popup
                    IconButton, icons.tsx (SVGs inline)

public/
  piezes/       catálogo JSON + tiles JPG (60/360/550px)
  presentation/ imágenes de la pantalla de bienvenida
  proyecto/     documento HTML «Información del proyecto» + PDFs
  miniatura.png imagen del minimapa (PreviewWidget)
  favicon.svg
```

El plugin Vite convierte `../santjoans/src/santjoans/public/piezes/piezes.xml`
a `public/piezes/piezes.json` en cada arranque. Si el XML no está disponible,
el JSON ya está en `public/piezes/piezes.json` y el build funciona igualmente.

## Deploy

El build genera un sitio completamente estático en `dist/`. Subir su contenido
a la raíz del dominio. No requiere servidor de aplicaciones.

Documentación completa de la arquitectura y decisiones técnicas en `memory/`.
