import type { ReactNode } from 'react'

interface Handlers {
  showLandscape: (src: string) => void
  showPortrait: (src: string) => void
  showFour: (srcs: string[]) => void
}

export function contentCa({ showLandscape, showPortrait, showFour }: Handlers): ReactNode {
  return (
    <>
      <section className="presentation-block">
        <img
          src="./presentation/palacio_small.png"
          alt="Palau de Santjoans"
          className="presentation-img-left"
          onClick={() => showLandscape('./presentation/palacio_long.png')}
        />
        <p>El palau de Santjoans està situat al centre de <a href="http://www.cinctorres.es" target="_blank" rel="noreferrer">Cinctorres</a>,
        al carrer Sol de la Vila i cantonada amb la Plaça Vella on destaca com a edifici civil
        nobiliari, degut el seu nom a la família noble SantJoan que va ser la més important de
        totes les que va pertànyer l'edifici.</p>
        <p>Aquesta casa té el seu origen al s.XV, tot i que la seva estructura actual és del s.XVII.
        Es tracta d'un palau d'estil aragonès que es troba molt ben conservat externament.
        Consta de dues altures i la seva façana és de pedra, destacant un ràfec <b>doble</b> de fusta.
        També té una torre quadrada amb coberta a quatre aigües que envolta exteriorment l'escala.</p>
        <p>Després de diversos segles de propietat privada, a finals del s.XX va passar a ser propietat
        de l'Excel·lentíssima Diputació de Castelló, que actualment l'ha cedit a l'Ajuntament amb fins de museu i activitats culturals.</p>
      </section>

      <section className="presentation-block">
        <img
          src="./presentation/museo_small.png"
          alt="Museu"
          className="presentation-img-right"
          onClick={() => showLandscape('./presentation/museo_long.png')}
        />
        <p>La <b>planta baixa</b> és utilizzada per albergar la col·lecció museogràfica permanent
        composta per peces paleontològiques procedents del jaciment paleontològic <a href="http://www.dinomania.es" target="_blank" rel="noreferrer">Ana</a>.</p>
        <p>Aquest jaciment va ser descobert l'any 1998 pel geòleg cinctorrano Ramón Ortí,
        però no va ser fins l'any 2002 quan s'actua sobre ell.
        Més de 500 fòssils han estat recuperats en les diverses campanyes d'excavacions realitzades fins a la data.
        La seva història, les seves troballes i les seves particularitats fan d'ANA un jaciment singular,
        que està donant molts fruits científics plasmats en els treballs publicats fins a la data.</p>
      </section>

      <section className="presentation-block">
        <img
          src="./presentation/piezas_small.png"
          alt="Peces"
          className="presentation-img-left"
          onClick={() => showPortrait('./presentation/piezas_long.png')}
        />
        <p>A la <b>planta superior</b> s'accedeix mitjançant una escala amb fusta riquement treballada,
        la qual està envoltada pels{' '}
          <span
            className="presentation-link"
            onClick={() => showFour([
              './presentation/escudo1_long.png',
              './presentation/escudo2_long.png',
              './presentation/escudo3_long.png',
              './presentation/escudo4_long.png',
            ])}
          >escuts heràldics en policromia</span>{' '}
        dels diversos habitants que hi han viscut.</p>
        <p>Al sostre de l'escala trobem{' '}
          <span
            className="presentation-link"
            onClick={() => showLandscape('./presentation/escudo0_long.png')}
          >un altre escut</span>{' '}
        de forma ovoidea amb les diferents armes de totes les branques de la família
        en diferents èpoques i que és molt interessant.</p>
        <p>A l'antesala del saló noble s'aprecia un retaule de ceràmica en el paviment, del que falten diverses peces, que bé pot
        ser la imatge de <a href="http://es.wikipedia.org/wiki/Luis_Bertr%C3%A1n" target="_blank" rel="noreferrer">Sant Lluís Bertran</a>.
        A un costat del retaule es veu la figura d'un{' '}
          <span className="presentation-link" onClick={() => showPortrait('./presentation/indio.png')}>indio en oració</span>.
        </p>
        <p>El saló principal està cobert per un paviment decorat amb figures zoo-mòrfiques. Al centre,
        com un retaule, l'escut heràldic amb les armes de Sanjoan i Sousa, aquest últim d'origen portuguès.
        Francisco Javier Sanjoan i Penarroja, de qui porta el nom l'escut, era natural de Cinctorres i
        molt recordat per la seva lluita contra els invasors francesos.</p>
      </section>

      <section className="presentation-block">
        <p>El <b>paviment</b> està fabricat a les reials fàbriques de València a la segona meitat del s.XVIII.
        Són rajoletes treballades amb la tècnica mil·lenària
        anomenada <a href="http://es.wikipedia.org/wiki/May%C3%B3lica" target="_blank" rel="noreferrer">Majòlica</a>.
        Les figures representades són extretes de les vinyetes de diverses{' '}
          <a href="http://es.wikipedia.org/wiki/Auca" target="_blank" rel="noreferrer">Auques</a>{' '}
        editades per Agustín Laborda
        al seu taller de València (Del Sol i la Lluna 1752, Animals terrestres 1760, Animals aquàtics 1780 i d'Aus 1790).
        Totes elles tenen la mateixa característica, reprodueixen la figura d'un sol animal en l'hàbitat de l'espècie representada.</p>
      </section>
    </>
  )
}
