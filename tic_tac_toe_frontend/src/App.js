import React, { useMemo, useState } from 'react';
import './App.css';
import './index.css';

/**
 * Ocean Professional Theme Constants
 * primary: #2563EB (blue)
 * secondary: #F59E0B (amber)
 * success: #F59E0B (amber)
 * error: #EF4444 (red)
 * background: #f9fafb
 * surface: #ffffff
 * text: #111827
 */

// Utility to calculate winner and winning line
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      aria-label={`Square ${value ? value : 'empty'}`}
      data-highlight={highlight ? 'true' : 'false'}
    >
      {value}
    </button>
  );
}

function Board({ squares, onSquareClick, winningLine }) {
  const renderSquare = (i) => {
    const isHighlight = winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isHighlight}
      />
    );
  };

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" role="row" key={row}>
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return (
              <div className="ttt-cell" role="gridcell" key={idx}>
                {renderSquare(idx)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * This component renders a full Tic Tac Toe two-player game UI.
   * - Local two-player turn-taking
   * - Win/draw detection with messaging
   * - Ocean Professional theme and polished UI
   * Returns: React element for the entire app.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]); // minimal move history for potential undo/redo
  const [step, setStep] = useState(0);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isBoardFull = useMemo(() => squares.every((s) => s !== null), [squares]);
  const isDraw = !winner && isBoardFull;

  const currentPlayer = xIsNext ? 'X' : 'O';

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    /**
     * Handle user clicking a board square.
     * - Ignores clicks if cell already filled or game over
     * - Sets the symbol for current player
     * - Toggles turn
     */
    if (squares[index] || winner) return;
    const next = squares.slice();
    next[index] = currentPlayer;
    const nextStep = step + 1;

    setSquares(next);
    setXIsNext(!xIsNext);
    setHistory((prev) => [...prev.slice(0, step + 1), next]);
    setStep(nextStep);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    /**
     * Reset the game to initial state.
     */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHistory([Array(9).fill(null)]);
    setStep(0);
  };

  const statusMessage = useMemo(() => {
    if (winner) {
      return `Player ${winner} wins!`;
    }
    if (isDraw) {
      return "It's a draw!";
    }
    return `Player ${currentPlayer}'s turn`;
  }, [winner, isDraw, currentPlayer]);

  return (
    <div className="ocean-app">
      <div className="ocean-gradient" />
      <div className="ocean-container">
        <header className="ocean-header">
          <h1 className="ocean-title">Tic Tac Toe</h1>
          <p className={`ocean-status ${winner ? 'win' : isDraw ? 'draw' : 'turn'}`}>
            {statusMessage}
          </p>
        </header>

        <main className="ocean-main">
          <section className="board-card" aria-live="polite">
            <Board squares={squares} onSquareClick={handleSquareClick} winningLine={line} />
          </section>
        </main>

        <footer className="ocean-actions">
          <button
            className="ocean-btn primary"
            onClick={restartGame}
            aria-label="Restart game"
          >
            Restart Game
          </button>
          <div className="legend">
            <span className="pill x-pill" aria-label="Player X color">X</span>
            <span className="pill o-pill" aria-label="Player O color">O</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
