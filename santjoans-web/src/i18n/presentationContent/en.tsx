import type { ReactNode } from 'react'

interface Handlers {
  showLandscape: (src: string) => void
  showPortrait: (src: string) => void
  showFour: (srcs: string[]) => void
}

export function contentEn({ showLandscape, showPortrait, showFour }: Handlers): ReactNode {
  return (
    <>
      <section className="presentation-block">
        <img
          src="./presentation/palacio_small.png"
          alt="Santjoans Palace"
          className="presentation-img-left"
          onClick={() => showLandscape('./presentation/palacio_long.jpg')}
        />
        <p>The Santjoans Palace is located in the heart of <a href="http://www.cinctorres.es" target="_blank" rel="noreferrer">Cinctorres</a>,
        on Carrer del Sol de la Vila, at the corner of the old town square. It stands out as a noble
        civic building and takes its name from the SantJoan noble family, the most prominent of all
        those who owned the building.</p>
        <p>The house dates back to the 15th century, although its current structure is from the 17th century.
        It is an Aragonese-style palace in excellent external condition.
        It has two floors and a stone façade, featuring a distinctive <b>double</b> wooden eave.
        It also has a square tower with a hip roof enclosing the exterior staircase.</p>
        <p>After several centuries of private ownership, in the late 20th century it passed to the
        Diputación Provincial de Castellón, which has since entrusted it to the local council for use as a museum and cultural venue.</p>
      </section>

      <section className="presentation-block">
        <img
          src="./presentation/museo_small.png"
          alt="Museum"
          className="presentation-img-right"
          onClick={() => showLandscape('./presentation/museo_long.png')}
        />
        <p>The <b>ground floor</b> houses a permanent museographic collection of
        palaeontological pieces from the <a href="http://www.dinomania.es" target="_blank" rel="noreferrer">Ana</a> fossil site.</p>
        <p>This site was discovered in 1998 by local geologist Ramón Ortí,
        but excavation work did not begin until 2002.
        More than 500 fossils have been recovered during various campaigns to date.
        Its history, findings and singularities make ANA a remarkable site
        that continues to produce scientific results reflected in published research.</p>
      </section>

      <section className="presentation-block">
        <img
          src="./presentation/piezas_small.png"
          alt="Tiles"
          className="presentation-img-left"
          onClick={() => showPortrait('./presentation/piezas_long.jpg')}
        />
        <p>The <b>upper floor</b> is reached via a richly carved wooden staircase,
        surrounded by the{' '}
          <span
            className="presentation-link"
            onClick={() => showFour([
              './presentation/escudo1_long.jpg',
              './presentation/escudo2_long.jpg',
              './presentation/escudo3_long.jpg',
              './presentation/escudo4_long.jpg',
            ])}
          >polychrome heraldic shields</span>{' '}
        of the various families who lived there.</p>
        <p>On the ceiling above the staircase there is{' '}
          <span
            className="presentation-link"
            onClick={() => showLandscape('./presentation/escudo0_long.jpg')}
          >another shield</span>,{' '}
        oval in shape, displaying the arms of all branches of the family
        across different eras — a very interesting piece.</p>
        <p>In the antechamber of the main hall there is a ceramic altarpiece in the floor, with several tiles missing, believed to depict{' '}
        <a href="http://es.wikipedia.org/wiki/Luis_Bertr%C3%A1n" target="_blank" rel="noreferrer">Saint Louis Bertrand</a>.
        On one side of the altarpiece the figure of a{' '}
          <span className="presentation-link" onClick={() => showPortrait('./presentation/indio.jpg')}>Native American in prayer</span>{' '}
        is visible.
        </p>
        <p>The main hall is covered by a floor decorated with zoo-morphic figures. At the centre,
        like an altarpiece, stands the heraldic shield with the arms of Sanjoan and Sousa, the latter of Portuguese origin.
        Francisco Javier Sanjoan y Penarroja, after whom the shield is named, was a native of Cinctorres and
        is fondly remembered for his resistance against French invaders.</p>
      </section>

      <section className="presentation-block">
        <p>The <b>floor</b> was manufactured in the Royal Factories of Valencia in the second half of the 18th century.
        The tiles were worked using the age-old technique known
        as <a href="http://es.wikipedia.org/wiki/May%C3%B3lica" target="_blank" rel="noreferrer">Majolica</a>.
        The figures depicted are drawn from the vignettes of various{' '}
          <a href="http://es.wikipedia.org/wiki/Auca" target="_blank" rel="noreferrer">illustrated broadsides</a>{' '}
        published by Agustín Laborda
        at his workshop in Valencia (Sun and Moon 1752, Land Animals 1760, Aquatic Animals 1780, and Birds 1790).
        All of them share the same characteristic: they portray a single animal in its natural habitat.</p>
      </section>
    </>
  )
}
