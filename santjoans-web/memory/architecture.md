# Arquitectura del proyecto santjoans-web

## Árbol de dependencias (de más bajo a más alto nivel)

```
config/constants.ts          ← sin dependencias
config/screenType.ts         ← constants, zoomModes (ZoomModeIdx)
config/zoomModes.ts          ← constants, screenType (PiezePixels)
config/strings.ts            ← sin dependencias

model/types.ts               ← config/screenType (PiezePixels)
model/cache.ts               ← config/screenType, model/types
model/model.ts               ← config/screenType, model/types, model/cache, engine/geometry (getRadians)
model/mainModel.ts           ← model/model, model/types, config/zoomModes
model/centerModel.ts         ← model/model, model/types, config/zoomModes
model/modelDirectory.ts      ← model/mainModel, model/centerModel
model/modelLoader.ts         ← model/types, model/modelDirectory

engine/geometry.ts           ← config/constants, config/zoomModes, config/screenType
engine/geometry.test.ts      ← engine/geometry
engine/views/IView.ts        ← config/screenType, config/zoomModes, model/types, model/model
engine/views/MainView.ts     ← IView, config/(constants,screenType,zoomModes), model/(directory,types,model), engine/geometry
engine/views/CenterView.ts   ← IView, config/(constants,screenType,zoomModes), model/(directory,types,model), engine/geometry
engine/pointer.ts            ← engine/MosaicEngine (solo el tipo)
engine/MosaicEngine.ts       ← config/(zoomModes,screenType,constants), engine/views/*, loader/*, store/mosaicStore

loader/imageLoader.ts        ← sin dependencias de proyecto
loader/transaction.ts        ← model/types, engine/views/IView, model/model, config/zoomModes
loader/taskScheduler.ts      ← loader/transaction, loader/imageLoader
loader/syncPiezeLoader.ts    ← loader/transaction, loader/imageLoader

store/mosaicStore.ts         ← config/zoomModes (ZoomModeIdx)

hooks/useHashRoute.ts        ← sin dependencias de proyecto

components/common/PopupOverlay.tsx       ← React
components/navigator/ImageButton.tsx     ← React
components/navigator/PiezePopup.tsx      ← config/screenType, model/types, loader/imageLoader, PopupOverlay
components/navigator/PreviewWidget.tsx   ← config/(zoomModes,constants), engine/MosaicEngine, React
components/navigator/DirectionWidget.tsx ← engine/MosaicEngine, ImageButton
components/navigator/ZoomWidget.tsx      ← config/zoomModes, engine/MosaicEngine, ImageButton
components/navigator/HelpPopup.tsx       ← PopupOverlay
components/navigator/Viewer.tsx          ← engine/MosaicEngine, engine/pointer, config/screenType, store/mosaicStore, PiezePopup
components/navigator/Navigator.tsx       ← Viewer, DirectionWidget, ZoomWidget, PreviewWidget, ImageButton, HelpPopup, store/mosaicStore
components/presentation/Presentation.tsx ← PopupOverlay
App.tsx                                  ← hooks/useHashRoute, Presentation, Navigator, model/modelLoader, store/mosaicStore
main.tsx                                 ← App
```

## Responsabilidad de cada módulo

### `config/`

- **constants.ts** — Todas las constantes numéricas de `IConfiguration.java`: tamaños de piezas en mm, límites del modelo, coordenadas de la zona central
- **zoomModes.ts** — Tabla de los 6 modos de zoom (100%–1600%). Cada entrada tiene `unitWidth`, `unitHeight`, `steepX/Y` (paso de pan), `millimetersWidth/Height` y `getPiezePixels()`. Helpers `zoomIn/zoomOut` navegan por índice 0..5
- **screenType.ts** — 5 configuraciones de pantalla (SVGA/XGA/SXGA/FULLHD/UXGA). `getCurrentScreenType()` es un singleton lazy que lee `window.screen.width/height`. Devuelve tamaños de canvas, viewer y resolución de tile por nivel de zoom
- **strings.ts** — 4 strings de error/UI en español

### `model/`

- **types.ts** — Interfaces puras: `PiezeData` (formato del JSON), `CacheEntry`, `ModelEntry`, `ViewerContext`. Sin implementación
- **cache.ts** — `Cache`: Map<imageName, CacheEntryImpl>. **Indexada por nombre**, no por coordenada — varias piezas pueden compartir el mismo JPG (ej: marmol1.jpg aparece con distintas rotaciones). `getCacheEntry()` devuelve la entrada existente o crea una nueva, añadiendo la referencia
- **model.ts** — `Model` abstracta: Map<número_coord, ModelEntry>. La coordenada se codifica como `x * 1000 + y`. `addPieze()` crea un `ModelEntryImpl` que se auto-enlaza a la cache. `queryByContext()` es abstracto (main y center tienen lógicas distintas)
- **mainModel.ts** — `MainModel`: `queryByContext` filtra por `startX ≤ x ≤ endX` y `startY ≤ y ≤ endY`
- **centerModel.ts** — `CenterModel`: `queryByContext` usa tablas `INVALID_START/END_X/Y` (porte literal de CenterModel.java — la zona central tiene forma romboidal)
- **modelDirectory.ts** — Exporta los dos singletons `mainModel` y `centerModel`. Importado por las Views y el loader
- **modelLoader.ts** — `loadModels()`: fetch async de `./piezes/piezes.json`, itera y llama `mainModel.addPieze()` o `centerModel.addPieze()` según el campo `class`

