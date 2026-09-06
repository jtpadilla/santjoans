import type { Locale } from './types.ts'

export interface Messages {
  appTitle: string
  loading: string
  loadingWithCount: (n: number) => string
  enterMural: string
  infoProject: string
  authorIndex: string
  altUp: string
  altDown: string
  altLeft: string
  altRight: string
  altHome: string
  altZoomIn: string
  altZoomOut: string
  altHelp: string
  helpTitle: string
  helpItem1: string
  helpItem2: string
  helpItem3: string
  helpItem4: string
  helpItem5: string
  helpClose: string
}

const es: Messages = {
  appTitle:         'Cerámica Zoo-Mórfica del palacio de Santjoans',
  loading:          'Cargando piezas…',
  loadingWithCount: (n) => `Cargando piezas… (${n} restantes)`,
  enterMural:       'Ver pavimento',
  infoProject:      'Información del proyecto',
  authorIndex:      'Toda la obra de la autora',
  altUp:     'Arriba',
  altDown:   'Abajo',
  altLeft:   'Izquierda',
  altRight:  'Derecha',
  altHome:   'Inicio',
  altZoomIn:  'Ampliar',
  altZoomOut: 'Reducir',
  altHelp:   'Ayuda',
  helpTitle:  'Ayuda de navegación',
  helpItem1:  'Usa los botones direccionales para mover el mosaico.',
  helpItem2:  'Usa los botones de zoom (+/−) para ampliar o reducir.',
  helpItem3:  'Arrastra el mosaico con el ratón para moverte.',
  helpItem4:  'Doble clic en una pieza para ver el detalle.',
  helpItem5:  'Arrastra el rectángulo del minimapa para cambiar la posición.',
  helpClose:  'Cerrar',
}

const ca: Messages = {
  appTitle:         'Ceràmica Zoo-Mòrfica del palau de Santjoans',
  loading:          'Carregant peces…',
  loadingWithCount: (n) => `Carregant peces… (${n} restants)`,
  enterMural:       'Veure el paviment',
  infoProject:      'Informació del projecte',
  authorIndex:      'Tota l’obra de l’autora',
  altUp:     'Amunt',
  altDown:   'Avall',
  altLeft:   'Esquerra',
  altRight:  'Dreta',
  altHome:   'Inici',
  altZoomIn:  'Ampliar',
  altZoomOut: 'Reduir',
  altHelp:   'Ajuda',
  helpTitle:  'Ajuda de navegació',
  helpItem1:  'Usa els botons direccionals per moure el mosaic.',
  helpItem2:  'Usa els botons de zoom (+/−) per ampliar o reduir.',
  helpItem3:  'Arrossega el mosaic amb el ratolí per moure\'t.',
  helpItem4:  'Doble clic en una peça per veure el detall.',
  helpItem5:  'Arrossega el rectangle del minimapa per canviar la posició.',
  helpClose:  'Tancar',
}

const en: Messages = {
  appTitle:         'Zoo-Morphic Ceramics of the Santjoans Palace',
  loading:          'Loading tiles…',
  loadingWithCount: (n) => `Loading tiles… (${n} remaining)`,
  enterMural:       'View floor',
  infoProject:      'Project information',
  authorIndex:      'All the author’s work',
  altUp:     'Up',
  altDown:   'Down',
  altLeft:   'Left',
  altRight:  'Right',
  altHome:   'Home',
  altZoomIn:  'Zoom in',
  altZoomOut: 'Zoom out',
  altHelp:   'Help',
  helpTitle:  'Navigation help',
  helpItem1:  'Use the directional buttons to move the mosaic.',
  helpItem2:  'Use the zoom buttons (+/−) to zoom in or out.',
  helpItem3:  'Drag the mosaic with the mouse to navigate.',
  helpItem4:  'Double-click a tile to see the detail view.',
  helpItem5:  'Drag the minimap rectangle to change position.',
  helpClose:  'Close',
}

const zh: Messages = {
  appTitle:         'Santjoans 宫的动物纹样瓷砖',
  loading:          '正在加载瓷砖…',
  loadingWithCount: (n) => `正在加载瓷砖…（剩余 ${n} 块）`,
  enterMural:       '查看地面',
  infoProject:      '项目信息',
  authorIndex:      '作者的全部作品',
  altUp:     '上',
  altDown:   '下',
  altLeft:   '左',
  altRight:  '右',
  altHome:   '初始位置',
  altZoomIn:  '放大',
  altZoomOut: '缩小',
  altHelp:   '帮助',
  helpTitle:  '操作说明',
  helpItem1:  '使用方向按钮移动马赛克。',
  helpItem2:  '使用缩放按钮（+/−）放大或缩小。',
  helpItem3:  '用鼠标拖动马赛克即可移动。',
  helpItem4:  '双击某块瓷砖可查看细节。',
  helpItem5:  '拖动小地图中的矩形可改变位置。',
  helpClose:  '关闭',
}

export const messages: Record<Locale, Messages> = { es, ca, en, zh }
