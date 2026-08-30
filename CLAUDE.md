# CLAUDE.md — Proyecto santjoans

Este fichero es el punto de entrada para Claude Code en cualquier sesión y en cualquier
máquina. Lee este fichero completo antes de hacer nada.

---

## Qué es este proyecto

Reescritura completa de la aplicación **santjoans** (visor interactivo del tapiz de
azulejos del Palacio Santjoans, [santjoans.es](http://www.santjoans.es)) de GWT 2011
a **React + TypeScript + Vite**.

El repositorio tiene dos carpetas hermanas:

```
santjoans/      ← aplicación ORIGINAL en GWT (Java). No tocar. Es la referencia.
santjoans-web/  ← aplicación NUEVA en React/TS/Vite. Aquí se trabaja.
```

---

## Antes de cualquier otra cosa: leer la memoria del proyecto

Todo el contexto de sesiones anteriores está documentado en:

```
santjoans-web/memory/
  README.md        ← índice rápido y comandos
  progress.md      ← LEER PRIMERO: estado actual, issues pendientes, próximos pasos
  plan.md          ← plan completo con fases y checklist de verificación
  architecture.md  ← qué hace cada módulo, árbol de dependencias, flujos de datos
  decisions.md     ← por qué se tomó cada decisión técnica no obvia
```

**Protocolo al inicio de sesión:**
1. Leer `santjoans-web/memory/progress.md` — saber en qué fase estamos y qué issues hay
2. Leer la sección correspondiente de `plan.md` para la fase pendiente
3. Ejecutar `npm test` y `npm run build` para confirmar que el estado es limpio
4. Continuar desde donde se dejó

**Protocolo al final de sesión (o al terminar una fase):**
1. Actualizar `santjoans-web/memory/progress.md` con lo que se hizo y lo que queda
2. Si se resolvió un issue conocido, eliminarlo de la lista
3. Si apareció un issue nuevo, añadirlo con su solución prevista
4. Actualizar la fecha de "Última actualización"

---

## Entorno de desarrollo

### Node.js (necesario en cada máquina nueva)

```bash
# Instalar nvm si no está disponible
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # o ~/.zshrc según el shell

# Instalar Node LTS
nvm install --lts
nvm use --lts
```

### Primera vez en una máquina nueva

```bash
cd santjoans-web
npm install        # instala todas las dependencias de package.json
npm test           # debe pasar 21 tests
npm run build      # debe completar sin errores en ~200ms
```

### Comandos del día a día

```bash
cd santjoans-web

npm test           # tests unitarios de geometría (21 tests, <1s)
npm run build      # build de producción completo
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run preview    # sirve el dist/ en http://localhost:4173
```

### Lo que hace el build automáticamente

El plugin Vite convierte `../santjoans/src/santjoans/public/piezes/piezes.xml`
a `public/piezes/piezes.json` (754 piezas) en cada arranque de dev o build.
Si el XML no está disponible (máquina sin el legacy), el fichero JSON ya está
en `public/piezes/piezes.json` y el build funciona igualmente.

---

## Stack y dependencias clave

| Paquete | Versión | Para qué |
|---|---|---|
| react, react-dom | ^19 | UI |
| typescript | ~6.0 | Tipado |
| vite + @vitejs/plugin-react | ^8 | Build y dev server |
| zustand | ^5 | Estado global de UI (zoom, posición, canMove*) |
| fast-xml-parser | ^5 | Conversión piezes.xml→JSON en build |
| vitest | ^4 | Tests unitarios |

---

## Estructura del código fuente

```
santjoans-web/src/
  config/           constantes, modos de zoom, tipos de pantalla, strings
  model/            modelo de datos (singletons, cache de imágenes, loader)
  engine/           motor canvas: MosaicEngine, MainView, CenterView, geometry, pointer
  loader/           carga asíncrona: imageLoader, transaction, taskScheduler, syncPiezeLoader
  store/            mosaicStore.ts (Zustand)
  hooks/            useHashRoute.ts
  i18n/             types.ts (Locale es|ca|en|zh), store.ts, messages.ts,
                    presentationContent/{es,ca,en,zh}.tsx
  components/
    common/         PopupOverlay, LanguageSelector
    presentation/   Presentation (pantalla de bienvenida)
    navigator/      Navigator, Viewer, DirectionWidget, ZoomWidget,
                    PreviewWidget, PiezePopup, HelpPopup,
                    IconButton, icons.tsx (SVGs inline)
  App.tsx           routing hash → Presentation | Navigator
  main.tsx          entry point
  index.css         estilos globales con tokens CSS y media queries
```

Ver `memory/architecture.md` para el árbol de dependencias completo y la
responsabilidad detallada de cada módulo.

---

## Assets públicos

```
santjoans-web/public/
  piezes/
    piezes.json               generado por el plugin Vite (no editar a mano)
    60/{main,center}/*.jpg    364+70 tiles a 60px
    360/{main,center}/*.jpg   364+70 tiles a 360px
    550/{main,center}/*.jpg   364+70 tiles a 550px
  presentation/*.png/jpg     17 imágenes de la pantalla de bienvenida
  proyecto/
    proyecto.{es,ca,en,zh}.html  documento «Información del proyecto» por idioma (enlazado desde Presentation.tsx)
    proyecto.html             redirección legacy → proyecto.es.html
    proyecto.css              estilos del documento (misma paleta que la app)
    thumbnailviewer.*         visor de thumbnails (Dynamic Drive, 2011)
    *.jpg                     4 fotos de los participantes
    *.pdf                     7 documentos PDF (estudio, diagramas, presentaciones)
  miniatura.png              imagen del minimapa (PreviewWidget)
  favicon.svg
```

Nota: no hay carpeta `ui/` (los iconos PNG fueron sustituidos por SVG inline en `icons.tsx`).
`bkg.png` y `grano.png` fueron eliminados (la app usa `background-color` con token CSS).

---

## Código de referencia (legacy GWT)

Cuando haya dudas sobre el comportamiento original, consultar en:

```
santjoans/src/santjoans/client/
  piezes/view/MainView.java           ← algoritmo de dibujo canvas y hit-testing
  piezes/view/CenterView.java         ← idem para zona central
  piezes/navigator/viewer/
    ControllerViewer.java             ← orquestación zoom/pan/listeners
    ViewerWidgetControl.java          ← drag con ratón y dblclick
    piezepopup/PiezePopup.java        ← popup de detalle de pieza
  piezes/navigator/preview/
    PreviewWidgetContext.java         ← fórmulas del minimapa
  transaction/
    TransactionFactory.java           ← construcción de transacciones
    async/TaskChain.java              ← cadena de tareas (portada a AbortController)
  util/
    Util.java                         ← conversiones px↔mm↔coord (portadas a geometry.ts)
    ZoomModeEnum.java                 ← tabla de 6 niveles de zoom
    ScreenTypeEnum.java               ← resolución de canvas por tamaño de pantalla
    IConfiguration.java              ← constantes (portadas a config/constants.ts)
  model/
    Model.java, Cache.java            ← estructura de datos
```

---

## Decisiones que NO se deben revertir

Están documentadas con detalle en `memory/decisions.md`. Resumen:

- **Sin react-router** — hook hash propio de 15 líneas es suficiente para 2 rutas
- **Sin DOMParser XML en runtime** — el XML se convierte a JSON en build
- **Canvas transform con `ctx.setTransform`** — replica `GWTCanvas.setCoordSize`, no cambiar
- **`Math.trunc(a/b)` para divisiones enteras** — replica el cast `(int)` de Java, crítico para hit-testing
- **Cache de imágenes indexada por nombre** — varias piezas comparten el mismo JPG
- **AbortController** para cancelar cargas — no volver a la arquitectura TaskChain
- **Modelo fuera de Zustand** — los singletons son read-only tras boot, meterlos en Zustand causaría re-renders innecesarios
- **Sin detección de browser** — la del original era defectuosa (excluía Chrome)
- **`touch-action: none`** en canvas principal y minimapa — no `manipulation`; permite interceptar todos los gestos táctiles
- **Pinch-to-zoom discreta** — 6 niveles discretos (no zoom continuo); el pinch hace snap al nivel más cercano
- **`window.innerWidth` para screenType** — no `window.screen`; el preset se recalcula en resize/orientationchange
- **SVG inline para iconos** — no assets PNG externos; heredan color del tema vía `currentColor`

---

## Cómo actualizar este fichero

Actualizar `CLAUDE.md` cuando:
- Cambie la estructura de carpetas significativamente
- Se añadan nuevas dependencias importantes
- Se resuelvan las fases pendientes (actualizar la sección de estado)
- Cambie el entorno mínimo requerido (Node, npm, etc.)

No duplicar contenido de `memory/` — este fichero apunta a esos ficheros.
El detalle vive en `memory/`, el resumen de orientación vive aquí.