### `engine/`

- **geometry.ts** — Porte de `Util.java`. Funciones matemáticas puras:
  - `getRadians(degrees)` — conversión grados → radianes
  - `isEven/isOdd` — paridad
  - `isValidMainCoord(x,y)` — coordenada válida del mosaico main (par+impar, fuera de zona central)
  - `isIntoCenterCoord(x,y)` — está dentro de la zona central
  - `mainXtoCenterX/Y` — convierte coord main → coord center
  - `pixelToMillimeterX/Y(zoomIdx, pixel)` — px del canvas → mm
  - `millimeterToCoordX/Y(mm)` — mm → coord de cuadrante (con `Math.trunc`, crítico)
  - `millimeterToCoordXRest/YRest(mm)` — resto para hit-testing

- **views/MainView.ts** — Dibuja en el canvas la zona principal del mosaico:
  - `updateFromModel`: itera coords (startX..stopX) × (startY..stopY), llama `drawPieze` o `drawEmptyPieze`
  - `drawPieze`: save → translate(x·halfDiag, y·halfDiag) → rotate(miniatureRadians) → drawImage → restore
  - `drawEmptyPieze`: mismo transform pero fillRect gris #A29481 rotado 45°
  - `getPickedPieze`: hit-testing del click — convierte píxel → mm → coord, determina la pieza mediante paridad y línea separadora a 45°

- **views/CenterView.ts** — Igual que MainView pero para la zona central (sin hit-testing de tiles, usa tablas drawn[][] para no redibujar)

- **MosaicEngine.ts** — La clase más importante. Propietaria del `CanvasRenderingContext2D`. Métodos públicos:
  - `firstLoad(onProgress)` — carga inicial síncrona (parallel promises)
  - `setZoom(idx)` — cambia nivel de zoom, ajusta posición, aplica transform, carga tiles
  - `zoomInAction/zoomOutAction` — wrappers
  - `setPosition(x,y)`, `moveLeft/Right/Up/Down` — pan discreto
  - `onPointerDown/Move/Up(x,y)` — drag continuo (llamados desde pointer.ts)
  - `onDoubleClick(x,y)` — busca pieza bajo el click y llama `onPiezePopup`
  - `canMoveLeft/Right/Up/Down`, `canZoomIn/Out` — queries para deshabilitar botones
  - `notifyStore()` — actualiza Zustand para re-renderizar controles
  - `applyCanvasTransform()` — `ctx.setTransform(canvasX/mmW, 0, 0, canvasY/mmH, 0, 0)` — el equivalente de `GWTCanvas.setCoordSize`

- **pointer.ts** — `attachPointerHandlers(canvas, engine)`: conecta `pointerdown/move/up/leave + dblclick` al canvas y delega en el engine. Devuelve función de limpieza. Usa `setPointerCapture` para capturar el movimiento aunque el puntero salga del canvas

### `loader/`

- **imageLoader.ts** — `loadImages(urls, signal): Promise<HTMLImageElement[]>`. Cache global `Map<url, HTMLImageElement>`. Cada imagen se carga con `new Image()`, con manejo de abort signal
- **transaction.ts** — `buildTransactionList(view, context)`: agrupa las CacheEntries que necesitan imagen en lotes de 2 (`PIEZES_BY_TRANSACTION`). `TransactionImpl.commit(images)` guarda las imágenes en la cache y redibuja solo las piezas afectadas en el viewport
- **taskScheduler.ts** — `runTransactions(txns)`: cancela cualquier carga en curso con AbortController, lanza la nueva secuencialmente. Si se cancela, las imágenes que ya llegaron se conservan en la cache
- **syncPiezeLoader.ts** — `loadAllSync(txns, onProgress)`: lanza todas las transacciones en paralelo (Promise.all), llama `onProgress(remaining)` tras cada commit

### `store/`

- **mosaicStore.ts** — Zustand store plano con `update(patch)` y `setLoading(n)`. Solo contiene lo que los controles necesitan para re-renderizarse: zoom, posición, flags de movimiento, progreso de carga. El modelo y el canvas son puramente imperativos fuera de React

### `hooks/`

- **useHashRoute.ts** — `useHashRoute(): Route` suscribe al evento `hashchange`. `navigateTo(route)` actualiza `window.location.hash`

### `components/`

