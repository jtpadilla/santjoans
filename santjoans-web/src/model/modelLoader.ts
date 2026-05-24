import type { PiezeData } from './types.ts'
import { mainModel, centerModel } from './modelDirectory.ts'

export async function loadModels(): Promise<void> {
  const res = await fetch('./piezes/piezes.json')
  if (!res.ok) throw new Error(`Error cargando piezes.json: ${res.status}`)
  const piezes: PiezeData[] = await res.json()
  for (const p of piezes) {
    if (p.class === 'main') {
      mainModel.addPieze(p.name, p.x, p.y, p.miniature_rotation, p.detail_rotation)
    } else {
      centerModel.addPieze(p.name, p.x, p.y, p.miniature_rotation, p.detail_rotation)
    }
  }
}
