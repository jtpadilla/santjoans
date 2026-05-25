import type { PiezeData } from './types.ts'
import { mainModel, centerModel } from './modelDirectory.ts'

export async function loadModels(): Promise<void> {
  const res = await fetch('./piezes/piezes.json')
  if (!res.ok) throw new Error(`Error cargando piezes.json: ${res.status}`)
  const piezes: PiezeData[] = await res.json()
  for (const p of piezes) {
    const x = Number(p.x)
    const y = Number(p.y)
    const minRot = Number(p.miniature_rotation)
    const detRot = Number(p.detail_rotation)
    if (p.class === 'main') {
      mainModel.addPieze(p.name, x, y, minRot, detRot)
    } else {
      centerModel.addPieze(p.name, x, y, minRot, detRot)
    }
  }
}
