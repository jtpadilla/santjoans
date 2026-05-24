# Directorio de memoria del proyecto santjoans-web

Este directorio contiene el rastro completo del trabajo realizado y pendiente,
para poder retomar la sesión en cualquier momento sin perder contexto.

## Ficheros

| Fichero | Contenido |
|---|---|
| `plan.md` | Plan completo de la reescritura (objetivo, decisiones técnicas, fases) |
| `progress.md` | Estado actual: qué está hecho, qué falta, issues conocidos |
| `architecture.md` | Mapa de ficheros: qué hace cada módulo y cómo se relacionan |
| `decisions.md` | Decisiones técnicas tomadas y su justificación |

## Cómo continuar

1. Leer `progress.md` para saber en qué punto exacto se quedó
2. Leer `plan.md` sección de la fase pendiente
3. Leer los ficheros de `architecture.md` relevantes antes de tocar código
4. Ejecutar `npm test` y `npm run build` para verificar que el estado es limpio

## Comandos rápidos

```bash
cd santjoans-web
source ~/.nvm/nvm.sh   # o el gestor de node que uses
npm test               # 21 tests unitarios de geometría
npm run build          # build de producción (~180ms)
npm run dev            # servidor de desarrollo en localhost:5173
```
