import { useEffect } from 'react'
import { useHashRoute, navigateTo } from './hooks/useHashRoute.ts'
import { Presentation } from './components/presentation/Presentation.tsx'
import { Navigator } from './components/navigator/Navigator.tsx'
import { loadModels } from './model/modelLoader.ts'
import { preloadInitialTiles } from './loader/preloader.ts'
import { useMosaicStore } from './store/mosaicStore.ts'

let modelsLoaded = false

export default function App() {
  const route = useHashRoute()
  const loadingRemaining = useMosaicStore(s => s.loadingRemaining)
  const setLoading = useMosaicStore(s => s.setLoading)

  useEffect(() => {
    if (modelsLoaded) return
    modelsLoaded = true
    loadModels()
      .then(() => preloadInitialTiles(setLoading))
      .catch(console.error)
  }, [setLoading])

  if (route === 'navigation') {
    return <Navigator />
  }

  return (
    <Presentation
      loadingRemaining={loadingRemaining}
      onEnterNavigator={() => navigateTo('navigation')}
    />
  )
}
