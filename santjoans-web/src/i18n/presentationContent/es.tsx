import type { ReactNode } from 'react'

interface Handlers {
  showLandscape: (src: string) => void
  showPortrait: (src: string) => void
  showFour: (srcs: string[]) => void
}

export function contentEs({ showLandscape, showPortrait, showFour }: Handlers): ReactNode {
  return (
    <>
      <section className="presentation-block">
        <img
          src="./presentation/palacio_small.png"
          alt="Palacio de Santjoans"
          className="presentation-img-left"
          onClick={() => showLandscape('./presentation/palacio_long.png')}
        />
        <p>El palacio de Santjoans está situado en el centro de <a href="http://www.cinctorres.es" target="_blank" rel="noreferrer">Cinctorres</a>,
        en la calle Sol de la Vila y esquina con la Plaza Vieja donde destaca como edificio civil
        nobiliario, debiendo su nombre a la familia noble SantJoan que fue la más importante de
        todas a las que perteneció el edificio.</p>
        <p>Esta casa tiene su origen en el s.XV, aunque su estructura actual es del s.XVII.
        Se trata de un palacio de estilo aragonés que se encuentra muy bien conservado externamente.
        Consta de dos alturas y su fachada es de piedra, despuntando un alero <b>doble</b> de madera.
        También tiene una torre cuadrada con cubierta a cuatro aguas que envuelve exteriormente la escalera.</p>
        <p>Después de varios siglos de propiedad privada, a finales del s.XX pasó a ser propiedad
        de la Excelentísima Diputación de Castellón, que actualmente lo ha cedido al Ayuntamiento con fines de museo y actividades culturales.</p>
      </section>

      <section className="presentation-block">
        <img
          src="./presentation/museo_small.png"
          alt="Museo"
          className="presentation-img-right"
          onClick={() => showLandscape('./presentation/museo_long.png')}
        />
        <p>La <b>planta inferior</b> es utilizada para albergar la colección museográfica permanente
        compuesta por piezas paleontológicas procedentes del yacimiento paleontológico <a href="http://www.dinomania.es" target="_blank" rel="noreferrer">Ana</a>.</p>
        <p>Este yacimiento fue descubierto en el año 1998 por el geólogo cinctorrano Ramón Ortí,
        pero no fue hasta el año 2002 cuando se actúa sobre él.
        Mas de 500 fósiles han sido recuperados en las diversas campañas de excavaciones realizadas hasta la fecha.
        Su historia, sus hallazgos y sus particularidades hacen de ANA un yacimiento singular,
        que está dando muchos frutos científicos plasmados en los trabajos publicados hasta la fecha.</p>
      </section>

      <section className="presentation-block">
        <img
          src="./presentation/piezas_small.png"
          alt="Piezas"
          className="presentation-img-left"
          onClick={() => showPortrait('./presentation/piezas_long.png')}
        />
        <p>A la <b>planta superior</b> se accede mediante una escalera con madera ricamente trabajada,
        la cual está rodeada por los{' '}
          <span
            className="presentation-link"
            onClick={() => showFour([
              './presentation/escudo1_long.png',
              './presentation/escudo2_long.png',
              './presentation/escudo3_long.png',
              './presentation/escudo4_long.png',
            ])}
          >escudos heráldicos en policromía</span>{' '}
        de los diversos habitantes que allí han vivido.</p>
        <p>En el techo de la escalera encontramos{' '}
          <span
            className="presentation-link"
            onClick={() => showLandscape('./presentation/escudo0_long.png')}
          >otro escudo</span>{' '}
        de forma ovoidal con las diferentes armas de todas las ramas de la familia
        en diferentes épocas y que es muy interesante.</p>
        <p>En la antesala del salón noble se aprecia un retablo de cerámica en el pavimento, del que faltan varias piezas, que bien puede
        ser la imagen de <a href="http://es.wikipedia.org/wiki/Luis_Bertr%C3%A1n" target="_blank" rel="noreferrer">San Luis Beltrán</a>.
        En un lado del retablo se ve la figura de un{' '}
          <span className="presentation-link" onClick={() => showPortrait('./presentation/indio.png')}>indio en oración</span>.
        </p>
        <p>El salón principal está cubierto por un pavimento decorado con figuras zoo-mórficas. En el centro,
        como un retablo, el escudo heráldico con las armas de Sanjoan y Sousa, éste último de origen portugués.
        Francisco Javier Sanjoan y Penarroja, de quien lleva el nombre el escudo, era natural de Cinctorres y
        muy recordado por su lucha contra los invasores franceses.</p>
      </section>

      <section className="presentation-block">
        <p>El <b>pavimento</b> está fabricado en las reales fábricas de Valencia en la segunda mitad del s.XVIII.
        Son azulejos trabajados con la técnica milenaria
        llamada <a href="http://es.wikipedia.org/wiki/May%C3%B3lica" target="_blank" rel="noreferrer">Mayólica</a>.
        Las figuras representadas son extraídas de las viñetas de diferentes{' '}
          <a href="http://es.wikipedia.org/wiki/Auca" target="_blank" rel="noreferrer">Aucas</a>{' '}
        editadas por Agustín Laborda
        en su taller de Valencia (Del Sol y Luna 1752, Animales terrestres 1760, Animales acuáticos 1780 y de Aves 1790).
        Todas ellas tiene la misma característica, reproducen la figura de un solo animal en el hábitat de la especie representada.</p>
      </section>
    </>
  )
}
