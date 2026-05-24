const imageCache = new Map<string, HTMLImageElement>()

function loadOne(url: string, signal: AbortSignal): Promise<HTMLImageElement> {
  const cached = imageCache.get(url)
  if (cached) return Promise.resolve(cached)

  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException('Aborted', 'AbortError')); return }
    const img = new Image()
    const onAbort = () => { img.src = ''; reject(new DOMException('Aborted', 'AbortError')) }
    signal.addEventListener('abort', onAbort, { once: true })
    img.onload = () => {
      signal.removeEventListener('abort', onAbort)
      imageCache.set(url, img)
      resolve(img)
    }
    img.onerror = () => {
      signal.removeEventListener('abort', onAbort)
      reject(new Error(`Error cargando imagen: ${url}`))
    }
    img.src = url
  })
}

export async function loadImages(urls: string[], signal: AbortSignal): Promise<HTMLImageElement[]> {
  return Promise.all(urls.map(u => loadOne(u, signal)))
}
