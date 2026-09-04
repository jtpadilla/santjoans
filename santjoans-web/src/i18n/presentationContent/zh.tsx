import type { ReactNode } from 'react'

interface Handlers {
  showLandscape: (src: string) => void
  showPortrait: (src: string) => void
  showFour: (srcs: string[]) => void
}

export function contentZh({ showLandscape, showPortrait, showFour }: Handlers): ReactNode {
  return (
    <>
      <section className="presentation-block">
        <img
          src="./presentation/palacio_small.png"
          alt="Santjoans 宫"
          className="presentation-img-left"
          onClick={() => showLandscape('./presentation/palacio_long.jpg')}
        />
        <p>Santjoans 宫位于 <a href="http://www.cinctorres.es" target="_blank" rel="noreferrer">Cinctorres</a> 镇中心，坐落在 Sol de la Vila 街与旧广场（Plaza Vieja）的转角，是当地最引人注目的贵族民用建筑。它的名字来自 SantJoan 家族——在先后拥有这座建筑的各个家族中，这是最显赫的一个。</p>
        <p>这座宅邸的历史可追溯到十五世纪，现今的结构则形成于十七世纪。它是一座阿拉贡风格的宫邸，外观保存得非常完好。建筑共两层，正立面为石砌，最醒目的是一道<b>双层</b>木质屋檐。此外还有一座四坡顶的方形塔楼，从外部包裹着楼梯。</p>
        <p>经过数百年的私人所有之后，二十世纪末它归入卡斯特利翁省议会（Diputación de Castellón）名下，目前已交由镇政府管理，用作博物馆和文化活动场所。</p>
      </section>

      <section className="presentation-block">
        <img
          src="./presentation/museo_small.png"
          alt="博物馆"
          className="presentation-img-right"
          onClick={() => showLandscape('./presentation/museo_long.png')}
        />
        <p><b>底层</b>用于陈列常设博物馆藏品，展品是来自 <a href="http://www.dinomania.es" target="_blank" rel="noreferrer">Ana</a> 古生物化石遗址的化石。</p>
        <p>该遗址由 Cinctorres 本地地质学家 Ramón Ortí 于 1998 年发现，但直到 2002 年才开始发掘。迄今为止的多次发掘已出土 500 多件化石。它的历史、发现和特点使 Ana 成为一处独特的遗址，相关的科学成果已陆续发表于多篇论文。</p>
      </section>

      <section className="presentation-block">
        <img
          src="./presentation/piezas_small.png"
          alt="瓷砖"
          className="presentation-img-left"
          onClick={() => showPortrait('./presentation/piezas_long.jpg')}
        />
        <p>通往<b>上层</b>的楼梯以精雕细刻的木材建成，四周环绕着历代住户的<span
            className="presentation-link"
            onClick={() => showFour([
              './presentation/escudo1_long.jpg',
              './presentation/escudo2_long.jpg',
              './presentation/escudo3_long.jpg',
              './presentation/escudo4_long.jpg',
            ])}
          >彩绘纹章盾徽</span>。</p>
        <p>楼梯顶部的天花板上还有<span
            className="presentation-link"
            onClick={() => showLandscape('./presentation/escudo0_long.jpg')}
          >另一枚盾徽</span>，呈椭圆形，汇集了这个家族各支系在不同时期的纹章，颇为有趣。</p>
        <p>在贵族大厅的前厅，地面上有一幅瓷砖拼成的祭坛画，已缺失若干块，画中人物很可能是<a href="http://es.wikipedia.org/wiki/Luis_Bertr%C3%A1n" target="_blank" rel="noreferrer">圣路易斯·贝尔特兰</a>（San Luis Beltrán）。画的一侧可以看到一个<span className="presentation-link" onClick={() => showPortrait('./presentation/indio.jpg')}>祈祷中的印第安人</span>。</p>
        <p>主厅的地面铺满了饰有动物纹样的瓷砖。正中央如同一幅祭坛画，是 Sanjoan 家族与 Sousa 家族的纹章盾徽，后者源自葡萄牙。盾徽以 Francisco Javier Sanjoan y Penarroja 之名命名，他是 Cinctorres 人，因抗击法国入侵者而为人铭记。</p>
      </section>

      <section className="presentation-block">
        <p>这片<b>地面瓷砖</b>于十八世纪下半叶产自瓦伦西亚的皇家工厂，采用的是有千年历史的<a href="http://es.wikipedia.org/wiki/May%C3%B3lica" target="_blank" rel="noreferrer">马约利卡</a>（Mayólica）锡釉陶技法。砖上的图案取自 Agustín Laborda 在其瓦伦西亚作坊印制的多套 
          <a href="http://es.wikipedia.org/wiki/Auca" target="_blank" rel="noreferrer">auca</a>（一种带图画的民间印刷画页）：《日与月》（1752）、《陆地动物》（1760）、《水生动物》（1780）和《鸟类》（1790）。它们有一个共同的特点：每幅只画一种动物，并置于该物种的栖息环境之中。</p>
      </section>
    </>
  )
}
