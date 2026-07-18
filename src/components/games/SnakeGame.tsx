import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

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

export default SnakeGame;
