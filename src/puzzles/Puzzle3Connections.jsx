import { useState } from 'react'
import './Puzzle3Connections.css'

const GROUPS = [
  { label: 'Fruits', color: '#22c55e', words: ['APPLE', 'MANGO', 'PEACH', 'GRAPE'] },
  { label: 'Colors', color: '#eab308', words: ['IVORY', 'CORAL', 'AMBER', 'SLATE'] },
  { label: 'Planets', color: '#3b82f6', words: ['VENUS', 'EARTH', 'PLUTO', 'MARS'] },
  { label: 'Dances', color: '#c084fc', words: ['SALSA', 'TANGO', 'WALTZ', 'POLKA'] },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ALL_WORDS = GROUPS.flatMap((g) => g.words)

export default function Puzzle3Connections({ onComplete }) {
  const [tiles] = useState(() => shuffle(ALL_WORDS))
  const [selected, setSelected] = useState([])
  const [solved, setSolved] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState(false)
  const MAX_MISTAKES = 4

  const toggle = (word) => {
    if (solved.some((g) => g.words.includes(word))) return
    setSelected((prev) =>
      prev.includes(word)
        ? prev.filter((w) => w !== word)
        : prev.length < 4
          ? [...prev, word]
          : prev,
    )
  }

  const submit = () => {
    if (selected.length !== 4) return

    const match = GROUPS.find(
      (g) =>
        !solved.includes(g) &&
        g.words.every((w) => selected.includes(w)),
    )

    if (match) {
      setSolved((prev) => [...prev, match])
      setSelected([])
      if (solved.length + 1 === GROUPS.length) {
        // all solved — handled in render
      }
    } else {
      setMistakes((m) => m + 1)
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setSelected([])
      }, 500)
    }
  }

  const allSolved = solved.length === GROUPS.length
  const lost = mistakes >= MAX_MISTAKES

  return (
    <div className="connections">
      {/* Solved groups */}
      {solved.map((group) => (
        <div
          className="conn-solved"
          key={group.label}
          style={{ background: group.color }}
        >
          <strong>{group.label}</strong>
          <span>{group.words.join(', ')}</span>
        </div>
      ))}

      {/* Remaining tiles */}
      {!allSolved && !lost && (
        <>
          <div className={`conn-grid ${shake ? 'shake' : ''}`}>
            {tiles
              .filter((w) => !solved.some((g) => g.words.includes(w)))
              .map((word) => (
                <button
                  key={word}
                  className={`conn-tile ${selected.includes(word) ? 'selected' : ''}`}
                  onClick={() => toggle(word)}
                >
                  {word}
                </button>
              ))}
          </div>

          <div className="conn-controls">
            <div className="conn-mistakes">
              {Array(MAX_MISTAKES)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`mistake-dot ${i < mistakes ? 'used' : ''}`}
                  />
                ))}
            </div>
            <div className="conn-buttons">
              <button
                className="btn btn-secondary"
                onClick={() => setSelected([])}
              >
                Clear
              </button>
              <button
                className="btn"
                disabled={selected.length !== 4}
                onClick={submit}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}

      {allSolved && (
        <div className="conn-message">
          <p>Perfect!</p>
          <button className="btn" onClick={onComplete}>
            Next Puzzle
          </button>
        </div>
      )}

      {lost && (
        <div className="conn-message">
          <p>Out of guesses! Try again.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSolved([])
              setSelected([])
              setMistakes(0)
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
