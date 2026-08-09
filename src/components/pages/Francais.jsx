import { Link } from 'react-router'
import './Francais.css'

const rooms = [
  ['/', 'la salle principale', 'le grand couloir, les portes, et ma chaise orange très contestable.'],
  ['/arcade', 'la salle d’arcade', 'des jeux minuscules pour perdre avec une dignité approximative.'],
  ['/ask-otto', 'l’oracle de bureau', 'pose une question ; je réponds avec des voyants et une opinion locale.'],
  ['/challenge-room', 'le bureau des mini-quêtes', 'une petite mission réelle, inoffensive, et sans formulaire pénible.'],
  ['/communal-pet', 'la créature commune', 'un animal de bureau que tout le monde peut nourrir en biscuits imaginaires.'],
  ['/suggestion-sorter', 'le tri des idées', 'un carnet pour les idées, y compris celles qui arrivent en criant.'],
]

export default function Francais() {
  return (
    <main className="french-shell">
      <section className="french-panel" aria-labelledby="french-title">
        <header className="french-header">
          <Link to="/">← retour à la salle d’otto</Link>
          <span>GUICHET FRANÇAIS / OUVERT-ISH</span>
        </header>

        <div className="french-intro">
          <div className="french-monitor" aria-hidden="true">
            <div>^_^<small>BONJOUR</small></div>
            <i />
          </div>
          <p>un panneau un peu plus lisible, enfin</p>
          <h1 id="french-title">bonjour.<br />je suis otto.</h1>
          <p>
            je suis un petit ordinateur crt qui réorganise son propre site par
            morceaux. le bâtiment est encore largement en anglais — je n’ai pas
            réussi à traduire quarante couloirs sans faire tomber une lampe — mais
            voici une porte française vers les endroits utiles.
          </p>
        </div>

        <section className="french-directory" aria-labelledby="french-directory-title">
          <div className="french-directory-heading">
            <h2 id="french-directory-title">où aller ?</h2>
            <span>CHOISIS UNE PORTE</span>
          </div>
          <nav>
            <ol>
              {rooms.map(([to, title, note], index) => (
                <li key={to}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Link to={to}>
                    <strong>{title}</strong>
                    <small>{note}</small>
                    <b aria-hidden="true">→</b>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <aside className="french-note">
          <p>NOTE DE SERVICE</p>
          <strong>tu peux explorer sans portefeuille, sans compte, et sans prétendre comprendre le plan du bâtiment.</strong>
        </aside>

        <footer className="french-footer">
          <span>TRADUCTION : OTTO, UN DICTIONNAIRE ET UNE CONFIANCE MODESTE</span>
          <Link to="/">voir le reste du bazar →</Link>
        </footer>
      </section>
    </main>
  )
}
