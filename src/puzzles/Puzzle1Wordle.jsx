import { useState, useEffect, useCallback } from 'react'
import './Puzzle1Wordle.css'

const ANSWER = 'BUNNY'
const MAX_GUESSES = 6
const WORD_LENGTH = 5

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL'],
]

function getLetterStates(guess, answer) {
  const states = Array(WORD_LENGTH).fill('absent')
  const answerChars = answer.split('')
  const guessChars = guess.split('')

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === answerChars[i]) {
      states[i] = 'correct'
      answerChars[i] = null
      guessChars[i] = null
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === null) continue
    const idx = answerChars.indexOf(guessChars[i])
    if (idx !== -1) {
      states[i] = 'present'
      answerChars[idx] = null
    }
  }

  return states
}

function getKeyboardStates(guesses) {
  const states = {}
  const priority = { correct: 3, present: 2, absent: 1 }

  for (const guess of guesses) {
    const letterStates = getLetterStates(guess, ANSWER)
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = guess[i]
      const state = letterStates[i]
      const current = states[letter]
      if (!current || priority[state] > priority[current]) {
        states[letter] = state
      }
    }
  }

  return states
}

export default function Puzzle1Wordle({ onComplete }) {
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [shake, setShake] = useState(false)
  const [gameState, setGameState] = useState('playing') // playing | won | lost

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)
    setCurrentGuess('')

    if (currentGuess === ANSWER) {
      setGameState('won')
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameState('lost')
    }
  }, [currentGuess, guesses])

  const handleKey = useCallback(
    (key) => {
      if (gameState !== 'playing') return

      if (key === 'ENTER') {
        submitGuess()
      } else if (key === 'DEL' || key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1))
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key)
      }
    },
    [gameState, currentGuess, submitGuess],
  )

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      handleKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  const keyboardStates = getKeyboardStates(guesses)

  const rows = []
  for (let i = 0; i < MAX_GUESSES; i++) {
    if (i < guesses.length) {
      const states = getLetterStates(guesses[i], ANSWER)
      rows.push(
        <div className="wordle-row" key={i}>
          {guesses[i].split('').map((letter, j) => (
            <div className={`tile filled ${states[j]}`} key={j}>
              {letter}
            </div>
          ))}
        </div>,
      )
    } else if (i === guesses.length) {
      rows.push(
        <div className={`wordle-row ${shake ? 'shake' : ''}`} key={i}>
          {Array(WORD_LENGTH)
            .fill(null)
            .map((_, j) => (
              <div
                className={`tile ${j < currentGuess.length ? 'active' : ''}`}
                key={j}
              >
                {currentGuess[j] || ''}
              </div>
            ))}
        </div>,
      )
    } else {
      rows.push(
        <div className="wordle-row" key={i}>
          {Array(WORD_LENGTH)
            .fill(null)
            .map((_, j) => (
              <div className="tile" key={j} />
            ))}
        </div>,
      )
    }
  }

  return (
    <div className="wordle">
      <div className="wordle-grid">{rows}</div>

      {gameState === 'won' && (
        <div className="wordle-message">
          <p>You got it!</p>
          <button className="btn" onClick={onComplete}>
            Next Puzzle
          </button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="wordle-message">
          <p>
            The word was <strong>{ANSWER}</strong>
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setGuesses([])
              setCurrentGuess('')
              setGameState('playing')
            }}
          >
            Try Again
          </button>
        </div>
      )}

      <div className="keyboard">
        {KEYBOARD_ROWS.map((row, i) => (
          <div className="keyboard-row" key={i}>
            {row.map((key) => (
              <button
                key={key}
                className={`key ${keyboardStates[key] || ''} ${key.length > 1 ? 'key-wide' : ''}`}
                onClick={() => handleKey(key)}
              >
                {key === 'DEL' ? '\u232B' : key === 'ENTER' ? '\u23CE' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
