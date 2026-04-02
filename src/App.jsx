import { useState } from 'react'
import Puzzle1Wordle from './puzzles/Puzzle1Wordle'
import Puzzle2Cryptic from './puzzles/Puzzle2Cryptic'
import Puzzle3Connections from './puzzles/Puzzle3Connections'
import './App.css'

const PUZZLE_NAMES = ['Puzzle 1', 'Puzzle 2', 'Puzzle 3']

const SECRET_PARTS = [
  'The easter egg is hidden',
  'in the',
  'closet',
]

function SecretReveal({ solved }) {
  return (
    <div className="secret-reveal">
      {SECRET_PARTS.map((part, i) => (
        <span key={i} className={`secret-part ${i < solved ? 'revealed' : ''}`}>
          {i < solved ? part : part.replace(/\S/g, '_')}
        </span>
      ))}
    </div>
  )
}

function IntroScreen({ onStart }) {
  return (
    <div className="screen intro-screen">
      <h1>Claire's Easter Surprise</h1>
      <p className="subtitle">
        Welcome, Claire! Somewhere nearby, an Easter egg is hidden just for you.
      </p>
      <p>
        To find out where it is, you'll need to solve <strong>3 puzzles</strong>.
        Each one will bring you closer to the final secret.
      </p>
      <p>Good luck!</p>
      <button className="btn" onClick={onStart}>
        Let's Go!
      </button>
    </div>
  )
}

const PUZZLES = [Puzzle1Wordle, Puzzle2Cryptic, Puzzle3Connections]

function PuzzleScreen({ puzzleIndex, onComplete }) {
  const [solved, setSolved] = useState(false)
  const number = puzzleIndex + 1
  const PuzzleComponent = PUZZLES[puzzleIndex]

  return (
    <div className="screen puzzle-screen">
      <div className="progress">
        {PUZZLE_NAMES.map((_, i) => (
          <div
            key={i}
            className={`dot ${i < puzzleIndex ? 'done' : ''} ${i === puzzleIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <h2>Puzzle {number} of 3</h2>
      {PuzzleComponent ? (
        <PuzzleComponent onComplete={() => setSolved(true)} />
      ) : (
        <>
          <div className="puzzle-placeholder">
            <p>Coming soon...</p>
          </div>
          <button className="btn" onClick={() => setSolved(true)}>
            Complete (placeholder)
          </button>
        </>
      )}
      {solved && (
        <div className="overlay">
          <div className="overlay-box">
            <h2>Puzzle {number} complete!</h2>
            {puzzleIndex < 2 && <SecretReveal solved={puzzleIndex + 1} />}
            <button className="btn" onClick={onComplete}>
              {puzzleIndex < 2 ? 'Next Puzzle' : 'See the Answer'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function RevealScreen() {
  return (
    <div className="screen reveal-screen">
      <h1>You did it!</h1>
      <p className="subtitle">
        You solved all 3 puzzles. Here's where your Easter egg is hiding:
      </p>
      <SecretReveal solved={3} />
    </div>
  )
}

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  // 0 = intro, 1-3 = puzzles, 4 = reveal

  if (currentStep === 0) {
    return <IntroScreen onStart={() => setCurrentStep(1)} />
  }

  if (currentStep >= 1 && currentStep <= 3) {
    return (
      <PuzzleScreen
        key={currentStep}
        puzzleIndex={currentStep - 1}
        onComplete={() => setCurrentStep(currentStep + 1)}
      />
    )
  }

  return <RevealScreen />
}

export default App
