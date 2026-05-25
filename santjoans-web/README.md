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

## Estructura

```
src/
  config/       constantes, modos de zoom, tipos de pantalla
  model/        modelo de datos (singletons, cache de imágenes)
  engine/       motor canvas: MosaicEngine, vistas, geometría, pointer
  loader/       carga asíncrona de imágenes y transacciones
  store/        mosaicStore.ts (Zustand)
  hooks/        useHashRoute.ts
  components/
    common/         PopupOverlay
    presentation/   Presentation (pantalla de bienvenida)
    navigator/      Navigator, Viewer, widgets de zoom/dirección/preview/popup

public/
  piezes/       catálogo JSON + tiles JPG (60/360/550px)
  presentation/ imágenes de la pantalla de bienvenida
  proyecto/     documento HTML «Información del proyecto» + PDFs
  ui/           iconos PNG de los botones
```

El plugin Vite convierte `../santjoans/src/santjoans/public/piezes/piezes.xml`
a `public/piezes/piezes.json` en cada arranque. Si el XML no está disponible,
el JSON ya está en `public/piezes/piezes.json` y el build funciona igualmente.

## Deploy

El build genera un sitio completamente estático en `dist/`. Subir su contenido
a la raíz del dominio. No requiere servidor de aplicaciones.

Documentación completa de la arquitectura y decisiones técnicas en `memory/`.
