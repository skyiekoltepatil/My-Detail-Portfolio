import { useState } from 'react';
import { motion } from 'framer-motion';

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

export default MemoryMatch;
