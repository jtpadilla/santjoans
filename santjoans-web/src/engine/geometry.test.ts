import { describe, it, expect } from 'vitest'
import {
  isEven, isOdd, isValidMainCoord, isIntoCenterCoord,
  mainXtoCenterX, mainYtoCenterY,
  getRadians, millimeterToCoordX, millimeterToCoordXRest,
} from './geometry.ts'

describe('isEven / isOdd', () => {
  it('identifica pares e impares', () => {
    expect(isEven(0)).toBe(true)
    expect(isEven(4)).toBe(true)
    expect(isOdd(3)).toBe(true)
    expect(isOdd(1)).toBe(true)
    expect(isEven(3)).toBe(false)
  })
})

describe('isValidMainCoord', () => {
  it('par-Y + impar-X fuera de zona central es válida', () => {
    // y=2 (par), x=1 (impar) → válida, fuera del centro
    expect(isValidMainCoord(1, 2)).toBe(true)
  })
  it('impar-Y + par-X fuera de zona central es válida', () => {
    // y=1 (impar), x=2 (par) → válida
    expect(isValidMainCoord(2, 1)).toBe(true)
  })
  it('par-Y + par-X es inválida', () => {
    expect(isValidMainCoord(2, 2)).toBe(false)
  })
  it('impar-Y + impar-X es inválida', () => {
    expect(isValidMainCoord(1, 1)).toBe(false)
  })
  it('coordenada en zona central es inválida', () => {
    // MODEL_CENTER_START_X=21, END_X=35, START_Y=7, END_Y=17
    // x=22(par)+y=9(impar) → dentro zona central → inválida
    expect(isValidMainCoord(22, 9)).toBe(false)
  })
})

describe('isIntoCenterCoord', () => {
  it('dentro de la zona central', () => {
    expect(isIntoCenterCoord(25, 10)).toBe(true)
  })
  it('en el límite START es dentro', () => {
    expect(isIntoCenterCoord(21, 7)).toBe(true)
  })
  it('en el límite END es fuera (exclusivo)', () => {
    expect(isIntoCenterCoord(35, 17)).toBe(false)
  })
  it('fuera de la zona central', () => {
    expect(isIntoCenterCoord(5, 5)).toBe(false)
  })
})

describe('mainXtoCenterX / mainYtoCenterY', () => {
  it('transforma coord main a coord center', () => {
    // mainX=21 → (21-21)*0.714=0
    expect(mainXtoCenterX(21)).toBe(0)
    // mainX=35 → (35-21)*0.7142857142857143=10.0 → trunc=10
    expect(mainXtoCenterX(35)).toBe(10)
  })
  it('transforma coordY main a center', () => {
    // mainY=7 → 0
    expect(mainYtoCenterY(7)).toBe(0)
    // mainY=17 → (17-7)*0.7=7
    expect(mainYtoCenterY(17)).toBe(7)
  })
})

describe('getRadians', () => {
  it('0 grados → 0 rad', () => expect(getRadians(0)).toBe(0))
  it('180 grados → π', () => expect(getRadians(180)).toBeCloseTo(Math.PI))
  it('360 grados → 2π', () => expect(getRadians(360)).toBeCloseTo(2 * Math.PI))
  it('45 grados → π/4', () => expect(getRadians(45)).toBeCloseTo(Math.PI / 4))
})

describe('millimeterToCoordX / Rest', () => {
  // PIEZE_MAIN_HALF_DIAGONAL = 141.421...
  it('0mm → coord 0', () => expect(millimeterToCoordX(0)).toBe(0))
  it('141mm → coord 0 (menor que medio diagonal)', () => expect(millimeterToCoordX(141)).toBe(0))
  it('142mm → coord 1', () => expect(millimeterToCoordX(142)).toBe(1))
  it('283mm → coord 2', () => expect(millimeterToCoordX(283)).toBe(2))
  it('rest de 200mm', () => {
    // 200 / 141.42 = 1 resto 58.57 → trunc = 58
    expect(millimeterToCoordXRest(200)).toBe(58)
  })
})
