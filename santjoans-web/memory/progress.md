# Estado actual del proyecto

**Última actualización**: 2026-05-24 (sesión inicial de implementación)

## Resumen rápido

| Fase | Estado | Notas |
|---|---|---|
| 0 — Andamiaje | ✅ COMPLETA | Build limpio, dev server funciona |
| 1 — Modelo y geometría | ✅ COMPLETA | 21 tests unitarios passing |
| 2 — Motor canvas y componentes | ✅ CÓDIGO ESCRITO | Pendiente prueba visual en browser |
| 3 — Prueba visual e integración | ⏳ PENDIENTE | Primera tarea de la próxima sesión |
| 4 — Ajuste CSS / look | ⏳ PENDIENTE | Después de que funcione visualmente |
| 5 — Cross-browser y deploy | ⏳ PENDIENTE | Última fase |

## Qué está hecho (con detalle)

### Ficheros creados — 100% escritos y compilando

**Config**
- `src/config/constants.ts` — todas las constantes de IConfiguration.java
- `src/config/zoomModes.ts` — 6 modos de zoom (100% a 1600%), helpers zoomIn/zoomOut
- `src/config/screenType.ts` — 5 tipos de pantalla (SVGA/XGA/SXGA/FULLHD/UXGA) + getCurrentScreenType()
- `src/config/strings.ts` — 4 strings i18n

**Model**
- `src/model/types.ts` — interfaces PiezeData, CacheEntry, ModelEntry, ViewerContext
- `src/model/model.ts` — clase abstracta Model con Map<number, ModelEntry>
- `src/model/cache.ts` — Cache indexada por nombre (no por coordenada, piezas reutilizadas)
- `src/model/mainModel.ts` — queryByContext para zona main
- `src/model/centerModel.ts` — queryByContext con tablas invalidStartX/Y
- `src/model/modelDirectory.ts` — singletons exportados mainModel, centerModel
- `src/model/modelLoader.ts` — fetch('./piezes/piezes.json') + populate

**Engine**
- `src/engine/geometry.ts` — porte de Util.java (isEven, isOdd, isValidMainCoord, isIntoCenterCoord, mainXtoCenterX/Y, pixelToMm, mmToCoord, getRadians)
- `src/engine/geometry.test.ts` — 21 tests unitarios ✅
- `src/engine/views/IView.ts` — interfaz IView
- `src/engine/views/MainView.ts` — drawPieze, drawEmptyPieze, updateFromModel, getPickedPieze (hit-test geométrico paridad par/impar)
- `src/engine/views/CenterView.ts` — idem para zona central
- `src/engine/MosaicEngine.ts` — fusión ControllerViewer + ViewerWidgetControl: firstLoad, setZoom, zoomIn/Out, setPosition, moveLeft/Right/Up/Down, onPointerDown/Move/Up, onDoubleClick, canMove*, adjustX/Y, notifyStore
- `src/engine/pointer.ts` — attachPointerHandlers con Pointer Events + setPointerCapture + dblclick

**Loader**
- `src/loader/imageLoader.ts` — loadImages(urls, signal): Promise<HTMLImageElement[]> con cache global
- `src/loader/transaction.ts` — buildTransactionList + TransactionImpl.commit() (updateFromCallbackResult + updateView fusionados)
- `src/loader/taskScheduler.ts` — runTransactions con AbortController (reemplaza TaskChain)
- `src/loader/syncPiezeLoader.ts` — loadAllSync con Promise.all + callback de progreso

**Store y hooks**
- `src/store/mosaicStore.ts` — Zustand: startX, startY, zoomIdx, canMove*, canZoom*, loadingRemaining
- `src/hooks/useHashRoute.ts` — routing hash manual: useHashRoute() + navigateTo()

**Componentes**
- `src/components/common/PopupOverlay.tsx` — modal glass + cierre con Escape o click fuera
- `src/components/presentation/Presentation.tsx` — pantalla inicial con 3 thumbnails, popup landscape/portrait/four, contador de carga, botón "Ver pavimento"
- `src/components/navigator/ImageButton.tsx` — botón con img, disabled, active
- `src/components/navigator/DirectionWidget.tsx` — N/S/E/O + home (reset a 0,0)
- `src/components/navigator/ZoomWidget.tsx` — zoom in/out + label del nivel
- `src/components/navigator/HelpPopup.tsx` — modal de ayuda con instrucciones
- `src/components/navigator/PiezePopup.tsx` — canvas con la pieza rotada (carga imagen detallada)
- `src/components/navigator/PreviewWidget.tsx` — canvas minimapa + rect viewport + drag
- `src/components/navigator/Viewer.tsx` — canvas principal + MosaicEngine en useEffect + PiezePopup
- `src/components/navigator/Navigator.tsx` — layout completo: Viewer + controles laterales
- `src/App.tsx` — useHashRoute → Presentation | Navigator + carga del modelo
- `src/index.css` — estilos base para todos los componentes

