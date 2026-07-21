import { useState } from 'react';
import { motion } from 'framer-motion';

type CellVal = 'X' | 'O' | null;

const winLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const checkWinner = (b: CellVal[]): CellVal => {
  for (const [a, bI, c] of winLines) {
    if (b[a] && b[a] === b[bI] && b[a] === b[c]) return b[a];
  }
  return null;
};

const TicTacToe = () => {
  const [board, setBoard] = useState<CellVal[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = checkWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);

    // Simple AI for O
    if (!checkWinner(next) && !next.every(Boolean)) {
      setTimeout(() => {
        const empty = next.map((v, idx) => v === null ? idx : -1).filter(v => v >= 0);
        // Try to win
        for (const idx of empty) {
          const test = [...next]; test[idx] = 'O';
          if (checkWinner(test) === 'O') { test[idx] = 'O'; setBoard(test); setXIsNext(true); return; }
        }
        // Try to block
        for (const idx of empty) {
          const test = [...next]; test[idx] = 'X';
          if (checkWinner(test) === 'X') { const b2 = [...next]; b2[idx] = 'O'; setBoard(b2); setXIsNext(true); return; }
        }
        // Take center or random
        if (empty.includes(4)) { const b2 = [...next]; b2[4] = 'O'; setBoard(b2); }
        else { const b2 = [...next]; b2[empty[Math.floor(Math.random() * empty.length)]] = 'O'; setBoard(b2); }
        setXIsNext(true);
      }, 350);
    }
  };

  const reset = () => { setBoard(Array(9).fill(null)); setXIsNext(true); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem' }}>
      <p style={{ color: 'white', fontSize: 18, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
        {winner ? `${winner} Wins! 🎉` : isDraw ? "It's a Draw!" : `Your Turn (${xIsNext ? 'X' : 'O'})`}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 6, width: 240, height: 240 }}>
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileHover={!cell && !winner ? { scale: 1.05, backgroundColor: 'rgba(255,255,255,0.12)' } : {}}
            whileTap={!cell && !winner ? { scale: 0.95 } : {}}
            onClick={() => handleClick(i)}
            style={{
              width: '100%', height: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800,
              color: cell === 'X' ? '#4DABF7' : '#FF6B6B',
              cursor: cell || winner ? 'default' : 'pointer',
              fontFamily: "'Outfit', sans-serif",
              transition: 'background 0.2s',
            }}
          >
            {cell}
          </motion.button>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={reset}
        style={{
          padding: '8px 24px', borderRadius: 20,
          background: 'rgba(255,255,255,0.1)', border: 'none',
          color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
        }}
      >
        Reset
      </motion.button>
    </div>
  );
};

export default TicTacToe;
