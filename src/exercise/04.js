// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = React.useState(() => {
    const item = window.localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    } else {
      return defaultValue
    }
  })
  React.useEffect(() => {
    console.log('calling useEffect')
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

function Board({squares, selectSquare, nextSquare, restart}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [squaresHistory, setSquaresHistory] = useLocalStorageState(
    'squaresHistory',
    [Array(9).fill(null)],
  )
  const [currentStep, setCurrentStep] = useLocalStorageState('stepNumber', 0)
  const currentSquares = squaresHistory[currentStep]
  console.dir(currentSquares)
  const squares = currentSquares
  const isCurrent = currentStep === squaresHistory.length - 1

  function returnToStep(step) {
    setCurrentStep(step)
  }

  function moves(squaresHistory) {
    return (
      <>
        {squaresHistory.map((x, idx) => (
          <li id={idx}>
            <button
              onClick={() => {
                returnToStep(idx)
              }}
              disabled={idx===currentStep}
            >{`move ${idx} ${idx===currentStep? '(current)' : ''}`}</button>
          </li>
        ))}
      </>
    )
  }

  function setSquares(squaresCopy) {
    if (isCurrent) {
      const squaresHistoryCopy = [...squaresHistory].map(x => [...x])
      squaresHistoryCopy[currentStep + 1] = squaresCopy
      setCurrentStep(currentStep + 1)
      setSquaresHistory(squaresHistoryCopy)
    }
  }
  function selectSquare(square) {
    if (squares[square] != null || calculateWinner(squares) || !isCurrent) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = calculateNextValue(squares)
    setSquares(squaresCopy)
  }

  function restart() {
    setSquares(Array(9).fill(null))
    setCurrentStep(0)
    setSquaresHistory([Array(9).fill(null)])
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} selectSquare={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>
          {calculateStatus(
            calculateWinner(currentSquares),
            currentSquares,
            calculateNextValue(currentSquares),
          )}
        </div>
        <ol>{moves(squaresHistory)}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  console.dir(squares)
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  console.dir(squares)
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
