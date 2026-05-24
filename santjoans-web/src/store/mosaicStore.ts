import { create } from 'zustand'
import type { ZoomModeIdx } from '../config/zoomModes.ts'

interface MosaicState {
  startX: number
  startY: number
  zoomIdx: ZoomModeIdx
  canMoveLeft: boolean
  canMoveRight: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  canZoomIn: boolean
  canZoomOut: boolean
  loadingRemaining: number
  update: (patch: Partial<Omit<MosaicState, 'update' | 'setLoading'>>) => void
  setLoading: (n: number) => void
}

export const useMosaicStore = create<MosaicState>(set => ({
  startX: 0,
  startY: 0,
  zoomIdx: 0,
  canMoveLeft: false,
  canMoveRight: true,
  canMoveUp: false,
  canMoveDown: true,
  canZoomIn: true,
  canZoomOut: false,
  loadingRemaining: 0,
  update: (patch) => set(patch),
  setLoading: (n) => set({ loadingRemaining: n }),
}))
