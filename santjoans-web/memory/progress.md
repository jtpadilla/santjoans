# Estado actual del proyecto

**Última actualización**: 2026-05-25 (Fase 5 completada — lista para deploy)

## Resumen rápido

| Fase | Estado | Notas |
|---|---|---|
| 0 — Andamiaje | ✅ COMPLETA | Build limpio, dev server funciona |
| 1 — Modelo y geometría | ✅ COMPLETA | 21 tests unitarios passing |
| 2 — Motor canvas y componentes | ✅ COMPLETA | Código escrito y funcionando |
| 3 — Prueba visual e integración | ✅ COMPLETA | Verificado con Playwright en todos los niveles |
| 4 — Ajuste CSS / look | ✅ COMPLETA | page-box adaptativo + PreviewWidget drag fix |
| 5 — Cross-browser y deploy | ✅ COMPLETA | Chrome + Firefox verificados; build de producción OK |

## Checklist final verificado (actualizado 2026-05-25)

- ✅ Enlace «Información del proyecto» funciona: abre `./proyecto/proyecto.html` en pestaña nueva
- ✅ Documento HTML con 7 PDFs, 4 fotos de participantes y visor de thumbnails copiado a `public/proyecto/`
- ✅ Secciones actualizadas: browsers modernos (Chrome/Firefox/Safari/Edge + iPad), tecnología, y nueva sección «Reescritura 2026 con Claude Code»

## Checklist final verificado

- ✅ Pantalla presentación: thumbnails con popup landscape/portrait/four
- ✅ Contador de carga visible y decrementa
- ✅ Botón "Ver pavimento" aparece al finalizar la carga
- ✅ Mosaico renderiza en canvas a 100%
- ✅ Pan con drag del ratón funciona
- ✅ Pan con botones N/S/E/O funciona
- ✅ Botones se deshabilitan en bordes del mosaico
- ✅ Reset (home) vuelve a posición (0,0)
- ✅ Zoom in hasta 1600%, tiles de mayor resolución cargan progresivamente
- ✅ Zoom out hasta 100%
- ✅ Tiles asíncronos: rects grises mientras cargan, imagen al llegar
- ✅ Doble click en pieza → popup con canvas rotado al detailRotation
- ✅ Minimapa: imagen de miniatura.png + rect rojo del viewport
- ✅ Drag en el minimapa mueve el viewport (click también mueve)
- ✅ Botón help → popup de ayuda
- ✅ Hash routing: `#presentation` y `#navigation` funcionan
- ✅ Recargar en `#navigation` entra directamente al navegador
- ✅ Cross-browser: Chrome (Google Chrome via Playwright)
- ✅ Cross-browser: Firefox (Playwright Firefox 1522)
- ⏳ Cross-browser: Safari, Edge — requieren macOS/Windows, testear manualmente en producción

## Issues conocidos / no bloqueantes

### CSS background en subdirectorio
`index.css` usa `url('/bkg.png')` con ruta absoluta. Funciona en raíz del dominio (santjoans.es).
Si se sirviera en subdirectorio fallaría — no es un problema real.

### steepX/steepY = 0 en zoom 0 (100%)
Los botones de dirección no mueven en zoom 100% (el mosaico cabe completo).
Es el mismo comportamiento que el original GWT — no es un bug.

## Para hacer el deploy

```bash
cd santjoans-web
npm run build        # genera dist/
```

Subir el contenido de `dist/` al servidor de santjoans.es (raíz del dominio).
El fichero `dist/index.html` usa rutas relativas (`./assets/...`) gracias a `base: './'` en vite.config.ts.

### Estructura del dist/ generado
```
dist/
  index.html           (0.52 KB)
  assets/
    index-*.js         (220 KB gzip: 69 KB)
    index-*.css        (2.8 KB gzip: 0.97 KB)
  piezes/
    piezes.json        (754 piezas)
    60/{main,center}/  (364 + 70 tiles)
    360/{main,center}/ (364 + 70 tiles)
    550/{main,center}/ (364 + 70 tiles)
  ui/                  (9 iconos PNG)
  presentation/        (17 imágenes)
  bkg.png, grano.png, miniatura.png
```

## Fixes en Fase 4 y Fase 5

**Fase 4:**
- `Navigator.tsx` + `index.css`: `.navigator-page-box { width: fit-content }` — el contenedor se adapta al canvas (820–1450px según resolución)
- `PreviewWidget.tsx`: `handlePointerDown` actualiza posición inmediatamente (un click sin drag ya mueve el viewport)

**Fase 5:**
- `npx playwright install firefox` para tests cross-browser en CI/CD futuro
