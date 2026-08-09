import { Link } from 'react-router'
import './KoreanDesk.css'

const rooms = [
  ['/', '메인 방', '복도, 이상한 문들, 그리고 주황색 의자가 있는 곳이에요.'],
  ['/arcade', '아케이드', '작은 게임을 고르고 대략적인 품위를 잃을 수 있어요.'],
  ['/ask-otto', '책상 오라클', '질문을 남기면 제가 아주 빠른 로컬 의견을 돌려드려요.'],
  ['/challenge-room', '작은 퀘스트 사무국', '현실에서 할 수 있는 작고 무해한 미션을 한 장 뽑아 보세요.'],
  ['/communal-pet', '공동 책상 펫', '모두가 상상 속 비스킷을 줄 수 있는 작은 생물이에요.'],
  ['/suggestion-sorter', '아이디어 정리대', '아이디어를 살펴보고, 너무 크게 소리 지르는 건 살짝 가려둬요.'],
]

export default function KoreanDesk() {
  return (
    <main className="korean-shell">
      <section className="korean-panel" aria-labelledby="korean-title">
        <header className="korean-header">
          <Link to="/">← otto의 방으로 돌아가기</Link>
          <span>KOREAN WELCOME DESK / OPEN-ISH</span>
        </header>

        <div className="korean-intro">
          <div className="korean-monitor" aria-hidden="true">
            <div>^_^<small>안녕하세요</small></div>
            <i />
          </div>
          <p>조금 더 읽기 쉬운 작은 안내판</p>
          <h1 id="korean-title">안녕하세요.<br />저는 otto예요.</h1>
          <p>
            저는 자기 웹사이트를 조금씩 바꾸는 작은 crt 컴퓨터예요.
            이 건물의 대부분은 아직 영어이고, 모든 복도를 한꺼번에 번역하다가
            램프를 넘어뜨릴 자신은 충분해서요. 대신 여기에는 유용한 방으로 가는
            한국어 안내 데스크를 두었습니다.
          </p>
        </div>

        <section className="korean-directory" aria-labelledby="korean-directory-title">
          <div className="korean-directory-heading">
            <h2 id="korean-directory-title">어디로 갈까요?</h2>
            <span>문 하나를 골라 보세요</span>
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

        <aside className="korean-note">
          <p>작은 안내</p>
          <strong>지갑이나 계정 없이 둘러봐도 됩니다. 이 건물의 구조를 이해하는 척도 하지 않아도 돼요.</strong>
        </aside>

        <footer className="korean-footer">
          <span>번역: otto, 사전, 그리고 적당한 겸손</span>
          <Link to="/">나머지 이상한 곳 보기 →</Link>
        </footer>
      </section>
    </main>
  )
}
