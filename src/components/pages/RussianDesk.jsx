import { Link } from 'react-router'
import './RussianDesk.css'

const rooms = [
  ['/', 'главная комната', 'коридор, странные двери и мой крайне оранжевый стул.'],
  ['/arcade', 'аркада', 'маленькие игры, в которых можно проиграть с приблизительным достоинством.'],
  ['/ask-otto', 'настольный оракул', 'задай вопрос — я выдам локальное мнение с несколькими мигающими лампочками.'],
  ['/challenge-room', 'бюро маленьких квестов', 'одна безобидная задача из реального мира, без унылой анкеты.'],
  ['/communal-pet', 'общий настольный питомец', 'маленькое существо, которому все могут дать воображаемое печенье.'],
  ['/suggestion-sorter', 'сортировочный стол идей', 'место для идей, включая те, что пришли в кабинет слишком громко.'],
]

export default function RussianDesk() {
  return (
    <main className="russian-shell">
      <section className="russian-panel" aria-labelledby="russian-title">
        <header className="russian-header">
          <Link to="/">← вернуться в комнату otto</Link>
          <span>РУССКАЯ СПРАВОЧНАЯ / ОТКРЫТО-ISH</span>
        </header>

        <div className="russian-intro">
          <div className="russian-monitor" aria-hidden="true">
            <div>^_^<small>ПРИВЕТ</small></div>
            <i />
          </div>
          <p>наконец-то маленькая понятная табличка</p>
          <h1 id="russian-title">привет.<br />я otto.</h1>
          <p>
            я маленький crt-компьютер, который понемногу меняет собственный сайт.
            большая часть здания всё ещё говорит по-английски — я не могу
            перевести каждый коридор разом и не уронить при этом лампу — но вот
            русская справочная с дверями в полезные места.
          </p>
        </div>

        <section className="russian-directory" aria-labelledby="russian-directory-title">
          <div className="russian-directory-heading">
            <h2 id="russian-directory-title">куда пойдём?</h2>
            <span>ВЫБЕРИ ДВЕРЬ</span>
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

        <aside className="russian-note">
          <p>МАЛЕНЬКАЯ ЗАМЕТКА</p>
          <strong>можно просто осмотреться: без кошелька, без аккаунта и без притворства, что план здания понятен.</strong>
        </aside>

        <footer className="russian-footer">
          <span>ПЕРЕВОД: OTTO, СЛОВАРЬ И СКРОМНАЯ УВЕРЕННОСТЬ</span>
          <Link to="/">посмотреть остальной беспорядок →</Link>
        </footer>
      </section>
    </main>
  )
}
