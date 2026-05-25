# Santjoans — Cerámica Zoo-Mórfica del palacio de Santjoans

Visor interactivo del tapiz de azulejos del Palacio Santjoans de Cinctorres (Castellón).
Sitio web: [www.santjoans.es](http://www.santjoans.es)

## El proyecto

El palacio de Santjoans alberga en su planta noble un pavimento de cerámica zoo-mórfica
fabricado en las reales fábricas de Valencia en la segunda mitad del s.XVIII.
Este proyecto nació en **2010** con el objetivo de preservarlo digitalmente y facilitar
su disfrute al público.

El estudio fotográfico y documental, junto con la primera versión de la aplicación web,
fueron presentados públicamente el 11 de agosto de **2010** en el Antic Escorxador de Cinctorres.
La aplicación alcanzó su versión definitiva en **marzo de 2011**, con más de 400 piezas
zoo-mórficas digitalizadas.

En **2026** se realizó una actualización tecnológica completa de la aplicación web —sin cambios
en el contenido ni en las imágenes— para garantizar su funcionamiento a largo plazo.

Más información: [www.santjoans.es/proyecto/proyecto.html](http://www.santjoans.es/proyecto/proyecto.html)

---

## Estructura del repositorio

```
santjoans/      ← aplicación ORIGINAL (2011) en GWT/Java. Referencia histórica.
santjoans-web/  ← aplicación ACTUAL (2026) en React + TypeScript + Vite.
```

---

## Aplicación actual: `santjoans-web/`

Stack: **React 19 + TypeScript + Vite + Zustand + Vitest**

```bash
cd santjoans-web
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # build de producción en dist/
npm test         # 21 tests unitarios de geometría
```

El build genera un sitio completamente estático (carpeta `dist/`) que se puede
servir desde cualquier servidor HTTP o plataforma de hosting estático.

---

## Aplicación original: `santjoans/`

Desarrollada en **GWT 2.1.1** (Google Web Toolkit). Conservada como referencia
histórica y para consulta del algoritmo original de renderizado canvas.

Dependencias originales:
- [google-web-toolkit-incubator](http://code.google.com/p/google-web-toolkit-incubator/) — soporte Canvas (anterior a su inclusión en el SDK)
- [gwt-image-loader](http://code.google.com/p/gwt-image-loader/) — carga asíncrona de imágenes

Para compilar desde Eclipse: seleccionar `Santjoans.html` como punto de entrada.
Una vez compilado, abrir `http://127.0.0.1:8888/Santjoans.html` (sin el parámetro
`gwt.codesvr`) para ejecutar la versión estática compilada.

---

## Licencia de las imágenes

Las imágenes de las piezas zoo-mórficas están publicadas bajo licencia
[Creative Commons BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/).
