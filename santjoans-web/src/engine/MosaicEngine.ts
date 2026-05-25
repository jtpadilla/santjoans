import type { ZoomModeIdx } from '../config/zoomModes.ts'
import { ZOOM_MODES, zoomIn, zoomOut, ZOOM_MIN_IDX, ZOOM_MAX_IDX } from '../config/zoomModes.ts'
import { getCurrentScreenType } from '../config/screenType.ts'
import {
  MODEL_MAIN_MAX_COORD_X, MODEL_MAIN_MAX_COORD_Y,
  PIEZE_MAIN_HALF_DIAGONAL,
} from '../config/constants.ts'
import { MainView } from './views/MainView.ts'
import { CenterView } from './views/CenterView.ts'
import type { IView } from './views/IView.ts'
import type { ModelEntry, ViewerContext } from '../model/types.ts'
import { buildTransactionList } from '../loader/transaction.ts'
import { runTransactions } from '../loader/taskScheduler.ts'
import { loadAllSync } from '../loader/syncPiezeLoader.ts'
import type { ProgressCallback } from '../loader/syncPiezeLoader.ts'
import { useMosaicStore } from '../store/mosaicStore.ts'

export type PiezePopupHandler = (pieze: ModelEntry) => void

export class MosaicEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private views: IView[]
  private zoomIdx: ZoomModeIdx = 0
  private startX = 0
  private startY = 0
  private onPiezePopup?: PiezePopupHandler

  // Drag state
  private dragging = false
  private dragInitialPixelX = 0
  private dragInitialPixelY = 0
  private dragInitialStartX = 0
  private dragInitialStartY = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.views = [new MainView(this.ctx), new CenterView(this.ctx)]
    const screen = getCurrentScreenType()
    this.canvas.width = screen.canvasX
    this.canvas.height = screen.canvasY()
  }

  setPopupHandler(handler: PiezePopupHandler): void {
    this.onPiezePopup = handler
  }

  async firstLoad(onProgress: ProgressCallback): Promise<void> {
    this.doSetZoom(0)
    const allTxns = this.views.flatMap(v => buildTransactionList(v, this.getContext()))
    await loadAllSync(allTxns, onProgress)
  }

  // ── Zoom ──────────────────────────────────────────────────────────────────

  setZoom(idx: ZoomModeIdx): void {
    this.doSetZoom(idx)
    this.scheduleLoad()
  }

  zoomInAction(): void { this.setZoom(zoomIn(this.zoomIdx)) }
  zoomOutAction(): void { this.setZoom(zoomOut(this.zoomIdx)) }

  homeAction(): void {
    this.zoomIdx = 0
    this.startX = 0
    this.startY = 0
    this.applyCanvasTransform()
    this.redraw()
    this.notifyStore()
    this.scheduleLoad()
  }

  private doSetZoom(newIdx: ZoomModeIdx): void {
    const oldMode = ZOOM_MODES[this.zoomIdx]
    const newMode = ZOOM_MODES[newIdx]
    this.zoomIdx = newIdx
    // Ajustar posición al centrar en el nuevo zoom
    const xDiff = oldMode.unitWidth - newMode.unitWidth
    const yDiff = oldMode.unitHeight - newMode.unitHeight
    this.doSetPosition(
      this.adjustX(this.startX + Math.trunc(xDiff / 2)),
      this.adjustY(this.startY + Math.trunc(yDiff / 2))
    )
    this.applyCanvasTransform()
  }

  // ── Posición / Pan ────────────────────────────────────────────────────────

  setPosition(x: number, y: number): void {
    this.doSetPosition(this.adjustX(x), this.adjustY(y))
    this.scheduleLoad()
  }

  private doSetPosition(x: number, y: number): void {
    this.startX = x
    this.startY = y
    this.redraw()
    this.notifyStore()
  }

  moveLeft(): void  { this.moveDelta(-ZOOM_MODES[this.zoomIdx].steepX, 0) }
  moveRight(): void { this.moveDelta(+ZOOM_MODES[this.zoomIdx].steepX, 0) }
  moveUp(): void    { this.moveDelta(0, -ZOOM_MODES[this.zoomIdx].steepY) }
  moveDown(): void  { this.moveDelta(0, +ZOOM_MODES[this.zoomIdx].steepY) }

  private moveDelta(dx: number, dy: number): void {
    const nx = this.adjustX(this.startX + dx)
    const ny = this.adjustY(this.startY + dy)
    if (nx === this.startX && ny === this.startY) return
    this.doSetPosition(nx, ny)
    this.scheduleLoad()
  }

  // ── Drag handlers (llamados desde pointer.ts) ─────────────────────────────

  onPointerDown(xPx: number, yPx: number): void {
    this.dragging = true
    this.dragInitialPixelX = xPx
    this.dragInitialPixelY = yPx
    this.dragInitialStartX = this.startX
    this.dragInitialStartY = this.startY
  }

  onPointerMove(xPx: number, yPx: number): void {
    if (!this.dragging) return
    const mode = ZOOM_MODES[this.zoomIdx]
    const screen = getCurrentScreenType()
    const dxMm = Math.trunc(((this.dragInitialPixelX - xPx) * 2 * mode.millimetersWidth) / screen.canvasX)
    const dyMm = Math.trunc(((this.dragInitialPixelY - yPx) * 2 * mode.millimetersHeight) / screen.canvasY())
    const coordDx = Math.trunc(dxMm / PIEZE_MAIN_HALF_DIAGONAL)
    const coordDy = Math.trunc(dyMm / PIEZE_MAIN_HALF_DIAGONAL)
    const nx = this.adjustX(this.dragInitialStartX + coordDx)
    const ny = this.adjustY(this.dragInitialStartY + coordDy)
    if (nx === this.startX && ny === this.startY) return
    this.doSetPosition(nx, ny)
    this.scheduleLoad()
  }

  onPointerUp(): void {
    this.dragging = false
  }

  onDoubleClick(xPx: number, yPx: number): void {
    for (const view of this.views) {
      const pieze = view.getPickedPieze(this.zoomIdx, this.startX, this.startY, xPx, yPx)
      if (pieze) {
        this.onPiezePopup?.(pieze)
        return
      }
    }
  }

  // ── Canmove queries ───────────────────────────────────────────────────────

  canMoveLeft(): boolean  { return this.startX > 0 }
  canMoveRight(): boolean { return this.startX + ZOOM_MODES[this.zoomIdx].unitWidth < MODEL_MAIN_MAX_COORD_X }
  canMoveUp(): boolean    { return this.startY > 0 }
  canMoveDown(): boolean  { return this.startY + ZOOM_MODES[this.zoomIdx].unitHeight < MODEL_MAIN_MAX_COORD_Y }
  canZoomIn(): boolean    { return this.zoomIdx < ZOOM_MAX_IDX }
  canZoomOut(): boolean   { return this.zoomIdx > ZOOM_MIN_IDX }

  handleResize(): void {
    const screen = getCurrentScreenType()
    this.canvas.width  = screen.canvasX
    this.canvas.height = screen.canvasY()
    this.applyCanvasTransform()
    this.redraw()
    this.scheduleLoad()
    this.notifyStore()
  }

  getZoomIdx(): ZoomModeIdx { return this.zoomIdx }
  getStartX(): number { return this.startX }
  getStartY(): number { return this.startY }
  getCanvas(): HTMLCanvasElement { return this.canvas }

  // ── Internos ──────────────────────────────────────────────────────────────

  private getContext(): ViewerContext {
    const mode = ZOOM_MODES[this.zoomIdx]
    return {
      startX: this.startX,
      startY: this.startY,
      endX: this.startX + mode.unitWidth,
      endY: this.startY + mode.unitHeight,
      zoomIdx: this.zoomIdx,
    }
  }

  private redraw(): void {
    const ctx = this.ctx
    const screen = getCurrentScreenType()
    const mode = ZOOM_MODES[this.zoomIdx]
    // Resetear a identidad antes de clearRect: ctx.clearRect aplica el transform activo,
    // pero GWT's clearRect operaba en píxeles ignorando setCoordSize.
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, screen.canvasX, screen.canvasY())
    this.applyCanvasTransform()
    for (const view of this.views) {
      view.updateFromModel(
        mode.getPiezePixels(),
        this.startX, this.startY,
        this.startX + mode.unitWidth,
        this.startY + mode.unitHeight
      )
    }
  }

  private applyCanvasTransform(): void {
    const screen = getCurrentScreenType()
    const mode = ZOOM_MODES[this.zoomIdx]
    // Mapea mm → px, replicando GWTCanvas.setCoordSize
    this.ctx.setTransform(
      screen.canvasX / mode.millimetersWidth,  0,
      0, screen.canvasY() / mode.millimetersHeight,
      0, 0
    )
  }

  private scheduleLoad(): void {
    const ctx = this.getContext()
    const txns = this.views.flatMap(v => buildTransactionList(v, ctx))
    runTransactions(txns)
  }

  private notifyStore(): void {
    useMosaicStore.getState().update({
      startX: this.startX,
      startY: this.startY,
      zoomIdx: this.zoomIdx,
      canMoveLeft: this.canMoveLeft(),
      canMoveRight: this.canMoveRight(),
      canMoveUp: this.canMoveUp(),
      canMoveDown: this.canMoveDown(),
      canZoomIn: this.canZoomIn(),
      canZoomOut: this.canZoomOut(),
    })
  }

  private adjustX(x: number): number {
    if (x < 0) x = 0
    const mode = ZOOM_MODES[this.zoomIdx]
    const over = (x + mode.unitWidth) - MODEL_MAIN_MAX_COORD_X
    return over > 0 ? x - over : x
  }

  private adjustY(y: number): number {
    if (y < 0) y = 0
    const mode = ZOOM_MODES[this.zoomIdx]
    const over = (y + mode.unitHeight) - MODEL_MAIN_MAX_COORD_Y
    return over > 0 ? y - over : y
  }
}
