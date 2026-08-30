import type { ReactNode } from 'react'
import type { Locale } from '../types.ts'
import { contentEs } from './es.tsx'
import { contentCa } from './ca.tsx'
import { contentEn } from './en.tsx'
import { contentZh } from './zh.tsx'

export interface PresentationHandlers {
  showLandscape: (src: string) => void
  showPortrait: (src: string) => void
  showFour: (srcs: string[]) => void
}

type ContentFn = (handlers: PresentationHandlers) => ReactNode

const content: Record<Locale, ContentFn> = {
  es: contentEs,
  ca: contentCa,
  en: contentEn,
  zh: contentZh,
}

export function getPresentationContent(locale: Locale, handlers: PresentationHandlers): ReactNode {
  return content[locale](handlers)
}
