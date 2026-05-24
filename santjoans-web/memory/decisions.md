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

## Pointer Events en lugar de Mouse Events

**Decisión**: `src/engine/pointer.ts` usa `pointerdown/pointermove/pointerup/pointerleave`
en lugar de `mousedown/mousemove/mouseup`.

**Por qué**: Pointer Events cubren mouse + touch + stylus de forma unificada. Con
`canvas.setPointerCapture(e.pointerId)` se garantiza que los eventos `move` y `up`
llegan al canvas aunque el puntero salga del elemento — esto resuelve el problema que
el original manejaba con `NativePreviewHandler` global de GWT.
`touch-action: manipulation` en el canvas previene el scroll del navegador durante
el drag y hace que `dblclick` funcione en iOS/Android.

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
