# Decisiones técnicas y justificaciones

Este fichero documenta las decisiones no obvias tomadas durante el diseño e
implementación, para no tener que redescubrirlas en sesiones futuras.

---

## Routing: hook propio en lugar de react-router

**Decisión**: `src/hooks/useHashRoute.ts` con 15 líneas y `window.addEventListener('hashchange')`.

**Por qué**: Solo hay 2 rutas (`#presentation`, `#navigation`). React Router son ~13 KB extra,
una dependencia con breaking changes frecuentes, y añade conceptos (Outlet, Routes, Route)
innecesarios para un caso tan simple. El hash routing replicaba exactamente el comportamiento
de `GWT.History` del original.

---

## Estado global: Zustand solo para lo que re-renderiza UI

**Decisión**: El modelo de datos (`mainModel`, `centerModel`, `Cache`) son módulos singleton
TS fuera de React. Solo van al store de Zustand los valores que los controles React
necesitan para decidir si re-renderizarse: `zoomIdx`, `startX/Y`, `canMove*`, `loadingRemaining`.

**Por qué**: El canvas se redibuja desde `MosaicEngine.redraw()` directamente sobre el
`CanvasRenderingContext2D`, sin pasar por React. Si el modelo estuviera en Zustand,
cualquier carga de un tile dispararía un re-render de todo el árbol de componentes.
El modelo es read-only tras el boot, así que un singleton es correcto.

---

## Canvas: redraw completo en cada operación

**Decisión**: `MosaicEngine.redraw()` hace `clearRect` + `updateFromModel` completo en
cada pan o zoom.

**Por qué**: La app original hace exactamente lo mismo. Con 434 piezas y `drawImage`
acelerado por GPU, el redraw completo es <1ms. Implementar dirty regions añadiría
complejidad sin beneficio visible.

---

## Conversión XML → JSON en build-time

**Decisión**: Plugin Vite en `vite.config.ts` que usa `fast-xml-parser` para convertir
`../santjoans/src/santjoans/public/piezes/piezes.xml` → `public/piezes/piezes.json`.
Se ejecuta en `buildStart`, que Vite llama tanto en dev como en build.

**Por qué**:
- Elimina el parsing XML en runtime (DOMParser + iteración de NodeList)
- Permite tipado estricto de la interfaz `PiezeData`
- El JSON es ~70% más pequeño que el XML
- El fichero fuente (`piezes.xml`) no cambia en producción

**Nota**: El JSON resultante tiene 754 entradas porque el XML define las mismas imágenes
(ej: marmol1.jpg) múltiples veces con distintas coordenadas y rotaciones. Eso es correcto:
la cache las agrupa por nombre, no por posición.

---

## Cancelación de carga: AbortController

**Decisión**: `src/loader/taskScheduler.ts` cancela la carga en curso con `AbortController.abort()`
antes de iniciar una nueva.

**Por qué**: Reemplaza la maquinaria de `TaskChain.cancel()` + `ITaskLink` + `ITaskContext`
del original (~70 líneas Java) por ~15 líneas de async/await con `AbortSignal`.
Las imágenes que ya estaban en la cache se conservan aunque la transacción se cancele
(porque `imageLoader.ts` comprueba la cache antes de crear un nuevo `Image()`).

---

## Sistema de coordenadas mm en canvas

**Decisión**: Al inicio de cada redraw y en cada cambio de zoom, `MosaicEngine.applyCanvasTransform()`
llama a:
```ts
ctx.setTransform(screen.canvasX / mode.millimetersWidth, 0, 0, screen.canvasY() / mode.millimetersHeight, 0, 0)
```

**Por qué**: `GWTCanvas.setCoordSize(w, h)` en GWT cambia el sistema de coordenadas del canvas
para que `drawImage`, `translate`, `rotate` operen en unidades de mm en lugar de px.
La Canvas2D API nativa no tiene `setCoordSize`, pero `setTransform` con el factor de escala
adecuado produce exactamente el mismo efecto. Esto es lo que permite portar el código de
`MainView.java` 1:1 sin convertir las coordenadas mm a px manualmente.

**Advertencia**: `ctx.clearRect` debe llamarse con coordenadas en px (antes de `setTransform`)
o se debe resetear el transform antes. En `MosaicEngine.redraw()` el orden es:
`clearRect(0, 0, pxW, pxH)` → `applyCanvasTransform()` → `updateFromModel(...)`.

---

## Pointer Events, multi-touch y soporte táctil

**Decisión**: `src/engine/pointer.ts` usa `pointerdown/pointermove/pointerup/pointercancel/pointerleave`
con `touch-action: none` y un mapa de punteros activos para manejar pan (1 dedo),
pinch-zoom (2 dedos) y tap-pick (táctil).

**Por qué**: Pointer Events cubren mouse + touch + stylus de forma unificada. Con
`canvas.setPointerCapture(e.pointerId)` se garantiza que los eventos `move` y `up`
llegan al canvas aunque el puntero salga del elemento — esto resuelve el problema que
el original manejaba con `NativePreviewHandler` global de GWT.

`touch-action: none` (no `manipulation`) es necesario para interceptar completamente
el scroll/zoom nativo del navegador durante arrastre en canvas. `manipulation` dejaba
al navegador tomar el control en ciertos gestos.

El pinch-to-zoom mapea a los **6 niveles discretos existentes** (no zoom continuo).
Umbral 1.35×: al separar los dedos un 35%, hace `zoomInAction()`; al juntarlos,
`zoomOutAction()`. Tras cada step, se resetea el baseline de distancia para permitir
pasos consecutivos. Decisión de mantener los niveles discretos: cambia la arquitectura
lo mínimo y preserva el sistema de tiles (cada nivel tiene su resolución de imagen).

