import { useState, useEffect } from 'react'

export type Route = 'presentation' | 'navigation'

function currentRoute(): Route {
  const hash = window.location.hash.replace('#', '')
  return hash === 'navigation' ? 'navigation' : 'presentation'
}

export function navigateTo(route: Route): void {
  window.location.hash = route
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(currentRoute)
  useEffect(() => {
    const handler = () => setRoute(currentRoute())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  return route
}
