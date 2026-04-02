import { useState } from 'react'
import './Puzzle2Cryptic.css'

const CLUE = 'Rearranged chairs on display (6)'
const ANSWER = 'CHAIRS'

export default function Puzzle2Cryptic({ onComplete }) {
  const [guess, setGuess] = useState('')
  const [shake, setShake] = useState(false)
  const [solved, setSolved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (guess.toUpperCase().trim() === ANSWER) {
      setSolved(true)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="cryptic">
      <div className="cryptic-card">
        <span className="cryptic-label">Cryptic Clue</span>
        <p className="cryptic-clue">{CLUE}</p>
      </div>

      {solved ? (
        <div className="cryptic-message">
          <p>You cracked it!</p>
          <button className="btn" onClick={onComplete}>
            Next Puzzle
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="cryptic-form">
          <input
            className={`cryptic-input ${shake ? 'shake' : ''}`}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Your answer..."
            autoFocus
          />
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  )
}
