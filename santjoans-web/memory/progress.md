# Estado actual del proyecto

    **Última actualización**: 2026-05-27 (Fix canvas negro al volver de background en móvil)

## Resumen rápido

| Fase | Estado | Notas |
|---|---|---|
| 0 — Andamiaje | ✅ COMPLETA | Build limpio, dev server funciona |
| 1 — Modelo y geometría | ✅ COMPLETA | 21 tests unitarios passing |
| 2 — Motor canvas y componentes | ✅ COMPLETA | Código escrito y funcionando |
| 3 — Prueba visual e integración | ✅ COMPLETA | Verificado con Playwright en todos los niveles |
| 4 — Ajuste CSS / look | ✅ COMPLETA | page-box adaptativo + PreviewWidget drag fix |
| 5 — Cross-browser y deploy | ✅ COMPLETA | Chrome + Firefox verificados; build de producción OK |
| 6 — Rediseño estético | ✅ COMPLETA | Patrimonio mediterráneo: crema/cobalto/ocre, Google Fonts |
| 7 — Touch + RWD | ✅ COMPLETA | Pan, pinch-zoom, tap-pick, layout fluido, media queries |
| 8 — Internacionalización | ✅ COMPLETA | ES/CA/EN; selector en presentación; proyecto.*.html |
| 9 — GitHub Pages | ✅ COMPLETA | Deploy automático vía GitHub Actions en jtpadilla/santjoans |
| 10 — RWD proyecto.html | ✅ COMPLETA | CSS fluido + viewport meta tag en los 3 HTML estáticos |
| 11 — Fix canvas negro | ✅ COMPLETA | Race condition React/motor eliminada; motor propietario de canvas.width/height |
| 12 — Fix canvas negro en background | ✅ COMPLETA | `visibilitychange` + `pageshow` → `engine.invalidate()` repinta al volver del background |

## Funcionalidades implementadas

### Interacción — escritorio
- ✅ Pan con arrastre del ratón
- ✅ Pan con botones N/S/E/O (se deshabilitan en bordes)
- ✅ Zoom +/– con botones (6 niveles: 100%–1600%)
- ✅ Botón Home: resetea a zoom 100% + posición (0,0)
- ✅ Double-click sobre pieza → popup con detalle de la pieza

### Interacción — táctil (tablet y móvil)
- ✅ Pan con un dedo (arrastrar)
- ✅ Pinch con dos dedos → zoom in/out (snap a los 6 niveles discretos)
- ✅ Tap simple sobre pieza → popup con detalle
- ✅ `touch-action: none` en canvas principal y minimapa (sin interferencia del navegador)
- ✅ `pointercancel` manejado correctamente (drag no queda colgado)
- ✅ Botones ≥ 44 px de área táctil (mínimo iOS HIG / Material)

### Responsive Web Design
- ✅ Pantalla de presentación fluida (`max-width: 700px`, sin scroll horizontal en móvil)
- ✅ Canvas redimensiona al viewport (`window.innerWidth/innerHeight`), reacciona a resize y orientationchange
- ✅ Preset «mobile» para viewport < 600 px (canvas dinámico viewport – 16 px)
- ✅ Imágenes de presentación apiladas en columna en móvil (`@media max-width: 600px`)
- ✅ Barra de control con `flex-wrap` (fluye a segunda fila si no cabe)
- ✅ Dos breakpoints CSS: 600 px y 400 px

### Internacionalización (ES/CA/EN)
- ✅ Selector de idioma (tres botones ES/CA/EN) en cabecera de la pantalla de presentación
- ✅ Preferencia persistida en `localStorage`; inglés por defecto es español
- ✅ Toda la app React traducida: título, loading, botón de entrada, botones de dirección/zoom/ayuda, popup de ayuda
- ✅ Cuerpo largo de la presentación en tres idiomas como JSX en `src/i18n/presentationContent/`
- ✅ Documento estático `proyecto.html` → tres ficheros hermanos (`proyecto.es.html`, `proyecto.ca.html`, `proyecto.en.html`)
- ✅ Redirección legacy: `proyecto.html` → `proyecto.es.html` vía meta refresh
- ✅ Selector de idioma dentro de cada documento estático (paleta cobalto, `aria-current="page"`)
- ✅ El enlace «Información del proyecto» apunta a `proyecto.${locale}.html`