El **tap-pick** solo se activa en `pointerType !== 'mouse'`: si la distancia
desde el punto de down al up es <10px y el tiempo <250ms, se llama
`engine.onDoubleClick()`. En desktop el pick sigue siendo `dblclick` nativo.
Esta distinción evita que clicks normales de ratón abran popups.

`pointercancel` limpia completamente el estado (importante cuando iOS interrumpe
el touch por una llamada entrante, notificación, etc.).

---

## Canvas responsive: redimensionado al viewport

**Decisión**: `screenType.ts` usa `window.innerWidth/innerHeight` (viewport) en lugar
de `window.screen.width/height` (pantalla física). `refreshScreenType()` recalcula el
perfil activo y lo compara por `canvasX` para determinar si cambió. `Viewer.tsx` escucha
`resize` y `orientationchange` en `window` y llama `engine.handleResize()` cuando el
perfil cambia. `MosaicEngine.handleResize()` actualiza `canvas.width/height` e redibuja.

**Por qué**: `window.screen` es el tamaño físico del monitor — en móvil puede ser
el tamaño de la pantalla entera aunque el viewport del navegador sea la mitad (barra
de URL, teclado, etc.). `innerWidth` es el viewport real. Usar `screen` causaba que
móviles con pantalla de 1080px recibieran el perfil FullHD (canvas de 1450px) aunque
el área visible fuera de 375px.

El redimensionado es seguro porque las coordenadas del modelo son mm físicos; solo
el `setTransform` (ratio canvasPx/mm) cambia. No es necesario reiniciar el engine
ni el estado (posición, zoom, cache de imágenes).

El preset «mobile» (viewport <600px) construye el `canvasX` como `min(viewport - 16, 480)`
para llenar la pantalla con un margen mínimo. Los presets fijos (SVGA→FullHD) siguen
activos para escritorio/tablet.

---

## Iconos SVG inline en lugar de PNG externos

**Decisión**: Los 9 PNG de `public/ui/` (heredados de 2011, orígenes heterogéneos,
uno de ellos 30×30 en lugar de 48×48) fueron reemplazados por 8 iconos SVG inline
en `src/components/navigator/icons.tsx`.

**Por qué**: Los PNG no tenían color de marca (no eran cobalt), eran pixelados en
displays retina, tenían tamaños inconsistentes y no respondían al `currentColor`
de CSS. Los SVG inline son vectoriales (crisp a cualquier DPR), heredan el color
del token `--color-cobalt` vía `color: currentColor`, tienen peso mínimo (no son
assets externos), y se pueden deshabilitar visualmente con `color: var(--color-rule)`
sin opacidad burda.

---

## Cache de imágenes por nombre (no por coordenada)

**Decisión**: `src/model/cache.ts` indexa con `imageName.toLowerCase()` como clave.

**Por qué**: Porte del comportamiento de `Cache.java`. Varias piezas del mosaico
usan la misma imagen JPG con distintas rotaciones (ej: `marmol1.jpg` aparece en 8
posiciones). Si la cache fuera por coordenada, se cargaría el mismo fichero 8 veces.
La cache por nombre garantiza que la imagen solo se descarga una vez y todas las piezas
que la referencian la obtienen de la misma `CacheEntry`.

---

## División entera Java → Math.trunc en TypeScript

**Decisión**: Toda expresión `(int)(a / b)` de Java se porta como `Math.trunc(a / b)`.

**Por qué**: En Java, `(int)` trunca hacia cero (igual que `Math.trunc`). La división
JS sin truncar devuelve `double`. En coordenadas positivas no hay diferencia, pero
el hit-testing calcula coordenadas que pueden llegar al borde 0 del modelo, donde una
diferencia de 1 en la coordenada cambiaría qué pieza se devuelve.

**Ficheros críticos**: `engine/geometry.ts` (todas las funciones `millimeterToCoord*`
y `pixelToMillimeter*`), `engine/views/MainView.ts` (`getPickedPieze`),
`engine/views/CenterView.ts` (`getPickedPieze`).

---

## Detección de browser eliminada

**Decisión**: La lógica de `InvalidBrowserPanel` y el `if (startsWith("mozilla/5"))`
de `Santjoans.java` fueron eliminados completamente.

**Por qué**: La condición original (`mozilla/5` o `opera/`) excluía Chrome moderno
(que reporta `mozilla/5.0` pero no con esa condición, aunque el navegador habría
funcionado). Cualquier browser con Canvas2D + Pointer Events funciona. La comprobación
obsoleta causaría falsos negativos en browsers modernos. Todos los browsers de los
últimos 5 años soportan lo necesario.

---

## Logging remoto eliminado

**Decisión**: `RemoteLoggingServiceImpl` y el servlet en `web.xml` eliminados.

**Por qué**: Era específico del GWT Incubator y no tiene equivalente en la nueva app.
Los `GWT.log()` del código Java se omiten en el porte (no se añaden `console.log`
salvo donde sea útil para depuración).

---

## Estructura de carpetas del repo

**Decisión**: Nueva carpeta `santjoans-web/` junto al `santjoans/` original, dentro
del mismo repositorio git.

**Por qué**: Preserva el código legacy como referencia ejecutable durante la migración.
Permite hacer la migración en la misma rama o en ramas separadas sin renombrar nada.
El mismo repositorio facilita las referencias cruzadas (`../santjoans/...`).

---

## Nota sobre el campo `class` en piezes.json

**Decisión**: El campo se llama `class` (no `type` ni `piezeClass`) para respetar
el atributo del XML convertido.

**Nota**: `class` es palabra reservada en TypeScript, pero como campo de interfaz
(no como variable local) es perfectamente válido:
```ts
interface PiezeData { class: 'main' | 'center' }
const p: PiezeData = { class: 'main' }  // OK
```
