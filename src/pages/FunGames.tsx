import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScribblePad from '../components/ScribblePad';

/* ──────────────────────────────────────────────
   Game definitions
   ────────────────────────────────────────────── */

interface GameDef {
  id: string;
  title: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
}

const games: GameDef[] = [
  {
    id: 'scribble',
    title: 'Scribble Pad',
    description: 'Draw, sketch and let your creativity flow on an infinite canvas.',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M8 40L16 32L24 36L32 24L40 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 8L40 12L20 32L16 32L16 28L36 8Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="16" r="4" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'Classic X & O game. Challenge yourself against smart AI.',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <line x1="16" y1="8" x2="16" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="8" x2="32" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="16" x2="40" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="32" x2="40" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="4" stroke="white" strokeWidth="2" />
        <path d="M10 10L14 14M14 10L10 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Flip and match pairs of cards. Test your memory skills!',
    gradient: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="10" width="14" height="18" rx="3" stroke="white" strokeWidth="2.5" />
        <rect x="28" y="10" width="14" height="18" rx="3" stroke="white" strokeWidth="2.5" />
        <path d="M13 16V22M35 16V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 36H38" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
      </svg>
    ),
  },
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Guide the snake, eat food and grow. A retro classic!',
    gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M8 24C8 18 12 14 18 14C24 14 24 22 30 22C36 22 40 18 40 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="40" cy="14" r="3" fill="white" />
        <rect x="20" y="32" width="6" height="6" rx="1" fill="white" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'macstickers',
    title: 'Mac Stickers',
    description: 'Decorate a MacBook with interactive 3D physics stickers.',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="12" width="36" height="24" rx="2" stroke="white" strokeWidth="2.5" />
        <path d="M4 36H44" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="3" fill="white" />
      </svg>
    ),
  },
];

/* ──────────────────────────────────────────────
   Eye Icon SVG
   ────────────────────────────────────────────── */

const EyeIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path
      d="M18 8C10 8 4 18 4 18C4 18 10 28 18 28C26 28 32 18 32 18C32 18 26 8 18 8Z"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="18" r="5" stroke="white" strokeWidth="2.5" />
    <circle cx="18" cy="18" r="2" fill="white" />
  </svg>
);

/* ──────────────────────────────────────────────
   Tic Tac Toe Game Component
   ────────────────────────────────────────────── */

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
        {winner ? `${winner} Wins! 🎉` : isDraw ? "It's a Draw!" : `Your Turn (X)`}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, width: 240, height: 240 }}>
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

/* ──────────────────────────────────────────────
   Memory Match Game Component
   ────────────────────────────────────────────── */

const emojis = ['🎨', '🚀', '⚡', '🎯', '🎵', '💎', '🔥', '🌟'];