### Presentación y documentación
- ✅ Enlace «Información del proyecto» abre `./proyecto/proyecto.html` en pestaña nueva
- ✅ Documento con 7 PDFs, 4 fotos, visor de thumbnails; actualizado con sección «Reescritura 2026»
- ✅ Secciones obsoletas de browsers eliminadas; stack React actualizado
- ✅ Historial del blog de noticias incorporado como resumen en el propio documento

### Rediseño estético «Patrimonio mediterráneo»
- ✅ Paleta crema/cobalto/ocre con tokens CSS (`--color-*`, `--font-*`, `--sp-*`)
- ✅ Google Fonts: Cormorant Garamond (serif, títulos) + Inter (sans, cuerpo)
- ✅ Iconos SVG inline en stroke cobalto (sustituyen los PNG de 2011)
- ✅ Layout con secciones, sin `<hr>` ni floats manuales
- ✅ Botones CTA, ghost, disabled coherentes con el sistema de diseño

### Motor canvas
- ✅ Renderizado idéntico al original GWT (coordenadas mm, `setTransform`)
- ✅ Hit-testing de piezas (MainView + CenterView)
- ✅ Minimapa con rect de viewport
- ✅ Carga asíncrona y cancelable (AbortController)
- ✅ `handleResize()` en MosaicEngine: redimensiona canvas, re-aplica transform, recarga tiles

## Checklist de verificación

- ✅ `npm test` → 21 tests de geometría passing
- ✅ `npm run build` → limpio, ~70 KB gzip
- ✅ Escritorio: pan ratón, dblclick-pick, zoom, home, minimapa
- ✅ Móvil (Chrome DevTools): pan un dedo, pinch-zoom, tap-pick, layout sin overflow
- ⏳ Safari/Edge: pendiente de verificación manual en dispositivos reales

## Issues conocidos / no bloqueantes

### steepX/steepY = 0 en zoom 0 (100%)
Los botones de dirección no mueven en zoom 100% (el mosaico cabe completo en el canvas).
Es el mismo comportamiento que el original GWT — no es un bug.

### Minimapa: rect de viewport en rojo
El rectángulo que muestra el área visible en el minimapa sigue siendo rojo. Podría
actualizarse a cobalto para seguir el sistema de diseño, pero es un cambio menor
pendiente para sesión futura.

## Issues resueltos (historial)

### Canvas en negro al volver de background (iOS Safari) ← RESUELTO 2026-05-27
El SO/navegador descarta el bitmap del canvas cuando la pestaña queda en background.
La app no escuchaba `visibilitychange` ni `pageshow`, así que al volver nadie repintaba.
Solución: `MosaicEngine.invalidate()` (público, llama a `redraw()` sin tocar canvas.width/height)
y dos listeners en `Viewer.tsx`: `visibilitychange` + `pageshow`.

### Canvas en negro tras rotación / resize ← RESUELTO 2026-05-25
Race condition: `onResize` llamaba `engine.handleResize()` (escribe canvas.width/height + transform + redraw)
y luego `setCanvasSize(...)` disparaba un re-render que sobreescribía los atributos JSX width/height,
reseteando el bitmap. Solución: eliminar `canvasSize` state de Viewer.tsx y los atributos JSX;
el motor inicializa en el constructor y es el único propietario de canvas.width/height.

## Para hacer el deploy

### GitHub Pages (activo)

```bash
git push origin rewrite-react:master   # dispara el workflow de GitHub Actions
```

URL pública: https://jtpadilla.github.io/santjoans/

**Nota**: solo pushes a `master` despliegan. El workflow escucha `rewrite-react` pero
GitHub Pages rechaza el deploy desde esa rama (regla de protección del entorno).

### Deploy manual en santjoans.es

```bash
cd santjoans-web
npm run build        # genera dist/
```

Subir el contenido de `dist/` al servidor de santjoans.es (raíz del dominio).

### Estructura del dist/ generado

```
dist/
  index.html           (~0.8 KB)
  assets/
    index-*.js         (~221 KB / gzip: ~70 KB)
    index-*.css        (~8 KB / gzip: ~2 KB)
  piezes/
    piezes.json        (754 piezas)
    60/{main,center}/  (364 + 70 tiles JPG)
    360/{main,center}/ (364 + 70 tiles JPG)
    550/{main,center}/ (364 + 70 tiles JPG)
  presentation/        (17 imágenes)
  proyecto/            (proyecto.html + CSS/JS + 4 fotos + 7 PDFs)
  miniatura.png        (minimapa)
  favicon.svg
```
