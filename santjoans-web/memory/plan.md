# Plan de reescritura: GWT → React + TypeScript + Vite

## Objetivo

Reescribir la aplicación `santjoans` (visor interactivo del tapiz de azulejos del
Palacio Santjoans) de GWT 2011 a React + TypeScript + Vite.

- **Paridad funcional 1:1**: mismo flujo, mismo aspecto, misma interacción
- **No es rediseño visual** — se porta el comportamiento tal cual
- **Resultado**: carpeta `santjoans-web/` desplegable como estática en santjoans.es

## Stack elegido

- React 19 + TypeScript + Vite
- Zustand (estado UI: zoom, posición, canMove*)
- fast-xml-parser (conversión piezes.xml → JSON en build)
- Vitest (tests unitarios de geometría)
- Sin react-router (solo 2 rutas, hash routing manual)
- Sin librería de canvas — API Canvas2D nativa (1:1 con GWTCanvas)

## Proyecto origen

- `../santjoans/` — app GWT con ~5.000 LOC Java, 61 ficheros
- `../santjoans/src/santjoans/public/piezes/` — 1230 tiles JPG en 3 resoluciones
- `../santjoans/src/santjoans/public/piezes/piezes.xml` — definición de las 434 piezas
- `../santjoans/src/santjoans/client/resources/` — iconos UI e imágenes de presentación

## Decisiones técnicas clave

| Aspecto | Decisión |
|---|---|
| Routing | Hook `useHashRoute` propio (15 líneas, `hashchange`) — solo 2 rutas |
| Estado global UI | Zustand — re-renders selectivos por control |
| Modelo de datos | Módulo singleton TS (read-only tras boot, fuera de React) |
| Parsing XML | Convertir a `piezes.json` en build (plugin Vite con fast-xml-parser) |
| Image preloading | `Map<url, HTMLImageElement>` + `Promise.all` manual |
| Canvas coords | `ctx.setTransform(pxW/mmW, ...)` replica `GWTCanvas.setCoordSize` |
| Eventos | Pointer Events + `setPointerCapture` (cubre mouse+touch) |
| Cancelación carga | `AbortController` — reemplaza TaskChain.cancel() |
| Redraw | Redraw completo del viewport en cada cambio (<1ms, misma estrategia que el original) |
| i18n | Constantes inline en `config/strings.ts` — solo 4 strings |
| Detección de browser | **Eliminada** — bloquea Chrome moderno por error en el original |
| Logging servlet | **Eliminado** — ruido del incubator GWT |

## Fases de implementación

### Fase 0 — Andamiaje ✅ COMPLETADA
- Vite + React + TS scaffolding
- Plugin Vite: `piezes.xml` → `public/piezes/piezes.json`
- Copia de assets (tiles, iconos, presentación, backgrounds)
- HTML limpio con title correcto, sin iframe GWT
- Estructura de carpetas `src/{config,model,engine,loader,store,hooks,components}`

### Fase 1 — Modelo, geometría, configuración ✅ COMPLETADA
- `src/config/constants.ts` — todas las constantes de IConfiguration.java
- `src/config/zoomModes.ts` — 6 modos de zoom con tabla const (porte de ZoomModeEnum.java)
- `src/config/screenType.ts` — 5 tipos de pantalla + función `getCurrentScreenType()` (porte de ScreenTypeEnum.java + Util.getCurrentScreenType())
- `src/config/strings.ts` — 4 strings i18n inline
- `src/model/types.ts` — interfaces: PiezeData, CacheEntry, ModelEntry, ViewerContext
- `src/model/model.ts` — clase abstracta Model (porte de Model.java)
- `src/model/cache.ts` — Cache con Map<name, CacheEntryImpl> (porte de Cache.java)
- `src/model/mainModel.ts` — MainModel con queryByContext (porte de MainModel.java)
- `src/model/centerModel.ts` — CenterModel con tablas invalidStartX/Y (porte de CenterModel.java)
- `src/model/modelDirectory.ts` — singletons mainModel + centerModel
- `src/model/modelLoader.ts` — fetch piezes.json + populate (reemplaza ModelLoader.java)
- `src/engine/geometry.ts` — porte de Util.java: isEven/Odd, isValidMainCoord, isIntoCenterCoord, mainXtoCenterX/Y, pixelToMillimeter, millimeterToCoord, getRadians
- `src/engine/geometry.test.ts` — 21 tests unitarios ✅ todos pasando