- **PopupOverlay.tsx** — Modal: fondo semitransparente que cierra al hacer click fuera o pulsar Escape. Contenido centrado en pantalla
- **Presentation.tsx** — Pantalla de bienvenida. 3 thumbnails (palacio/piezas/museo), escudos e indio en la cabecera. Popup de imágenes al hacer click. Contador de carga + botón "Ver pavimento"
- **Viewer.tsx** — Monta el canvas con las dimensiones de `getCurrentScreenType()`. En `useEffect`: crea `MosaicEngine`, llama `attachPointerHandlers`, llama `firstLoad`. Muestra `PiezePopup` cuando el engine lo pide
- **Navigator.tsx** — Layout: Viewer (izquierda) + panel de controles (derecha: preview, dirección, zoom, help). Lee el store de Zustand para pasar props a los controles. El engine se pasa por ref
- **PreviewWidget.tsx** — Canvas de 200×97px con `miniatura.png` + rect rojo del viewport. El rect se calcula en mm proyectados al espacio del preview. Drag para mover el viewport
- **PiezePopup.tsx** — Modal con canvas. Al montar, carga la imagen detallada, dibuja en el canvas con `translate + rotate(detailRadians) + drawImage`

## Flujo de datos del render principal

```
App.tsx
  └── [route === 'navigation']
      └── Navigator.tsx
          ├── Viewer.tsx
          │     useEffect: new MosaicEngine(canvas)
          │                attachPointerHandlers(canvas, engine)
          │                engine.firstLoad(n => store.setLoading(n))
          │     canvas: renderizado por MosaicEngine directamente (fuera de React)
          │     PiezePopup: aparece cuando engine.onPiezePopup dispara
          │
          ├── [engine !== null] DirectionWidget — lee canMove* del store, llama engine.move*()
          ├── [engine !== null] ZoomWidget — lee zoomIdx del store, llama engine.zoom*()
          ├── [engine !== null] PreviewWidget — lee startX/Y/zoomIdx del store, drag → engine.setPosition()
          └── HelpPopup — estado local de Navigator
```

## Flujo de carga asíncrona

```
MosaicEngine.scheduleLoad()
  → buildTransactionList(view, context)   [por cada IView]
  → runTransactions(txns)
      → currentAbort.abort()             [cancela carga anterior]
      → new AbortController()
      → for txn of txns:
          → loadImages(txn.urls(), signal)
              → new Image() por URL (usa cache si ya existe)
          → txn.commit(images)
              → CacheEntry.setImageElement()
              → view.drawPieze() para cada pieza afectada en viewport
                  → ctx.save → translate → rotate → drawImage → restore
```

## Flujo de primer arranque

```
App.tsx useEffect
  → loadModels()
      → fetch('./piezes/piezes.json')
      → mainModel.addPieze() × 364
      → centerModel.addPieze() × 70

Viewer.tsx useEffect (paralelo al anterior)
  → new MosaicEngine(canvas)
  → attachPointerHandlers(canvas, engine)
  → engine.firstLoad(n => store.setLoading(n))
      → doSetZoom(0)         [zoom 100%]
      → buildTransactionList() × 2 vistas
      → loadAllSync(txns, onProgress)  [Promise.all]
          → para cada txn: loadImages → commit → onProgress(remaining--)
```

## Equivalencias clave Java → TypeScript

| Java | TypeScript | Notas |
|---|---|---|
| `GWTCanvas.setCoordSize(w,h)` | `ctx.setTransform(pxW/mmW, 0, 0, pxH/mmH, 0, 0)` | Aplica en cada doSetZoom |
| `GWTCanvas.saveContext/restoreContext` | `ctx.save() / ctx.restore()` | 1:1 |
| `GWTCanvas.translate/rotate/drawImage` | `ctx.translate / ctx.rotate / ctx.drawImage` | 1:1 |
| `TaskChain.cancel()` | `AbortController.abort()` | En taskScheduler.ts |
| `DeferredCommand.addCommand()` | Llamada directa (JS es single-thread, no hay necesidad) | En ViewerCommandsImpl → MosaicEngine |
| `History.newItem("navigation")` | `window.location.hash = 'navigation'` | En navigateTo() |
| `History.addValueChangeHandler` | `window.addEventListener('hashchange', ...)` | En useHashRoute |
| `PopupPanel.center()` | CSS `position:fixed, top:50%, left:50%, transform:translate(-50%,-50%)` | En PopupOverlay |
| `GWT.getModuleBaseURL() + "piezes/..."` | `'./piezes/...'` | En cache.ts y model.ts |
| `ImageLoader.loadImages(urls, callback)` | `loadImages(urls, signal): Promise<HTMLImageElement[]>` | En imageLoader.ts |
| `(int)(a / b)` | `Math.trunc(a / b)` | Crítico para hit-testing |
| `n % 2 != 0` | `n % 2 !== 0` | isOdd en geometry.ts |