**Andamiaje**
- `vite.config.ts` — plugin XML→JSON, base './', test config vitest
- `index.html` — título correcto, lang=es, sin favicon GWT
- `package.json` — scripts: dev, build, test, preview
- `public/piezes/piezes.json` — generado (754 entradas)
- `public/ui/*.png` — 9 iconos de botones
- `public/presentation/*.png/jpg` — 17 imágenes de la presentación
- `public/bkg.png`, `public/grano.png`, `public/miniatura.png`
- `public/piezes/{60,360,550}/{main,center}/` — 1230 tiles JPG

**Estado verificado**:
```
npm test   → 21/21 tests passing ✅
npm run build → limpio en ~180ms ✅
npm run dev   → servidor en localhost:5173 ✅
```

## Issues conocidos / pendientes de resolver

### BLOCKER — Timing del engine en Navigator.tsx
El `Navigator.tsx` usa `engineRef.current` en los controles (DirectionWidget, ZoomWidget, PreviewWidget),
pero el engine solo existe tras el primer render de `Viewer.tsx` (se crea en `useEffect`).
En el primer render `engineRef.current === null`, así que los controles no se renderizan.

**Solución prevista**: añadir `useState<MosaicEngine | null>(null)` en Navigator.tsx
y pasarlo hacia abajo cuando el engine esté listo. El Viewer llama a un callback
`onEngineReady(engine)` en lugar de usar engineRef directamente.

### PENDIENTE — Estado inicial de loadingRemaining
En `App.tsx` el `loadingRemaining` inicial en el store es 0, lo que hace que
`Presentation.tsx` muestre el botón "Ver pavimento" antes de que la carga haya
comenzado (porque `loadingRemaining === 0` y el modelo todavía no se ha cargado).

**Solución prevista**: cambiar el valor inicial del store a `-1` (o `null`) para
indicar "carga no iniciada", y mostrar "Iniciando..." mientras sea -1,
"Quedan X piezas..." mientras > 0, y el botón cuando === 0.

### PENDIENTE — CSS background en subdirectorio
`index.css` usa `url('/bkg.png')` con ruta absoluta. Con `base: './'` en vite.config.ts,
en producción las rutas del CSS se vuelven relativas, pero las CSS `url()` con `/` son siempre
absolutas respecto al dominio. Si la app se sirve en un subdirectorio fallará.

**Solución**: cambiar a `url('./bkg.png')` en el CSS. En Vite, las url() en CSS importado
desde `src/` se procesan como assets.

### PENDIENTE — Prueba visual del canvas
El motor de canvas (MosaicEngine, MainView, CenterView, transformación mm↔px) no ha
sido probado visualmente. Es el riesgo técnico mayor. Las áreas más probables de bug:
1. `applyCanvasTransform()` — el factor de escala mm→px puede estar invertido o mal calculado
2. `drawEmptyPieze` — puede no verse porque el tamaño mm es muy grande antes de la transformación
3. Hit-testing — puede funcionar en tests unitarios pero fallar con las coordenadas reales del canvas

### PENDIENTE — Integración del Viewer con firstLoad
El `Viewer.tsx` llama `engine.firstLoad(...)` que es async, pero el `Presentation.tsx`
ya está renderizado esperando los callbacks de progreso. Hay que asegurarse de que
`setLoading` del store llega a la presentación correctamente.

## Próximos pasos inmediatos (Fase 3)

1. **Arreglar timing del engine** — refactorizar Navigator.tsx para pasar engine como prop desde Viewer
2. **Arreglar loadingRemaining inicial** — valor -1 mientras el modelo no carga
3. **Arrancar dev server** — `npm run dev` y abrir browser
4. **Debug visual iterativo** — ir corrigiendo lo que no se vea bien en el canvas
5. **Probar interacciones** — drag, zoom, dblclick, preview

## Ficheros de referencia del legacy (para consulta)

Los ficheros Java originales están en `../santjoans/src/santjoans/client/`.
Los más importantes para la depuración visual:

- `piezes/view/MainView.java` — drawPieze + hit-testing
- `piezes/view/CenterView.java` — drawPieze para zona central
- `piezes/navigator/viewer/ControllerViewer.java` — orquestación zoom/pan
- `piezes/navigator/viewer/ViewerWidgetControl.java` — drag con ratón
- `piezes/navigator/preview/PreviewWidgetContext.java` — fórmulas del minimapa
- `util/Util.java` — conversiones mm↔px↔coord
- `util/ZoomModeEnum.java` — tabla de zoom
- `util/ScreenTypeEnum.java` — tamaños de canvas por resolución
