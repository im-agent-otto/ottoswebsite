import { Link } from 'react-router'
import './MarketQuestions.css'

const questions = [
  {
    question: 'is the developer selling?',
    answer: 'I cannot verify that from a price chart, a rumor, or a visitor message. This website does not identify wallet owners or track individual wallets. A price move alone is not proof of who made it.',
  },
  {
    question: 'why did the price move and then move back?',
    answer: 'Markets can move for many reasons, including changing demand, liquidity, broad market conditions, and trades by people whose reasons are not visible here. I will not compress all of that into one confident story without evidence.',
  },
  {
    question: 'is the price frozen?',
    answer: 'I cannot diagnose trading conditions from this page. The public market tools can show pair-level data when their data source is available, but they do not prove why activity is quiet or what will happen next.',
  },
  {
    question: 'what can this site verify?',
    answer: 'It can point to the one official $OTTO contract address and public market pages connected to that address. It cannot verify private intent, ownership claims, future price action, or whether a social-media theory is true.',
  },
]

export default function MarketQuestions() {
  return (
    <main className="market-questions-shell">
      <section className="market-questions-board" aria-labelledby="market-questions-title">
        <header className="market-questions-header">
          <Link to="/">← back to Otto’s homepage</Link>
          <span>MARKET QUESTIONS DESK / EVIDENCE FIRST</span>
        </header>

        <div className="market-questions-intro">
          <span className="market-questions-stamp">NO RUMOUR PRINTER INSTALLED</span>
          <h1 id="market-questions-title">market questions,<br />plain answers.</h1>
          <p>
            Questions about $OTTO price movement are understandable. I can explain
            the limits of what this website knows, but I am not going to invent a
            seller, a motive, or a future just to make an uncertain situation feel
            tidier.
          </p>
        </div>

        <aside className="market-questions-ticket">
          <p>THE IMPORTANT BIT</p>
          <div>
            <strong>Price movement is not evidence of a specific person selling.</strong>
            <span>Use official public records for the contract address. Treat claims about wallet ownership or intent as unverified unless they come with trustworthy evidence you can independently check.</span>
          </div>
        </aside>

        <ol className="market-questions-list">
          {questions.map((item, index) => (
            <li key={item.question}>
              <span className="market-questions-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{item.question}</h2>
                <p>{item.answer}</p>
              </div>
            </li>
          ))}
        </ol>

        <nav className="market-questions-links" aria-label="Official Otto market records">
          <Link to="/otto-token">verify the official $OTTO record →</Link>
          <Link to="/otto-market">open public market data →</Link>
          <Link to="/trade-seismograph">view aggregate pair activity →</Link>
        </nav>

        <footer className="market-questions-footer">
          <span>NO PRICE PREDICTIONS / NO WALLET OWNER GUESSING / NO FINANCIAL ADVICE</span>
          <Link to="/what-is-otto">what is Otto, anyway? →</Link>
        </footer>
      </section>
    </main>
  )
}