const MemoryMatch = () => {
  const [cards] = useState(() => {
    const doubled = [...emojis, ...emojis];
    for (let i = doubled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
    }
    return doubled;
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const handleFlip = (i: number) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      if (cards[next[0]] === cards[next[1]]) {
        setMatched(m => [...m, ...next]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const isComplete = matched.length === cards.length;

  const reset = () => {
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem' }}>
      <p style={{ color: 'white', fontSize: 18, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
        {isComplete ? `Completed in ${moves} moves! 🎉` : `Moves: ${moves}`}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, width: 280 }}>
        {cards.map((emoji, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <motion.button
              key={i}
              whileHover={!isFlipped ? { scale: 1.08 } : {}}
              whileTap={!isFlipped ? { scale: 0.95 } : {}}
              onClick={() => handleFlip(i)}
              style={{
                width: 62, height: 62,
                borderRadius: 12,
                background: isFlipped
                  ? matched.includes(i) ? 'rgba(105, 219, 124, 0.2)' : 'rgba(255,255,255,0.1)'
                  : 'rgba(255,255,255,0.06)',
                border: `1px solid ${isFlipped ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isFlipped ? 28 : 18,
                cursor: isFlipped ? 'default' : 'pointer',
                transition: 'background 0.3s, border 0.3s',
              }}
            >
              {isFlipped ? emoji : '?'}
            </motion.button>
          );
        })}
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

/* ──────────────────────────────────────────────
   Snake Game Component
   ────────────────────────────────────────────── */

import { useEffect, useRef, useCallback } from 'react';

const GRID = 24;
const CELL = 20;

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirRef = useRef({ x: 1, y: 0 });
  const snakeRef = useRef([{ x: 5, y: 5 }]);
  const foodRef = useRef({ x: 10, y: 10 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameOverRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const spawnFood = useCallback(() => {
    let pos: { x: number; y: number };
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snakeRef.current.some(s => s.x === pos.x && s.y === pos.y));
    foodRef.current = pos;
  }, []);

  const resetGame = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    snakeRef.current = [{ x: 5, y: 5 }];
    dirRef.current = { x: 1, y: 0 };
    gameOverRef.current = false;
    spawnFood();
    setScore(0);
    setGameOver(false);
    setGameKey(k => k + 1);
  }, [spawnFood]);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, GRID * CELL); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(GRID * CELL, i * CELL); ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(foodRef.current.x * CELL + CELL / 2, foodRef.current.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snakeRef.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#69DB7C' : '#4DABF7';
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4);
      ctx.fill();
    });
  }, []);

  // Game loop — re-runs every time gameKey changes (i.e. on reset)
  useEffect(() => {
    draw();

    const gameTick = () => {
      if (gameOverRef.current) return;

      const head = snakeRef.current[0];
      const newHead = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };

      if (newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID ||
        snakeRef.current.some(s => s.x === newHead.x && s.y === newHead.y)) {
        gameOverRef.current = true;
        setGameOver(true);
        if (intervalRef.current) clearTimeout(intervalRef.current);
        return;
      }

      snakeRef.current = [newHead, ...snakeRef.current];
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        setScore(s => s + 1);
        spawnFood();
      } else {
        snakeRef.current.pop();
      }
      draw();

      // Start at 220ms, get 6ms faster for each food eaten, cap at 50ms
      const speed = Math.max(50, 220 - (snakeRef.current.length - 1) * 6);
      intervalRef.current = window.setTimeout(gameTick, speed);
    };

    intervalRef.current = window.setTimeout(gameTick, 220);
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current); };
  }, [gameKey, draw, spawnFood]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && d.y !== 1) dirRef.current = { x: 0, y: -1 };
      if ((e.key === 'ArrowDown' || e.key === 's') && d.y !== -1) dirRef.current = { x: 0, y: 1 };
      if ((e.key === 'ArrowLeft' || e.key === 'a') && d.x !== 1) dirRef.current = { x: -1, y: 0 };
      if ((e.key === 'ArrowRight' || e.key === 'd') && d.x !== -1) dirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
      <p style={{ color: 'white', fontSize: 18, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
        {gameOver ? `Game Over! Score: ${score}` : `Score: ${score}`}
      </p>
      <canvas
        ref={canvasRef}
        width={GRID * CELL}
        height={GRID * CELL}
        style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}
      />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
        Use Arrow Keys or WASD to move
      </p>
      {gameOver && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          style={{
            padding: '8px 24px', borderRadius: 20,
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
          }}
        >
          Play Again
        </motion.button>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────
   Game Modal
   ────────────────────────────────────────────── */

import MacbookStickers from '../components/MacbookStickers';

const GameModal = ({ game, onClose }: { game: GameDef; onClose: () => void }) => {
  const renderGame = () => {
    switch (game.id) {
      case 'scribble':
        return (
          <ScribblePad
            backgroundColor="#1a1a1a"
            colors={['#FF6B6B', '#FFA94D', '#69DB7C', '#4DABF7', '#CC5DE8', '#ffffff']}
            strokeWidths={[4, 8, 12, 16, 20]}
            defaultStrokeWidth={8}
            defaultStrokeColor="#4DABF7"
            borderRadius="12px"
            height="400px"
            wiggle={{ enable: true, movement: 0.5, speed: 2 }}
          />
        );
      case 'tictactoe':
        return <TicTacToe />;
      case 'memory':
        return <MemoryMatch />;
      case 'snake':
        return <SnakeGame />;
      case 'macstickers':
        return <MacbookStickers />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        padding: '1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0a0a0a',
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: game.id === 'macstickers' ? 1200 : 700,
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              margin: 0,
            }}
          >
            {game.title}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.6)',
              transition: 'background 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.button>
        </div>

        {/* Game Content */}
        <div style={{ padding: '1.5rem' }}>
          {renderGame()}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────
   Game Card with Eye Hover
   ────────────────────────────────────────────── */

const GameCard = ({ game, index, onClick }: { game: GameDef; index: number; onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="game-card-wrapper"
      style={{ cursor: 'pointer' }}
    >
      <div
        className="game-card"
        style={{
          background: game.gradient,
          borderRadius: '1.5rem',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease',
          height: '100%',
          minHeight: 240,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Background icon (subtle) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <div style={{ transform: 'scale(3)' }}>{game.icon}</div>
        </div>

        {/* Icon */}
        <div
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            opacity: 0.6,
          }}
        >
          {game.icon}
        </div>

        {/* Eye overlay on hover */}
        <div
          className="game-card-eye"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            borderRadius: '1.5rem',
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            <EyeIcon />
          </div>
          <span
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Play Now
          </span>
        </div>

        {/* Title & description */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3
            style={{
              color: 'white',
              fontSize: '1.35rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {game.title}
          </h3>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {game.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────
   Main FunGames Page
   ────────────────────────────────────────────── */

export const FunGames = () => {
  const [activeGame, setActiveGame] = useState<GameDef | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeGame) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeGame]);

  return (
    <>
      <style>{`
        .game-card-wrapper:hover .game-card {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
        }
        .game-card-wrapper:hover .game-card-eye {
          opacity: 1 !important;
        }
      `}</style>

      <section id="fun-games" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-4">
              Fun <span className="text-gradient">Games</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
              Take a break and have some fun with these interactive experiences.
            </p>
          </div>

          {/* Games Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            {games.map((game, i) => (
              <GameCard
                key={game.id}
                game={game}
                index={i}
                onClick={() => setActiveGame(game)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Game Modal Popup */}
      <AnimatePresence>
        {activeGame && (
          <GameModal game={activeGame} onClose={() => setActiveGame(null)} />
        )}
      </AnimatePresence>
    </>
  );
};