### Fase 2 — Motor canvas y componentes base ✅ COMPLETADA (código escrito, pendiente prueba visual)
- `src/engine/views/IView.ts` — interfaz IView
- `src/engine/views/MainView.ts` — porte 1:1 de MainView.java: drawPieze, drawEmptyPieze, updateFromModel, getPickedPieze (hit-testing geométrico)
- `src/engine/views/CenterView.ts` — porte 1:1 de CenterView.java
- `src/loader/imageLoader.ts` — cache de HTMLImageElement + Promise por URL
- `src/loader/transaction.ts` — buildTransactionList + commit (reemplaza Transaction.java + TransactionFactory.java)
- `src/loader/taskScheduler.ts` — AbortController (reemplaza TaskChain.java + TaskManager.java)
- `src/loader/syncPiezeLoader.ts` — Promise.all en paralelo con callback de progreso (reemplaza SyncPiezeLoader.java)
- `src/engine/MosaicEngine.ts` — fusión de ControllerViewer + ViewerWidgetControl: pan, zoom, drag, dblclick, adjustX/Y
- `src/engine/pointer.ts` — Pointer Events con setPointerCapture (reemplaza GWTCanvasEventEnabled.java)
- `src/store/mosaicStore.ts` — Zustand: startX, startY, zoomIdx, canMove*, loadingRemaining
- `src/hooks/useHashRoute.ts` — routing hash manual
- `src/components/common/PopupOverlay.tsx` — modal con glass effect + cierre con Escape
- `src/components/presentation/Presentation.tsx` — pantalla inicial con thumbnails clickables y popup de imágenes
- `src/components/navigator/ImageButton.tsx` — botón con imagen (disabled, active)
- `src/components/navigator/DirectionWidget.tsx` — 5 botones N/S/E/O/reset
- `src/components/navigator/ZoomWidget.tsx` — zoom in/out + label del nivel
- `src/components/navigator/HelpPopup.tsx` — modal de ayuda
- `src/components/navigator/PiezePopup.tsx` — canvas con la pieza rotada al ángulo detailRotation
- `src/components/navigator/PreviewWidget.tsx` — minimapa canvas con rect del viewport + drag
- `src/components/navigator/Viewer.tsx` — canvas principal + instancia MosaicEngine en useEffect
- `src/components/navigator/Navigator.tsx` — layout que compone todos los controles
- `src/App.tsx` — entry: useHashRoute → Presentation | Navigator
- `src/index.css` — estilos base (presentation, navigator, botones, popups)

**Estado del build**: `npm run build` limpio en ~180ms. `npm test` 21/21 passing.

### Fase 3 — Prueba visual completa ⏳ PENDIENTE
**Objetivo**: abrir en el navegador y verificar que el mosaico se renderiza y se puede interactuar.

Tareas concretas:
1. Ejecutar `npm run dev` y abrir `http://localhost:5173/`
2. Verificar que la pantalla de presentación carga con las imágenes (palacio, piezas, museo, escudos, indio)
3. Verificar que el contador de carga decrements mientras se cargan las piezas
4. Hacer click en "Ver pavimento" → debe aparecer el mosaico en el canvas
5. Verificar el pan con drag y con botones de dirección
6. Verificar zoom in/out
7. Verificar que el minimapa (PreviewWidget) muestra el rect correcto
8. Doble click en pieza → popup con detalle rotado
9. Botón de ayuda → popup de ayuda

Issues conocidos/pendientes de prueba:
- El `Viewer.tsx` crea `MosaicEngine` en `useEffect` pero los controles usan `engineRef.current` directamente — puede haber un problema de timing en el primer render (los controles se renderizan antes de que el engine esté listo). Solución prevista: añadir estado `engineReady` en el store o usar useState en Navigator.
- El CSS del body usa `url('/bkg.png')` con ruta absoluta — en dev funciona, en `base: './'` puede fallar en subdir. Verificar.
- El `Presentation.tsx` muestra el botón "Ver pavimento" cuando `loadingRemaining === 0`, pero en el arranque inicial es 0 antes de que empiece la carga. Hay que añadir un estado inicial que lo distinga de "carga completada".

### Fase 4 — Ajuste CSS y look visual ⏳ PENDIENTE
- Ajustar tamaños y colores del CSS para que coincida con el original (`Santjoans.css` y la presentación del original)
- El original tiene un layout específico para el canvas + controles laterales
- Revisar comportamiento responsivo a diferentes resoluciones de pantalla (ScreenTypeEnum)

### Fase 5 — Pruebas cross-browser y deploy ⏳ PENDIENTE
- Chrome, Firefox, Safari, Edge
- Verificar Pointer Events en móvil/tablet (el original no funcionaba en móvil)
- `npm run build` → subir `dist/` al servidor
- Verificar que el base path `'./'` funciona correctamente en la URL raíz de santjoans.es

## Checklist de verificación final

- [ ] Pantalla presentación: thumbnails con popup landscape/portrait/four
- [ ] Contador de carga visible y decrementa
- [ ] Botón "Ver pavimento" aparece al finalizar la carga
- [ ] Mosaico renderiza en canvas a 100%
- [ ] Pan con drag del ratón funciona
- [ ] Pan con botones N/S/E/O funciona
- [ ] Botones se deshabilitan en bordes del mosaico
- [ ] Reset (home) vuelve a posición (0,0)
- [ ] Zoom in hasta 1600%, tiles de mayor resolución cargan progresivamente
- [ ] Zoom out hasta 100%
- [ ] Tiles asíncronos: mientras llegan se ven rects grises (#A29481 rotados 45°)
- [ ] Cambio brusco de dirección cancela la carga anterior (AbortController)
- [ ] Doble click en pieza → popup con canvas rotado al detailRotation
- [ ] Minimapa: imagen de miniatura.png + rect rojo del viewport
- [ ] Drag en el minimapa mueve el viewport
- [ ] Botón help → popup de ayuda
- [ ] Hash routing: `#presentation` y `#navigation` funcionan
- [ ] Recargar en `#navigation` entra directamente al navegador
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge
