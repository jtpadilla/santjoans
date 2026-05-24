import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'fs'
import { XMLParser } from 'fast-xml-parser'
import path from 'path'

function piezesXmlToJsonPlugin() {
  return {
    name: 'piezes-xml-to-json',
    buildStart() {
      const xmlPath = path.resolve(__dirname, '../santjoans/src/santjoans/public/piezes/piezes.xml')
      const outPath = path.resolve(__dirname, 'public/piezes/piezes.json')
      const xml = readFileSync(xmlPath, 'utf-8')
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
      const parsed = parser.parse(xml)
      const layout = parsed.layout
      const main: unknown[] = [].concat(layout.main?.mainpieze ?? [])
      const center: unknown[] = [].concat(layout.center?.centerpieze ?? [])
      const piezes = [
        ...main.map((p: any) => ({ ...p, class: 'main' })),
        ...center.map((p: any) => ({ ...p, class: 'center' })),
      ]
      writeFileSync(outPath, JSON.stringify(piezes, null, 2))
      console.log(`[piezes] converted ${piezes.length} pieces → public/piezes/piezes.json`)
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), piezesXmlToJsonPlugin()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
