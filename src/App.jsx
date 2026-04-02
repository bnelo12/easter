import { useState } from 'react'
import Puzzle1Wordle from './puzzles/Puzzle1Wordle'
import Puzzle2Cryptic from './puzzles/Puzzle2Cryptic'
import Puzzle3Connections from './puzzles/Puzzle3Connections'
import './App.css'

const PUZZLE_NAMES = [
  'Puzzle 1',
  'Puzzle 2',
  'Puzzle 3',
  'Puzzle 4',
  'Puzzle 5',
  'Puzzle 6',
]

function IntroScreen({ onStart }) {
  return (
    <div className="screen intro-screen">
      <h1>Claire's Easter Surprise</h1>
      <p className="subtitle">
        Welcome, Claire! Somewhere nearby, an Easter egg is hidden just for you.
      </p>
      <p>
        To find out where it is, you'll need to solve <strong>6 puzzles</strong>.
        Each one will bring you closer to the final secret.
      </p>
      <p>Good luck!</p>
      <button className="btn" onClick={onStart}>
        Let's Go!
      </button>
    </div>
  )
}

const PUZZLES = [Puzzle1Wordle, Puzzle2Cryptic, Puzzle3Connections, null, null, null]

function PuzzleScreen({ puzzleIndex, onComplete }) {
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
      <h2>Puzzle {number} of 6</h2>
      {PuzzleComponent ? (
        <PuzzleComponent onComplete={onComplete} />
      ) : (
        <>
          <div className="puzzle-placeholder">
            <p>Coming soon...</p>
          </div>
          <button className="btn" onClick={onComplete}>
            Complete (placeholder)
          </button>
        </>
      )}
    </div>
  )
}

function RevealScreen() {
  return (
    <div className="screen reveal-screen">
      <h1>You did it!</h1>
      <p className="subtitle">
        You solved all 6 puzzles. Here's where your Easter egg is hiding:
      </p>
      <div className="reveal-box">
        <p className="secret">???</p>
      </div>
    </div>
  )
}

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  // 0 = intro, 1-6 = puzzles, 7 = reveal

  if (currentStep === 0) {
    return <IntroScreen onStart={() => setCurrentStep(1)} />
  }

  if (currentStep >= 1 && currentStep <= 6) {
    return (
      <PuzzleScreen
        puzzleIndex={currentStep - 1}
        onComplete={() => setCurrentStep(currentStep + 1)}
      />
    )
  }

  return <RevealScreen />
}

export default App
